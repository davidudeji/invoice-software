"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteInvoice, updateInvoiceStatus } from "@/app/actions/invoices";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2, CheckCircle, Send } from "lucide-react";
import { InvoiceStatus } from "@prisma/client";
import type { Invoice, Client } from "@prisma/client";

type InvoiceWithClient = Invoice & { client: Pick<Client, "name" | "email"> };

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  DRAFT: "badge-draft",
  SENT: "badge-sent",
  PAID: "badge-paid",
  OVERDUE: "badge-overdue",
  CANCELLED: "badge-cancelled",
  PARTIALLY_PAID: "badge-partial",
};

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "PARTIALLY_PAID", label: "Partial" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface Props {
  initialInvoices: InvoiceWithClient[];
  clients: Pick<Client, "id" | "name">[];
  total: number;
  currentPage: number;
}

export function InvoiceListClient({ initialInvoices, clients, total, currentPage }: Props) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      !search ||
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string, number: string) => {
    if (!confirm(`Delete invoice ${number}? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    });
  };

  const handleMarkPaid = (id: string) => {
    startTransition(async () => {
      await updateInvoiceStatus(id, InvoiceStatus.PAID);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: InvoiceStatus.PAID } : inv))
      );
    });
  };

  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice # or client name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <p className="font-medium">No invoices match your filters</p>
            <p className="text-xs mt-1">Try adjusting your search or status filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th className="text-right">Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((invoice) => {
                  const isOverdue =
                    invoice.status !== "PAID" &&
                    invoice.status !== "CANCELLED" &&
                    new Date(invoice.dueDate) < new Date();

                  return (
                    <tr key={invoice.id} className={isPending ? "opacity-60" : ""}>
                      <td>
                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          {invoice.number}
                        </Link>
                      </td>
                      <td className="text-slate-700 font-medium">{invoice.client.name}</td>
                      <td className="text-slate-500 text-xs">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className={`text-xs ${isOverdue ? "text-red-500 font-medium" : "text-slate-500"}`}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                        {isOverdue && " ⚠"}
                      </td>
                      <td>
                        <span className={`badge ${STATUS_STYLE[invoice.status]}`}>
                          {invoice.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="text-right font-bold text-slate-900">
                        ${invoice.total.toFixed(2)}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/invoices/${invoice.id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={15} />
                          </Link>
                          {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
                            <button
                              onClick={() => handleMarkPaid(invoice.id)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Mark as Paid"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(invoice.id, invoice.number)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            Page {currentPage} of {totalPages} — {total} total
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={`/invoices?page=${currentPage - 1}`}
              className={`p-2 rounded-lg border border-slate-200 ${currentPage <= 1 ? "opacity-40 pointer-events-none" : "hover:bg-slate-50"}`}
            >
              <ChevronLeft size={14} />
            </Link>
            <Link
              href={`/invoices?page=${currentPage + 1}`}
              className={`p-2 rounded-lg border border-slate-200 ${currentPage >= totalPages ? "opacity-40 pointer-events-none" : "hover:bg-slate-50"}`}
            >
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
