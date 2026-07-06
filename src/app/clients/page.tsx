import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import Link from 'next/link';
import { Plus, Users, Mail, Phone, Building2, ExternalLink, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Clients' };
export const revalidate = 30;

export default async function ClientsPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const params = await searchParams;
  const query = params?.query || '';

  const clients = await prisma.client.findMany({
    where: {
      userId: session.user.id,
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { companyName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { invoices: true } },
      invoices: { select: { total: true, status: true } },
    },
  });

  const clientsWithStats = clients.map((client) => ({
    ...client,
    totalRevenue: client.invoices.filter((inv) => inv.status === 'PAID').reduce((sum, inv) => sum + inv.total, 0),
    outstanding: client.invoices.filter((inv) => inv.status !== 'PAID' && inv.status !== 'DRAFT' && inv.status !== 'CANCELLED').reduce((sum, inv) => sum + inv.total, 0),
  }));

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AppSidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8 space-y-6 page-enter">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {clients.length} client{clients.length !== 1 ? 's' : ''} · manage relationships and billing history
              </p>
            </div>
            <Link
              href="/clients/new"
              id="add-client-btn"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Plus size={15} />
              Add Client
            </Link>
          </div>

          {/* Search */}
          <form className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                name="query"
                defaultValue={query}
                placeholder="Search by name, company, or email…"
                className="w-full pl-4 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              Search
            </button>
            {query && (
              <Link href="/clients" className="px-4 py-2.5 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                Clear
              </Link>
            )}
          </form>

          {/* Client Grid */}
          {clientsWithStats.length === 0 ? (
            <div className="card py-20 text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                <Users size={24} className="text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700 text-lg">
                {query ? `No clients matching "${query}"` : 'No clients yet'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {query ? 'Try a different search.' : 'Add your first client to start creating invoices.'}
              </p>
              {!query && (
                <Link
                  href="/clients/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Add your first client <ArrowRight size={14} />
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {clientsWithStats.map((client) => (
                <div key={client.id} className="card p-5 hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center flex-shrink-0 font-bold text-indigo-700 text-sm">
                        {client.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{client.name}</p>
                        {client.companyName && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                            <Building2 size={10} /> {client.companyName}
                          </p>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/clients/${client.id}`}
                      className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                      title="View client"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>

                  <div className="space-y-1.5 mb-4 text-xs text-slate-500">
                    <a href={`mailto:${client.email}`} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                      <Mail size={12} className="text-slate-400" />
                      {client.email}
                    </a>
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-slate-400" />
                        {client.phone}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      {client._count.invoices} invoice{client._count.invoices !== 1 ? 's' : ''}
                    </span>
                    <div className="text-right">
                      {client.outstanding > 0 ? (
                        <span className="text-xs font-semibold text-amber-600">
                          ${client.outstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} outstanding
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-emerald-600">All paid</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
