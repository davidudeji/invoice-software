"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  compact?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  isLoading = false,
  emptyMessage = "No data found",
  compact = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-8 w-8 mx-auto mb-3"
            style={{
              border: "2px solid rgba(255,255,255,0.08)",
              borderTopColor: "#3b82f6",
            }}
          />
          <p className="text-sm" style={{ color: "#475569" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-16 text-center">
        <p className="text-sm" style={{ color: "#475569" }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider",
                  compact && "py-2 px-3",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                  column.className,
                )}
                style={{
                  color: "#475569",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={String(item[rowKey])}
              className={cn(
                "transition-colors",
                onRowClick && "cursor-pointer",
              )}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              onClick={() => onRowClick?.(item)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(59,130,246,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {columns.map((column) => {
                const value = item[column.key];
                const rendered: React.ReactNode = column.render
                  ? column.render(value, item)
                  : (value as React.ReactNode);

                return (
                  <td
                    key={String(column.key)}
                    className={cn(
                      "px-4 py-3.5",
                      compact && "py-2 px-3",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.className,
                    )}
                    style={{ color: "#94a3b8" }}
                  >
                    {rendered}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
