import { prisma } from '@/lib/prisma';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

export class ReportRepository {
    static async getRevenueMetrics(userId: string) {
        const invoices = await prisma.invoice.findMany({
            where: { userId },
            select: {
                total: true,
                status: true,
            }
        });

        return {
            totalRevenue: invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.total, 0),
            totalInvoices: invoices.length,
            paidInvoices: invoices.filter(inv => inv.status === 'PAID').length,
            pendingInvoices: invoices.filter(inv => inv.status === 'SENT' || inv.status === 'PARTIALLY_PAID' || inv.status === 'OVERDUE').length,
            overdueInvoices: invoices.filter(inv => inv.status === 'OVERDUE').length,
        };
    }

    static async getMonthlyRevenue(userId: string, months: number = 6) {
        const today = new Date();
        const startDate = startOfMonth(subMonths(today, months - 1));

        const paidInvoices = await prisma.invoice.findMany({
            where: {
                userId,
                status: 'PAID',
                date: { gte: startDate }
            },
            select: { total: true, date: true }
        });

        return paidInvoices;
    }

    static async getClientRevenue(userId: string) {
        return prisma.invoice.findMany({
            where: { userId, status: 'PAID' },
            include: {
                client: { select: { name: true } }
            }
        });
    }
}
