import { getInvoices } from "@/app/actions/invoices";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { InvoiceStatus } from "@prisma/client";

const STATUS_STYLE: Record<InvoiceStatus, { cls: string; dot: string }> = {
  DRAFT:          { cls: "badge badge-draft",     dot: "#94A3B8" },
  SENT:           { cls: "badge badge-sent",      dot: "#0EA5E9" },
  PAID:           { cls: "badge badge-paid",      dot: "#1469F8" },
  OVERDUE:        { cls: "badge badge-overdue",   dot: "#EF4444" },
  CANCELLED:      { cls: "badge badge-cancelled", dot: "#CBD5E1" },
  PARTIALLY_PAID: { cls: "badge badge-partial",   dot: "#F59E0B" },
};

export async function RecentInvoicesWidget() {
  const { invoices } = await getInvoices({ pageSize: 6 });

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #F1F5F9" }}
      >
        <h2
          className="text-base font-semibold"
          style={{ fontFamily: '"Syne", sans-serif', color: "#0A0A0A" }}
        >
          Recent Invoices
        </h2>
        <Link
          href="/invoices"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={{
            color: "#1469F8",
            background: "rgba(20,105,248,0.06)",
            border: "1px solid rgba(20,105,248,0.12)",
          }}
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16" style={{ color: "#9CA3AF" }}>
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "#F8FAFC", border: "1px solid #E5E7EB" }}
          >
            <FileText size={22} style={{ color: "#CBD5E1" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "#374151" }}>
            No invoices yet
          </p>
          <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
            Create your first invoice to get started
          </p>
          <Link
            href="/invoices/new"
            className="mt-5 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all"
            style={{
              background: "#1469F8",
              boxShadow: "0 2px 8px rgba(20,105,248,0.3)",
            }}
          >
            Create Invoice
          </Link>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Client</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="font-semibold text-sm transition-colors"
                    style={{ color: "#1469F8", fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    {invoice.number}
                  </Link>
                </td>
                <td>
                  <span className="text-sm font-medium" style={{ color: "#374151" }}>
                    {invoice.client.name}
                  </span>
                </td>
                <td>
                  <span className="text-xs" style={{ color: "#9CA3AF" }}>
                    {new Date(invoice.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </td>
                <td>
                  <span className={STATUS_STYLE[invoice.status].cls}>
                    {invoice.status.replace("_", " ")}
                  </span>
                </td>
                <td className="text-right">
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: "#0A0A0A",
                      fontFamily: '"IBM Plex Mono", monospace',
                    }}
                  >
                    ${invoice.total.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
