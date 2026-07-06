'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { ReportData, AISummaryResponse } from '@/types';
import { generateBusinessSummary } from '@/lib/ai';

// ─────────────────────────────────────────────
// GET SALES (paginated)
// ─────────────────────────────────────────────

export async function getSales(filters?: {
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) return { sales: [], total: 0 };

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 20;

  const where = {
    userId: session.user.id,
    ...(filters?.dateFrom || filters?.dateTo
      ? {
          saleDate: {
            ...(filters.dateFrom && { gte: new Date(filters.dateFrom) }),
            ...(filters.dateTo && { lte: new Date(filters.dateTo) }),
          },
        }
      : {}),
  };

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      include: {
        invoice: {
          include: {
            client: { select: { name: true } },
            items: { include: { product: { select: { name: true } } } },
          },
        },
      },
      orderBy: { saleDate: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.sale.count({ where }),
  ]);

  return { sales, total };
}

// ─────────────────────────────────────────────
// GET SALES SUMMARY (for dashboard)
// ─────────────────────────────────────────────

export async function getSalesSummary() {
  const session = await auth();
  if (!session?.user?.id) {
    return { totalRevenue: 0, paidCount: 0, outstandingAmount: 0, overdueCount: 0, revenueByMonth: [] };
  }

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [totalRevenue, paidCount, outstandingInvoices, overdueCount, salesByMonth] = await Promise.all([
    // Total revenue (sum of all sales)
    prisma.sale.aggregate({
      where: { userId: session.user.id },
      _sum: { totalAmount: true },
    }),

    // Paid invoices count
    prisma.invoice.count({
      where: { userId: session.user.id, status: 'PAID' },
    }),

    // Outstanding invoices (SENT + PARTIALLY_PAID)
    prisma.invoice.aggregate({
      where: {
        userId: session.user.id,
        status: { in: ['SENT', 'PARTIALLY_PAID', 'DRAFT'] },
      },
      _sum: { total: true },
    }),

    // Overdue invoices count
    prisma.invoice.count({
      where: { userId: session.user.id, status: 'OVERDUE' },
    }),

    // Revenue by month (current year)
    prisma.sale.groupBy({
      by: ['saleDate'],
      where: {
        userId: session.user.id,
        saleDate: { gte: startOfYear },
      },
      _sum: { totalAmount: true },
    }),
  ]);

  // Aggregate sales by month
  const monthlyMap: Record<string, number> = {};
  for (const sale of salesByMonth) {
    const month = new Date(sale.saleDate).toLocaleString('default', { month: 'short' });
    monthlyMap[month] = (monthlyMap[month] || 0) + (sale._sum.totalAmount || 0);
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueByMonth = months.map((month) => ({ month, revenue: monthlyMap[month] || 0 }));

  return {
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    paidCount,
    outstandingAmount: outstandingInvoices._sum.total || 0,
    overdueCount,
    revenueByMonth,
  };
}

// ─────────────────────────────────────────────
// GET REPORT DATA (for date-range reporting)
// ─────────────────────────────────────────────

export async function getReportData(dateFrom: string, dateTo: string): Promise<ReportData> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      dateFrom, dateTo, totalRevenue: 0, totalSalesCount: 0,
      outstandingDebt: 0, overdueCount: 0, topProducts: [], revenueByPeriod: [],
    };
  }

  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  const [salesAgg, outstandingAgg, overdueCount, invoiceItems, salesByDate] = await Promise.all([
    prisma.sale.aggregate({
      where: { userId: session.user.id, saleDate: { gte: from, lte: to } },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { userId: session.user.id, status: { in: ['SENT', 'PARTIALLY_PAID', 'DRAFT'] } },
      _sum: { total: true },
    }),
    prisma.invoice.count({
      where: { userId: session.user.id, status: 'OVERDUE' },
    }),
    // Top products
    prisma.invoiceItem.findMany({
      where: {
        invoice: { userId: session.user.id, status: 'PAID', paidAt: { gte: from, lte: to } },
        productId: { not: null },
      },
      include: { product: { select: { name: true } } },
    }),
    // Revenue by date (group by week)
    prisma.sale.findMany({
      where: { userId: session.user.id, saleDate: { gte: from, lte: to } },
      select: { saleDate: true, totalAmount: true },
      orderBy: { saleDate: 'asc' },
    }),
  ]);

  // Aggregate top products
  const productMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
  for (const item of invoiceItems) {
    const name = item.product?.name || item.description;
    if (!productMap[name]) productMap[name] = { name, quantity: 0, revenue: 0 };
    productMap[name].quantity += item.quantity;
    productMap[name].revenue += item.total;
  }
  const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  // Revenue by week
  const weekMap: Record<string, number> = {};
  for (const s of salesByDate) {
    const week = `Week ${Math.ceil(new Date(s.saleDate).getDate() / 7)} ${new Date(s.saleDate).toLocaleString('default', { month: 'short' })}`;
    weekMap[week] = (weekMap[week] || 0) + s.totalAmount;
  }
  const revenueByPeriod = Object.entries(weekMap).map(([label, revenue]) => ({ label, revenue }));

  return {
    dateFrom,
    dateTo,
    totalRevenue: salesAgg._sum.totalAmount || 0,
    totalSalesCount: salesAgg._count,
    outstandingDebt: outstandingAgg._sum.total || 0,
    overdueCount,
    topProducts,
    revenueByPeriod,
  };
}

// ─────────────────────────────────────────────
// GENERATE AI SUMMARY
// ─────────────────────────────────────────────

export async function generateAISummary(dateFrom: string, dateTo: string): Promise<AISummaryResponse> {
  const data = await getReportData(dateFrom, dateTo);
  const summary = await generateBusinessSummary(data);
  return { summary, generatedAt: new Date().toISOString() };
}
