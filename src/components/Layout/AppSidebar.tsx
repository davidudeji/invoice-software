"use client";

import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Settings,
  BarChart3,
  Tag,
  LogOut,
  ChevronRight,
  Shield,
  TrendingUp,
  X,
  Menu,
  Receipt,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    label: "Business",
    items: [
      { icon: FileText,   label: "Invoices",  href: "/invoices" },
      { icon: TrendingUp, label: "Sales",     href: "/sales" },
      { icon: Users,      label: "Clients",   href: "/clients" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { icon: Package, label: "Inventory",   href: "/inventory" },
      { icon: Tag,     label: "Categories",  href: "/categories" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { icon: BarChart3, label: "Reports", href: "/reports" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Shield,   label: "Audit Log", href: "/audit" },
      { icon: Settings, label: "Settings",  href: "/settings" },
    ],
  },
];

function FIntraLogo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Fintra wordmark — SVG-based for crisp rendering */}
      <div
        className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "#1469F8" }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M4 6h16M4 6v12M4 6l4-2h12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 12h8"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 14l4 4M14 18l4-4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span
        className="text-base font-bold tracking-tight text-white"
        style={{ fontFamily: '"Syne", sans-serif', letterSpacing: "-0.01em" }}
      >
        Fintra
      </span>
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <aside
      className="h-full w-64 flex flex-col border-r"
      style={{
        background: "#0A0A0A",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <FIntraLogo />
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 rounded-md transition-colors"
          style={{ color: "rgba(255,255,255,0.4)" }}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p
              className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-150 nav-active
                      ${
                        active
                          ? "text-white"
                          : "hover:text-white"
                      }
                    `}
                    style={{
                      background: active
                        ? "rgba(20, 105, 248, 0.15)"
                        : undefined,
                      color: active
                        ? "#fff"
                        : "rgba(255,255,255,0.45)",
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        size={16}
                        style={{
                          color: active
                            ? "#1469F8"
                            : "rgba(255,255,255,0.35)",
                        }}
                      />
                      {item.label}
                    </span>
                    {active && (
                      <ChevronRight
                        size={13}
                        style={{ color: "rgba(20, 105, 248, 0.7)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* New Invoice CTA */}
      <div className="px-3 pb-3">
        <Link
          href="/invoices/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{
            background: "#1469F8",
            boxShadow: "0 2px 8px rgba(20,105,248,0.35)",
          }}
        >
          <Receipt size={15} />
          New Invoice
        </Link>
      </div>

      {/* User profile + Sign Out */}
      <div
        className="p-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        {session?.user && (
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "#1469F8" }}
            >
              {session.user.name?.[0]?.toUpperCase() ||
                session.user.email?.[0]?.toUpperCase() ||
                "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold text-white truncate"
                style={{ fontFamily: '"Syne", sans-serif' }}
              >
                {session.user.name || "User"}
              </p>
              <p
                className="text-[10px] truncate"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {session.user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition-all text-sm font-medium"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(239,68,68,0.1)";
            (e.currentTarget as HTMLElement).style.color = "#FCA5A5";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.35)";
          }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-xl shadow-lg text-white"
        style={{ background: "#0A0A0A" }}
        aria-label="Open sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed left-0 top-0 h-full z-50 md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop fixed sidebar */}
      <div className="fixed left-0 top-0 h-full hidden md:block z-50">
        <SidebarContent />
      </div>
    </>
  );
}
