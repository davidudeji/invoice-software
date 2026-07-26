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
        background: "rgba(248,250,252,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            size={15}
            style={{ color: "#9CA3AF" }}
          />
          <input
            type="text"
            id="dashboard-search"
            placeholder="Search anything..."
            className="w-full text-sm rounded-xl pl-10 pr-16 py-2.5 transition-all"
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              color: "#0A0A0A",
              outline: "none",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1469F8";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(20,105,248,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {/* Keyboard hint */}
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium"
            style={{
              background: "#F1F5F9",
              color: "#9CA3AF",
              border: "1px solid #E2E8F0",
            }}
          >
            <Command size={10} />K
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-5">
        {/* Notification bell */}
        <button
          id="header-notifications"
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: "#6B7280" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#F1F5F9";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
            style={{ background: "#EF4444" }}
          />
        </button>

        <div
          className="w-px h-5"
          style={{ background: "#E5E7EB" }}
        />

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="header-user-menu"
            className="flex items-center gap-2.5 p-1.5 rounded-xl transition-all"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ color: "#374151" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#F1F5F9";
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
                style={{ border: "1.5px solid #E5E7EB" }}
              />
            ) : (
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "#1469F8" }}
              >
                {initials}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p
                className="text-sm font-semibold leading-tight"
                style={{ color: "#0A0A0A" }}
              >
                {user?.name || user?.email || "Guest"}
              </p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                Administrator
              </p>
            </div>
            <ChevronDown size={14} style={{ color: "#9CA3AF" }} />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl py-1.5 z-50"
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-4 py-2.5 mb-1"
                style={{ borderBottom: "1px solid #F1F5F9" }}
              >
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: "#0A0A0A" }}
                >
                  {user?.name || "Account"}
                </p>
                <p className="text-xs truncate" style={{ color: "#9CA3AF" }}>
                  {user?.email}
                </p>
              </div>
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
                style={{ color: "#374151" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                <User size={14} style={{ color: "#9CA3AF" }} /> Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
                style={{ color: "#374151" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                <SettingsIcon size={14} style={{ color: "#9CA3AF" }} /> Settings
              </Link>
              <div
                className="my-1.5"
                style={{ height: "1px", background: "#F1F5F9" }}
              />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
                style={{ color: "#EF4444" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "#FEF2F2")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
