"use client";

import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings as SettingsIcon,
  LogOut,
  Command,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : "U";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-8 py-3.5 sticky top-0 z-40"
      style={{
        background: "rgba(8,9,14,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            size={14}
            style={{ color: "rgba(255,255,255,0.25)" }}
          />
          <input
            type="text"
            id="dashboard-search"
            placeholder="Search anything..."
            className="w-full text-sm rounded-xl pl-10 pr-16 py-2.5 transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#f8fafc",
              outline: "none",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.background = "rgba(59,130,246,0.06)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {/* Keyboard hint */}
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Command size={10} />K
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button
          id="header-notifications"
          className="relative p-2 rounded-xl transition-all"
          style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
          }}
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{
              background: "#3b82f6",
              boxShadow: "0 0 6px rgba(59,130,246,0.6)",
            }}
          />
        </button>

        <div
          className="w-px h-5"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="header-user-menu"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                style={{ border: "1.5px solid rgba(59,130,246,0.4)" }}
              />
            ) : (
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  boxShadow: "0 0 10px rgba(59,130,246,0.4)",
                }}
              >
                {initials}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p
                className="text-sm font-semibold leading-tight"
                style={{ color: "#f8fafc" }}
              >
                {user?.name || user?.email || "Guest"}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                Administrator
              </p>
            </div>
            <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-2xl py-1.5 z-50"
              style={{
                background: "#16171e",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              <div
                className="px-4 py-3 mb-1"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: "#f8fafc" }}
                >
                  {user?.name || "Account"}
                </p>
                <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {user?.email}
                </p>
              </div>

              {[
                { href: "/settings", icon: User, label: "Profile" },
                { href: "/settings", icon: SettingsIcon, label: "Settings" },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.color = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  <Icon size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                  {label}
                </Link>
              ))}

              <div
                className="my-1.5 mx-2"
                style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
              />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all"
                style={{ color: "rgba(239,68,68,0.7)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
                  (e.currentTarget as HTMLElement).style.color = "#fca5a5";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.7)";
                }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
