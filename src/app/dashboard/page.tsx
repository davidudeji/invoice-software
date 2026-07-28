import { getSalesSummary } from "@/app/actions/reports";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { RevenueChart } from "@/components/Dashboard/RevenueChart";
import { RecentInvoicesWidget } from "@/components/Dashboard/RecentInvoicesWidget";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import {
  DollarSign,
  FileCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Plus,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export const revalidate = 60;

export default async function DashboardPage() {
  const stats = await getSalesSummary();

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      iconBg: "rgba(59,130,246,0.12)",
      iconColor: "#3b82f6",
      trend: "+18.2%",
      trendUp: true,
      sub: "All time",
    },
    {
      label: "Paid Invoices",
      value: stats.paidCount.toString(),
      icon: FileCheck,
      iconBg: "rgba(16,185,129,0.12)",
      iconColor: "#10b981",
      trend: "+23.7%",
      trendUp: true,
      sub: "Total completed",
    },
    {
      label: "Outstanding",
      value: `$${stats.outstandingAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: Clock,
      iconBg: "rgba(245,158,11,0.12)",
      iconColor: "#f59e0b",
      trend: "+12.5%",
      trendUp: true,
      sub: "Awaiting payment",
    },
    {
      label: "Overdue",
      value: stats.overdueCount.toString(),
      icon: AlertTriangle,
      iconBg: "rgba(239,68,68,0.12)",
      iconColor: "#ef4444",
      trend: "+8.7%",
      trendUp: false,
      sub: "Needs attention",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "#08090e", fontFamily: '"Inter", sans-serif' }}
    >
      <AppSidebar />

      <div className="pl-64">
        <DashboardHeader />

        <main className="max-w-[1400px] mx-auto p-8 space-y-8 page-enter">

          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{
                  fontFamily: '"Syne", sans-serif',
                  color: "#f8fafc",
                  letterSpacing: "-0.02em",
                }}
              >
                Overview
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/clients/new"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all"
                style={{
                  color: "#94a3b8",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.color = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                }}
              >
                <Plus size={14} />
                Add Client
              </Link>
              <Link
                href="/invoices/new"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-full transition-all"
                style={{
                  background: "#3b82f6",
                  boxShadow: "0 2px 12px rgba(59,130,246,0.35)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#2563eb";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(59,130,246,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#3b82f6";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(59,130,246,0.35)";
                }}
              >
                <Plus size={14} />
                New Invoice
              </Link>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="relative rounded-2xl p-6 overflow-hidden group transition-all duration-200"
                  style={{
                    background: "#16171e",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.4)";
                  }}
                >
                  {/* ambient glow */}
                  <div
                    className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${card.iconBg} 0%, transparent 70%)`,
                    }}
                  />

                  <div className="relative flex items-start justify-between mb-5">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                      style={{ background: card.iconBg }}
                    >
                      <Icon size={17} style={{ color: card.iconColor }} />
                    </div>
                    <div
                      className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                      style={
                        card.trendUp
                          ? { background: "rgba(16,185,129,0.12)", color: "#10b981" }
                          : { background: "rgba(239,68,68,0.12)",  color: "#ef4444" }
                      }
                    >
                      {card.trendUp
                        ? <TrendingUp size={11} />
                        : <TrendingDown size={11} />}
                      {card.trend}
                    </div>
                  </div>

                  <p
                    className="text-xs font-medium uppercase tracking-wider mb-1.5"
                    style={{ color: "#475569" }}
                  >
                    {card.label}
                  </p>
                  <p
                    className="text-3xl font-bold tracking-tight"
                    style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      color: "#f8fafc",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {card.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#334155" }}>
                    {card.sub}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── Main Grid ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Revenue Chart */}
            <div
              className="xl:col-span-2 rounded-2xl p-6"
              style={{
                background: "#16171e",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-base font-semibold"
                    style={{ fontFamily: '"Syne", sans-serif', color: "#f8fafc" }}
                  >
                    Revenue Overview
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
                    Monthly revenue trend — current year
                  </p>
                </div>
                <Link
                  href="/reports"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                  style={{
                    color: "#3b82f6",
                    background: "rgba(59,130,246,0.10)",
                    border: "1px solid rgba(59,130,246,0.18)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.16)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.10)";
                  }}
                >
                  <BarChart3 size={13} />
                  Full Report
                </Link>
              </div>
              <RevenueChart data={stats.revenueByMonth} />
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Quick Actions */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "#16171e",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                }}
              >
                <h2
                  className="text-base font-semibold mb-4"
                  style={{ fontFamily: '"Syne", sans-serif', color: "#f8fafc" }}
                >
                  Quick Actions
                </h2>
                <div className="space-y-0.5">
                  {[
                    { label: "Create Invoice",  href: "/invoices/new",  desc: "Bill a client" },
                    { label: "Add Product",     href: "/inventory/new", desc: "Update catalog" },
                    { label: "New Client",      href: "/clients/new",   desc: "Add contact" },
                    { label: "Sales Ledger",    href: "/sales",         desc: "Revenue records" },
                    { label: "Business Report", href: "/reports",       desc: "Intelligence" },
                  ].map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center justify-between p-3 rounded-xl transition-all group"
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(59,130,246,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#f8fafc" }}>
                          {action.label}
                        </p>
                        <p className="text-xs" style={{ color: "#475569" }}>
                          {action.desc}
                        </p>
                      </div>
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                        style={{ color: "#334155" }}
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Intelligence CTA — Velora-style dark card with blue glow */}
              <div
                className="relative rounded-2xl p-6 overflow-hidden"
                style={{
                  background: "#0d1117",
                  border: "1px solid rgba(59,130,246,0.2)",
                  boxShadow: "0 0 32px rgba(59,130,246,0.08)",
                }}
              >
                {/* Dot-grid background */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                {/* Blue ambient glow */}
                <div
                  className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
                  }}
                />

                <div className="relative">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(59,130,246,0.15)" }}
                  >
                    <Zap size={17} style={{ color: "#3b82f6" }} />
                  </div>
                  <h3
                    className="font-bold text-white text-base mb-1"
                    style={{ fontFamily: '"Syne", sans-serif' }}
                  >
                    Business Intelligence
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Executive summary of your business health, powered by Gemini AI.
                  </p>
                  <Link
                    href="/reports"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-full transition-all"
                    style={{
                      background: "#3b82f6",
                      boxShadow: "0 2px 12px rgba(59,130,246,0.35)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#2563eb";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(59,130,246,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#3b82f6";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(59,130,246,0.35)";
                    }}
                  >
                    Generate Report <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Recent Invoices ── */}
          <RecentInvoicesWidget />
        </main>
      </div>
    </div>
  );
}
