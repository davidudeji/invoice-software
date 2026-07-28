"use client";

import type { ComponentType, SVGProps } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type LucideIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>;

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  color: "primary" | "accent" | "amber" | "rose";
}

const iconColorMap = {
  primary: { bg: "rgba(59,130,246,0.12)",  icon: "#3b82f6" },
  accent:  { bg: "rgba(16,185,129,0.12)",  icon: "#10b981" },
  amber:   { bg: "rgba(245,158,11,0.12)",  icon: "#f59e0b" },
  rose:    { bg: "rgba(239,68,68,0.12)",   icon: "#ef4444" },
};

export function StatCard({ label, value, trend, trendUp, icon: Icon, color }: StatCardProps) {
  const { bg: iconBg, icon: iconColor } = iconColorMap[color];

  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden transition-all duration-200 group"
      style={{
        background: "#16171e",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.12)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.4)";
      }}
    >
      {/* Ambient glow behind icon */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${iconBg} 0%, transparent 70%)` }}
      />

      <div className="relative flex justify-between items-start mb-4">
        <div
          className="p-2.5 rounded-xl transition-all duration-300 group-hover:scale-105"
          style={{ background: iconBg }}
        >
          <Icon size={18} strokeWidth={2} style={{ color: iconColor }} />
        </div>
        {trend && (
          <div
            className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
            style={
              trendUp
                ? { background: "rgba(16,185,129,0.12)", color: "#10b981" }
                : { background: "rgba(239,68,68,0.12)",  color: "#ef4444" }
            }
          >
            {trendUp
              ? <TrendingUp size={12} />
              : <TrendingDown size={12} />
            }
            {trend}
          </div>
        )}
      </div>

      <p
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: "#475569" }}
      >
        {label}
      </p>
      <h3
        className="text-3xl font-semibold tracking-tight"
        style={{
          color: "#f8fafc",
          fontFamily: '"IBM Plex Mono", monospace',
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </h3>
    </div>
  );
}
