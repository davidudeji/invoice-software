import { getInvoices } from "@/app/actions/invoices";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { InvoiceStatus } from "@prisma/client";

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  DRAFT: "badge-draft",
  SENT: "badge-sent",
  PAID: "badge-paid",
  OVERDUE: "badge-overdue",
  CANCELLED: "badge-cancelled",
  PARTIALLY_PAID: "badge-partial",
};

export async function RecentInvoicesWidget() {
  const { invoices } = await getInvoices({ pageSize: 6 });

  return (
    <div className="card">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">Recent Invoices</h2>
        <Link
          href="/invoices"
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <FileText size={32} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No invoices yet</p>
          <p className="text-xs mt-1">Create your first invoice to get started</p>
          <Link
            href="/invoices/new"
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
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
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    {invoice.number}
                  </Link>
                </td>
                <td className="text-slate-600">{invoice.client.name}</td>
                <td className="text-slate-500 text-xs">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>
                <td>
                  <span className={`badge ${STATUS_STYLE[invoice.status]}`}>
                    {invoice.status.replace("_", " ")}
                  </span>
                </td>
                <td className="text-right font-semibold text-slate-900">
                  ${invoice.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
