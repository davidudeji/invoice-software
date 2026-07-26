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
      bg: "#0A0A0A",
      accent: "#1469F8",
      trend: "+18.2%",
      trendUp: true,
      sub: "All time",
    },
    {
      label: "Paid Invoices",
      value: stats.paidCount.toString(),
      icon: FileCheck,
      bg: "#1469F8",
      accent: "#fff",
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
      bg: "#fff",
      accent: "#F59E0B",
      trend: "+12.5%",
      trendUp: true,
      sub: "Awaiting payment",
      dark: false,
    },
    {
      label: "Overdue",
      value: stats.overdueCount.toString(),
      icon: AlertTriangle,
      bg: "#fff",
      accent: "#EF4444",
      trend: "+8.7%",
      trendUp: false,
      sub: "Needs attention",
      dark: false,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC", fontFamily: '"Inter", sans-serif' }}>
      <AppSidebar />

      <div className="pl-64">
        <DashboardHeader />

        <main className="max-w-[1400px] mx-auto p-8 space-y-8 page-enter">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{
                  fontFamily: '"Syne", sans-serif',
                  color: "#0A0A0A",
                  letterSpacing: "-0.02em",
                }}
              >
                Overview
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>
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
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all"
                style={{
                  color: "#374151",
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <Plus size={14} />
                Add Client
              </Link>
              <Link
                href="/invoices/new"
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white rounded-lg transition-all"
                style={{
                  background: "#1469F8",
                  boxShadow: "0 2px 8px rgba(20,105,248,0.3)",
                }}
              >
                <Plus size={14} />
                New Invoice
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statCards.map((card) => {
              const Icon = card.icon;
              const isDark = card.bg === "#0A0A0A" || card.bg === "#1469F8";
              return (
                <div
                  key={card.label}
                  className="relative rounded-2xl p-6 overflow-hidden"
                  style={{
                    background: card.bg,
                    border: isDark ? "none" : "1px solid #E5E7EB",
                    boxShadow: isDark
                      ? "0 4px 20px rgba(0,0,0,0.12)"
                      : "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,0.12)"
                          : `${card.accent}15`,
                      }}
                    >
                      <Icon
                        size={17}
                        style={{ color: isDark ? "#fff" : card.accent }}
                      />
                    </div>
                    <div
                      className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={
                        card.trendUp
                          ? {
                              background: isDark
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(16,185,129,0.1)",
                              color: isDark ? "rgba(255,255,255,0.7)" : "#059669",
                            }
                          : {
                              background: isDark
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(239,68,68,0.1)",
                              color: isDark ? "rgba(255,255,255,0.7)" : "#DC2626",
                            }
                      }
                    >
                      {card.trendUp ? (
                        <TrendingUp size={11} />
                      ) : (
                        <TrendingDown size={11} />
                      )}
                      {card.trend}
                    </div>
                  </div>

                  <p
                    className="text-xs font-medium uppercase tracking-wider mb-1.5"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.5)" : "#9CA3AF",
                    }}
                  >
                    {card.label}
                  </p>
                  <p
                    className="text-3xl font-bold tracking-tight"
                    style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      color: isDark ? "#fff" : "#0A0A0A",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {card.value}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.35)" : "#D1D5DB",
                    }}
                  >
                    {card.sub}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div
              className="xl:col-span-2 rounded-2xl p-6"
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-base font-semibold"
                    style={{ fontFamily: '"Syne", sans-serif', color: "#0A0A0A" }}
                  >
                    Revenue Overview
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>
                    Monthly revenue trend — current year
                  </p>
                </div>
                <Link
                  href="/reports"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    color: "#1469F8",
                    background: "rgba(20,105,248,0.06)",
                    border: "1px solid rgba(20,105,248,0.12)",
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
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <h2
                  className="text-base font-semibold mb-4"
                  style={{ fontFamily: '"Syne", sans-serif', color: "#0A0A0A" }}
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
                      style={{ color: "#374151" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(20,105,248,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#0A0A0A" }}>
                          {action.label}
                        </p>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>
                          {action.desc}
                        </p>
                      </div>
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                        style={{ color: "#D1D5DB" }}
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Intelligence CTA */}
              <div
                className="relative rounded-2xl p-6 overflow-hidden"
                style={{ background: "#0A0A0A" }}
              >
                <div
                  className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(20,105,248,0.3) 0%, transparent 70%)",
                  }}
                />
                <div className="relative">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(20,105,248,0.2)" }}
                  >
                    <TrendingUp size={17} style={{ color: "#1469F8" }} />
                  </div>
                  <h3
                    className="font-bold text-white text-base mb-1"
                    style={{ fontFamily: '"Syne", sans-serif' }}
                  >
                    Business Intelligence
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Executive summary of your business health, powered by Gemini.
                  </p>
                  <Link
                    href="/reports"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all"
                    style={{ background: "#1469F8" }}
                  >
                    Generate Report <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <RecentInvoicesWidget />
        </main>
      </div>
    </div>
  );
}
