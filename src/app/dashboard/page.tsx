import { getSalesSummary } from "@/app/actions/reports";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { RevenueChart } from "@/components/Dashboard/RevenueChart";
import { RecentInvoicesWidget } from "@/components/Dashboard/RecentInvoicesWidget";
import {
  DollarSign,
  FileCheck,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

// Revalidate dashboard data every 60 seconds
export const revalidate = 60;

export default async function DashboardPage() {
  const stats = await getSalesSummary();

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      gradient: "from-indigo-500 to-indigo-700",
      glow: "shadow-indigo-500/25",
      sub: "All time",
    },
    {
      label: "Paid Invoices",
      value: stats.paidCount.toString(),
      icon: FileCheck,
      gradient: "from-emerald-500 to-emerald-700",
      glow: "shadow-emerald-500/25",
      sub: "Total completed",
    },
    {
      label: "Outstanding",
      value: `$${stats.outstandingAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Clock,
      gradient: "from-amber-400 to-amber-600",
      glow: "shadow-amber-400/25",
      sub: "Awaiting payment",
    },
    {
      label: "Overdue",
      value: stats.overdueCount.toString(),
      icon: AlertTriangle,
      gradient: "from-rose-500 to-rose-700",
      glow: "shadow-rose-500/25",
      sub: "Needs attention",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AppSidebar />

      <main className="pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8 space-y-8 page-enter">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/clients/new"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Plus size={15} />
                Add Client
              </Link>
              <Link
                href="/invoices/new"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/25"
              >
                <Plus size={15} />
                New Invoice
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statCards.map((card) => {
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
                      <TrendingUp size={14} className="text-white/60 mt-1" />
                    </div>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
                      {card.label}
                    </p>
                    <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                    <p className="text-white/60 text-xs mt-1">{card.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Revenue Chart (spans 2 cols) */}
            <div className="xl:col-span-2 card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Revenue Overview</h2>
                  <p className="text-slate-400 text-sm">Monthly revenue trend — current year</p>
                </div>
              </div>
              <RevenueChart data={stats.revenueByMonth} />
            </div>

            {/* Quick Actions + CTA */}
            <div className="space-y-5">
              {/* Quick Actions */}
              <div className="card p-6">
                <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { label: "Create Invoice", href: "/invoices/new", desc: "Bill a client" },
                    { label: "Add Product", href: "/inventory/new", desc: "Update catalog" },
                    { label: "New Client", href: "/clients/new", desc: "Add contact" },
                    { label: "View Sales", href: "/sales", desc: "Revenue ledger" },
                    { label: "AI Report", href: "/reports", desc: "Business insights" },
                  ].map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {action.label}
                        </p>
                        <p className="text-xs text-slate-400">{action.desc}</p>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-6 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent)]" />
                <div className="relative">
                  <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <TrendingUp size={18} className="text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-1">AI Business Insights</h3>
                  <p className="text-indigo-200 text-sm mb-4">
                    Get an executive summary of your business health powered by Gemini AI.
                  </p>
                  <Link
                    href="/reports"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                  >
                    Generate Report <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <RecentInvoicesWidget />
        </div>
      </main>
    </div>
  );
}
