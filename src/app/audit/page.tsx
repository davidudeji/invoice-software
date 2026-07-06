import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { Shield, FileText, Package, Tag, Users, Settings, CreditCard, ShoppingBag, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { AuditAction, AuditTarget } from '@prisma/client';

export const metadata: Metadata = { title: 'Audit Log' };

const PAGE_SIZE = 30;

const ACTION_CONFIG: Record<AuditAction, { label: string; color: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  CREATE: { label: 'Created', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: Plus },
  UPDATE: { label: 'Updated', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: Edit },
  DELETE: { label: 'Deleted', color: 'text-red-700 bg-red-50 border-red-200', icon: Trash2 },
};

const TARGET_CONFIG: Record<AuditTarget, { label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  INVOICE: { label: 'Invoice', icon: FileText },
  PRODUCT: { label: 'Product', icon: Package },
  CATEGORY: { label: 'Category', icon: Tag },
  CLIENT: { label: 'Client', icon: Users },
  SETTINGS: { label: 'Settings', icon: Settings },
  PAYMENT: { label: 'Payment', icon: CreditCard },
  SALE: { label: 'Sale', icon: ShoppingBag },
};

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1'));

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.auditLog.count({ where: { userId: session.user.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AppSidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8 space-y-6 page-enter">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {total} event{total !== 1 ? 's' : ''} recorded · all create, update, and delete actions
              </p>
            </div>
          </div>

          {/* Log Table */}
          <div className="card overflow-hidden">
            {logs.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Shield size={22} className="text-slate-400" />
                </div>
                <p className="font-medium text-slate-600">No audit events yet</p>
                <p className="text-sm text-slate-400 mt-1">Events are recorded automatically when data is created, updated, or deleted.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Target</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Summary</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => {
                      const actionCfg = ACTION_CONFIG[log.action];
                      const targetCfg = TARGET_CONFIG[log.target];
                      const ActionIcon = actionCfg.icon;
                      const TargetIcon = targetCfg.icon;

                      return (
                        <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${actionCfg.color}`}>
                              <ActionIcon size={11} />
                              {actionCfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                              <TargetIcon size={14} className="text-slate-400" />
                              {targetCfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-700 max-w-xs truncate" title={log.summary}>
                            {log.summary}
                          </td>
                          <td className="px-4 py-3.5 hidden md:table-cell text-slate-400 text-xs whitespace-nowrap">
                            {format(new Date(log.createdAt), 'MMM d, yyyy · HH:mm')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages} · {total} total events
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/audit?page=${page - 1}`}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
                  >
                    ← Previous
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/audit?page=${page + 1}`}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
