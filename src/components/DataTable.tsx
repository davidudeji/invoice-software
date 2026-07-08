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
          <div className="animate-spin rounded-full h-8 w-8 border border-slate-200 border-t-emerald-500 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="data-table w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider",
                  compact && "py-2 px-3",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                  column.className,
                )}
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
                "border-b border-slate-100 transition-colors hover:bg-slate-50",
                onRowClick && "cursor-pointer",
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => {
                const value = item[column.key];
                const rendered = column.render
                  ? column.render(value, item)
                  : value;

                return (
                  <td
                    key={String(column.key)}
                    className={cn(
                      "px-4 py-3.5 text-sm text-slate-900",
                      compact && "py-2 px-3",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.className,
                    )}
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
