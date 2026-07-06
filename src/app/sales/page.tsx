import { getSales } from '@/app/actions/reports';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { SalesTable } from '@/components/Sales/SalesTable';
import { DollarSign, ShoppingBag, TrendingUp, Calendar } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sales Ledger' };
export const revalidate = 60;

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ dateFrom?: string; dateTo?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const dateFrom = params.dateFrom || '';
  const dateTo = params.dateTo || '';

  const { sales, total } = await getSales({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    pageSize: 20,
  });

  // Compute summary stats
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const avgSale = sales.length > 0 ? totalRevenue / sales.length : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AppSidebar />

      <main className="pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8 space-y-8 page-enter">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sales Ledger</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Automatically recorded from paid invoices
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              {
                label: 'Total Sales',
                value: total.toString(),
                sub: 'All records',
                icon: ShoppingBag,
                gradient: 'from-indigo-500 to-indigo-700',
                glow: 'shadow-indigo-500/25',
              },
              {
                label: 'Revenue (this page)',
                value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                sub: 'From filtered sales',
                icon: DollarSign,
                gradient: 'from-emerald-500 to-emerald-700',
                glow: 'shadow-emerald-500/25',
              },
              {
                label: 'Avg Sale Value',
                value: `$${avgSale.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                sub: 'Per transaction',
                icon: TrendingUp,
                gradient: 'from-violet-500 to-violet-700',
                glow: 'shadow-violet-500/25',
              },
              {
                label: 'Page',
                value: `${page} / ${Math.max(1, Math.ceil(total / 20))}`,
                sub: '20 records per page',
                icon: Calendar,
                gradient: 'from-amber-400 to-amber-600',
                glow: 'shadow-amber-400/25',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 text-white shadow-xl ${card.glow}`}
                >
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon size={20} className="text-white" />
                      </div>
                    </div>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
                      {card.label}
                    </p>
                    <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                    <p className="text-white/60 text-xs mt-1">{card.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sales Table (client component for filters) */}
          <SalesTable
            initialSales={sales}
            total={total}
            currentPage={page}
            initialDateFrom={dateFrom}
            initialDateTo={dateTo}
          />
        </div>
      </main>
    </div>
  );
}
