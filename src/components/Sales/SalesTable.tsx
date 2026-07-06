'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Calendar, ChevronLeft, ChevronRight, Receipt, ExternalLink, Filter } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

type SaleRecord = {
  id: string;
  totalAmount: number;
  saleDate: Date | string;
  notes: string | null;
  invoice: {
    number: string;
    id: string;
    client: { name: string };
    items: { product: { name: string } | null; description: string; quantity: number; total: number }[];
  };
};

interface Props {
  initialSales: SaleRecord[];
  total: number;
  currentPage: number;
  initialDateFrom: string;
  initialDateTo: string;
}

export function SalesTable({ initialSales, total, currentPage, initialDateFrom, initialDateTo }: Props) {
  const router = useRouter();
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / 20));

  function applyFilters(page = 1) {
    const params = new URLSearchParams();
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    if (page > 1) params.set('page', String(page));
    startTransition(() => {
      router.push(`/sales?${params.toString()}`);
    });
  }

  function clearFilters() {
    setDateFrom('');
    setDateTo('');
    startTransition(() => router.push('/sales'));
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Filter size={14} />
          <span className="font-medium">Filter by date</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
            <span className="text-slate-400 text-sm">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => applyFilters(1)}
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50"
            >
              Apply
            </button>
            {(dateFrom || dateTo) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="text-sm text-slate-500 ml-auto">
          {total} record{total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {initialSales.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Receipt size={40} className="opacity-40" />
            <p className="font-medium">No sales records found</p>
            <p className="text-sm">Sales are created automatically when invoices are marked as paid.</p>
            <Link
              href="/invoices"
              className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View Invoices <ExternalLink size={13} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Sale Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className={isPending ? 'opacity-50' : ''}>
                {initialSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {sale.invoice.number}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-slate-900">{sale.invoice.client.name}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-slate-500 text-xs">
                        {sale.invoice.items.length} item{sale.invoice.items.length !== 1 ? 's' : ''}
                        {sale.invoice.items[0] && (
                          <span className="text-slate-400">
                            {' '}· {sale.invoice.items[0].product?.name ?? sale.invoice.items[0].description}
                            {sale.invoice.items.length > 1 ? ` +${sale.invoice.items.length - 1} more` : ''}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell text-slate-500 text-xs">
                      {format(new Date(sale.saleDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-bold text-slate-900">
                        ${sale.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/invoices/${sale.invoice.id}`}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                        title="View Invoice"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages} · {total} total
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1 || isPending}
              onClick={() => applyFilters(currentPage - 1)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              disabled={currentPage >= totalPages || isPending}
              onClick={() => applyFilters(currentPage + 1)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
