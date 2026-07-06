
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, Download, FileText } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

export default async function ReportsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    // Fetch all invoices for calculations
    // In a real app with large data, we would use aggregate queries
    const invoices = await prisma.invoice.findMany({
        where: { userId: session.user.id },
        include: { client: true }
    });

    // --- Stats Calculation ---
    const totalRevenue = invoices
        .filter(inv => inv.status === 'PAID')
        .reduce((sum, inv) => sum + inv.total, 0);

    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.status === 'PAID').length;
    const pendingInvoices = invoices.filter(inv => inv.status === 'SENT' || inv.status === 'PARTIALLY_PAID' || inv.status === 'OVERDUE').length;

    // --- Chart Data Preparation (Last 6 Months) ---
    const today = new Date();
    const last6Months = eachMonthOfInterval({
        start: subMonths(today, 5),
        end: today
    });

    const revenueChartData = last6Months.map(date => {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);

        const monthlyRevenue = invoices
            .filter(inv =>
                inv.status === 'PAID' &&
                new Date(inv.date) >= monthStart &&
                new Date(inv.date) <= monthEnd
            )
            .reduce((sum, inv) => sum + inv.total, 0);

        return {
            month: format(date, 'MMM'),
            amount: monthlyRevenue,
            fullDate: date
        };
    });

    const maxRevenue = Math.max(...revenueChartData.map(d => d.amount), 1); // Avoid div by 0

    // --- Top Clients ---
    const clientRevenue: Record<string, number> = {};
    invoices.filter(inv => inv.status === 'PAID').forEach(inv => {
        const clientName = inv.client?.name || 'Unknown Client';
        clientRevenue[clientName] = (clientRevenue[clientName] || 0) + inv.total;
    });

    const topClients = Object.entries(clientRevenue)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, amount]) => ({ name, amount }));

    const maxClientRevenue = Math.max(...topClients.map(c => c.amount), 0);


    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reports</h1>
                    <p className="text-slate-500 mt-2">Financial insights and performance metrics.</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <Download size={16} />
                    Export Data
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText size={20} />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total Invoices</p>
                    <h3 className="text-2xl font-bold text-slate-900">{totalInvoices}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <PieChart size={20} />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Paid Invoices</p>
                    <h3 className="text-2xl font-bold text-slate-900">{paidInvoices}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <Calendar size={20} />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Pending Invoices</p>
                    <h3 className="text-2xl font-bold text-slate-900">{pendingInvoices}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue History (Last 6 Months)</h3>
                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        {revenueChartData.map((data, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
                                <div className="w-full relative">
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                        ${data.amount.toLocaleString()}
                                    </div>
                                    <div
                                        className="w-full bg-indigo-500 rounded-t-sm transition-all duration-500 hover:bg-indigo-600"
                                        style={{ height: `${(data.amount / maxRevenue) * 100}%`, minHeight: '4px' }}
                                    />
                                </div>
                                <p className="text-xs text-center text-slate-500 font-medium">{data.month}</p>
                            </div>
                        ))}
                        {revenueChartData.length === 0 && <p className="text-center w-full text-slate-500">No data available.</p>}
                    </div>
                </div>

                {/* Top Clients */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Top Clients by Revenue</h3>
                    <div className="space-y-6">
                        {topClients.length === 0 ? (
                            <p className="text-slate-500 italic text-center py-8">No client data available.</p>
                        ) : (
                            topClients.map((client, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">{client.name}</span>
                                        <span className="font-bold text-slate-900">${client.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(client.amount / maxClientRevenue) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
