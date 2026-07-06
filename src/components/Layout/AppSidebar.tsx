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
  Zap,
  ChevronRight,
  Shield,
  TrendingUp,
  X,
  Menu,
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
      { icon: FileText, label: "Invoices", href: "/invoices" },
      { icon: TrendingUp, label: "Sales", href: "/sales" },
      { icon: Users, label: "Clients", href: "/clients" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { icon: Package, label: "Inventory", href: "/inventory" },
      { icon: Tag, label: "Categories", href: "/categories" },
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
      { icon: Shield, label: "Audit Log", href: "/audit" },
      { icon: Settings, label: "Settings", href: "/settings" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <aside className="h-full w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800/80">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap size={16} className="text-white" />
          </div>
          <h1 className="text-base font-bold tracking-tight text-white">
            Invoice<span className="text-indigo-400">Pay</span>
          </h1>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
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
                      group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-150
                      ${active
                        ? "bg-indigo-600/20 text-white nav-active"
                        : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
                      }
                    `}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        size={16}
                        className={active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}
                      />
                      {item.label}
                    </span>
                    {active && (
                      <ChevronRight size={14} className="text-indigo-400 opacity-60" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile + Sign Out */}
      <div className="p-3 border-t border-slate-800/80">
        {session?.user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50 mb-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {session.user.name || "User"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{session.user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-400 hover:text-red-400 hover:bg-slate-800/70 rounded-xl transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 bg-slate-900 text-white rounded-xl shadow-lg"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`fixed left-0 top-0 h-full z-50 md:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Desktop fixed sidebar */}
      <div className="fixed left-0 top-0 h-full hidden md:block z-50">
        <SidebarContent />
      </div>
    </>
  );
}
