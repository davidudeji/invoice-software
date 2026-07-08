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

const colorMap = {
    primary: "bg-slate-100 text-slate-700",
    accent: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-600",
    rose: "bg-rose-100 text-rose-600",
};

export function StatCard({ label, value, trend, trendUp, icon: Icon, color }: StatCardProps) {
    return (
        <div className="card bg-white p-6 border-slate-200 group hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-105 ${colorMap[color]}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1">
                        {trendUp ? (
                            <TrendingUp size={16} className="text-emerald-600" />
                        ) : (
                            <TrendingDown size={16} className="text-rose-600" />
                        )}
                        <span className={`text-xs font-semibold ${trendUp ? "text-emerald-700" : "text-rose-700"}`}>
                            {trend}
                        </span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
                <h3 className="font-display text-3xl font-semibold text-slate-900 tracking-tight">{value}</h3>
            </div>
        </div>
    );
}
