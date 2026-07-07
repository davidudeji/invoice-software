import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generateBusinessSummary } from '@/lib/ai';
import type { ReportData } from '@/types';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api/ai');

// ─────────────────────────────────────────────
// POST /api/ai/report
// Generate a Gemini AI executive summary for a date range
// ─────────────────────────────────────────────

const ReportSchema = z.object({
  dateFrom: z.string().min(1, 'dateFrom is required'),
  dateTo: z.string().min(1, 'dateTo is required'),
  userId: z.string().min(1, 'userId is required'),
});

app.post('/report', async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const parsed = ReportSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400);
  }

  const { dateFrom, dateTo, userId } = parsed.data;
  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  try {
    const [salesAgg, outstandingAgg, overdueCount, invoiceItems, salesByDate] =
      await Promise.all([
        prisma.sale.aggregate({
          where: { userId, saleDate: { gte: from, lte: to } },
          _sum: { totalAmount: true },
          _count: true,
        }),
        prisma.invoice.aggregate({
          where: { userId, status: { in: ['SENT', 'PARTIALLY_PAID', 'DRAFT'] } },
          _sum: { total: true },
        }),
        prisma.invoice.count({
          where: { userId, status: 'OVERDUE' },
        }),
        prisma.invoiceItem.findMany({
          where: {
            invoice: { userId, status: 'PAID', paidAt: { gte: from, lte: to } },
            productId: { not: null },
          },
          include: { product: { select: { name: true } } },
        }),
        prisma.sale.findMany({
          where: { userId, saleDate: { gte: from, lte: to } },
          select: { saleDate: true, totalAmount: true },
          orderBy: { saleDate: 'asc' },
        }),
      ]);

    // Top products
    const productMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
    for (const item of invoiceItems) {
      const name = item.product?.name || item.description;
      if (!productMap[name]) productMap[name] = { name, quantity: 0, revenue: 0 };
      productMap[name].quantity += item.quantity;
      productMap[name].revenue += item.total;
    }
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Revenue by week
    const weekMap: Record<string, number> = {};
    for (const s of salesByDate) {
      const week = `Week ${Math.ceil(new Date(s.saleDate).getDate() / 7)} ${new Date(
        s.saleDate
      ).toLocaleString('default', { month: 'short' })}`;
      weekMap[week] = (weekMap[week] || 0) + s.totalAmount;
    }
    const revenueByPeriod = Object.entries(weekMap).map(([label, revenue]) => ({
      label,
      revenue,
    }));

    const reportData: ReportData = {
      dateFrom,
      dateTo,
      totalRevenue: salesAgg._sum.totalAmount || 0,
      totalSalesCount: salesAgg._count,
      outstandingDebt: outstandingAgg._sum.total || 0,
      overdueCount,
      topProducts,
      revenueByPeriod,
    };

    const summary = await generateBusinessSummary(reportData);

    return c.json({
      summary,
      reportData,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Hono /api/ai/report]', error);
    return c.json({ error: 'Failed to generate report. Please try again.' }, 500);
  }
});

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────
app.get('/health', (c) => c.json({ status: 'ok', service: 'InvoicePay AI' }));

export const GET = handle(app);
export const POST = handle(app);
