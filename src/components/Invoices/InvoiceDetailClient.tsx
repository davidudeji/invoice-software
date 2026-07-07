"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  updateInvoiceStatus,
  deleteInvoice,
  resendInvoiceEmail,
} from "@/app/actions/invoices";
import {
  CheckCircle,
  Send,
  Trash2,
  CreditCard,
  Download,
  Mail,
  AlertCircle,
  Clock,
  Ban,
  ExternalLink,
  Loader2,
  ArrowUpRight,
  Link2,
  Copy,
} from "lucide-react";
import { InvoiceStatus } from "@prisma/client";
import type {
  Invoice,
  InvoiceItem,
  Client,
  Product,
  Payment,
  Sale,
  Settings,
} from "@prisma/client";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type FullInvoice = Invoice & {
  client: Client;
  items: (InvoiceItem & { product: Pick<Product, "name" | "sku"> | null })[];
  payments: Payment[];
  sale: Sale | null;
};

interface Props {
  invoice: FullInvoice;
  settings: Settings | null;
  paymentStatus?: string;
}

// ─────────────────────────────────────────────
// Status config
// ─────────────────────────────────────────────

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; className: string; icon: React.FC<{ size?: number; className?: string }> }
> = {
  DRAFT: { label: "Draft", className: "badge-draft", icon: Clock },
  SENT: { label: "Sent", className: "badge-sent", icon: Send },
  PAID: { label: "Paid", className: "badge-paid", icon: CheckCircle },
  OVERDUE: { label: "Overdue", className: "badge-overdue", icon: AlertCircle },
  PARTIALLY_PAID: { label: "Partial", className: "badge-partial", icon: CreditCard },
  CANCELLED: { label: "Cancelled", className: "badge-cancelled", icon: Ban },
};

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function InvoiceDetailClient({ invoice, settings, paymentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const currency = settings?.currency ?? "USD";
  const { label, className, icon: StatusIcon } = STATUS_CONFIG[invoice.status];

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleStatus = (status: InvoiceStatus) => {
    startTransition(async () => {
      const result = await updateInvoiceStatus(invoice.id, status);
      if (result.success) showToast("success", result.message ?? `Marked as ${status}`);
      else showToast("error", result.message ?? "Failed to update status");
    });
  };

  const handleDelete = () => {
    if (!confirm(`Delete invoice ${invoice.number}? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteInvoice(invoice.id);
    });
  };

  const handleResendEmail = () => {
    startTransition(async () => {
      const result = await resendInvoiceEmail(invoice.id);
      if (result.success) showToast("success", "Email sent successfully");
      else showToast("error", result.message ?? "Failed to send email");
    });
  };

  const handleStripePayment = async () => {
    setIsPaymentLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast("error", data.error ?? "Failed to start payment");
      }
    } catch {
      showToast("error", "Failed to connect to payment gateway");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleCopyPayLink = async () => {
    const baseUrl = window.location.origin;
    const payUrl = `${baseUrl}/invoice/${invoice.id}`;
    try {
      await navigator.clipboard.writeText(payUrl);
      showToast("success", "Payment link copied to clipboard!");
    } catch {
      showToast("error", "Could not copy link — please copy it manually.");
    }
  };

  const canMarkPaid = !["PAID", "CANCELLED"].includes(invoice.status);
  const canSend = !["PAID", "CANCELLED"].includes(invoice.status);
  const canDelete = invoice.status === "DRAFT";

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium animate-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Payment success/cancel banners */}
      {paymentStatus === "success" && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
          <CheckCircle size={16} />
          Payment received! This invoice will be marked as paid shortly.
        </div>
      )}
      {paymentStatus === "cancelled" && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
          <AlertCircle size={16} />
          Payment was cancelled. You can try again below.
        </div>
      )}

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{invoice.number}</h1>
            <span className={`badge ${className}`}>
              <StatusIcon size={11} />
              {label}
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Created {new Date(invoice.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {/* Share pay link */}
          <button
            id="copy-pay-link-btn"
            onClick={handleCopyPayLink}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-colors"
            title="Copy client payment link"
          >
            <Copy size={14} />
            Copy Pay Link
          </button>
          <Link
            id="open-pay-page-btn"
            href={`/invoice/${invoice.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-colors"
            title="Open public pay page"
          >
            <Link2 size={14} />
            Pay Page
          </Link>
          {canSend && (
            <button
              id="resend-email-btn"
              onClick={handleResendEmail}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
            >
              <Mail size={14} />
              {invoice.status === "DRAFT" ? "Send" : "Resend"}
            </button>
          )}
          {canMarkPaid && (
            <button
              id="mark-paid-btn"
              onClick={() => handleStatus(InvoiceStatus.PAID)}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm shadow-emerald-500/20 disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              Mark as Paid
            </button>
          )}
          {canDelete && (
            <button
              id="delete-invoice-btn"
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main invoice document */}
        <div className="lg:col-span-2 space-y-5">
          {/* Invoice card */}
          <div className="card overflow-hidden">
            {/* Gradient header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">
                    Invoice
                  </p>
                  <p className="text-white text-2xl font-bold">{invoice.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-indigo-200 text-xs">Issue date</p>
                  <p className="text-white text-sm font-semibold">
                    {new Date(invoice.date).toLocaleDateString()}
                  </p>
                  <p className="text-indigo-200 text-xs mt-1">Due date</p>
                  <p className="text-white text-sm font-semibold">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Bill to */}
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Bill To
                  </p>
                  <p className="font-semibold text-slate-900">{invoice.client.name}</p>
                  {invoice.client.companyName && (
                    <p className="text-sm text-slate-500">{invoice.client.companyName}</p>
                  )}
                  <p className="text-sm text-slate-500">{invoice.client.email}</p>
                  {invoice.client.address && (
                    <p className="text-sm text-slate-500 whitespace-pre-line">{invoice.client.address}</p>
                  )}
                </div>
                {invoice.paymentTerms && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Terms
                    </p>
                    <p className="text-sm text-slate-700 font-medium">
                      {invoice.paymentTerms.replace("_", " ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Line items table */}
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Unit Price</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <p className="font-medium text-slate-900">{item.description}</p>
                        {item.product?.sku && (
                          <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {item.product.sku}</p>
                        )}
                      </td>
                      <td className="text-center text-slate-600">{item.quantity}</td>
                      <td className="text-right text-slate-600">{fmt(item.unitPrice, currency)}</td>
                      <td className="text-right font-semibold text-slate-900">{fmt(item.total, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="px-6 py-5 flex justify-end border-t border-slate-100">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">{fmt(invoice.subtotal, currency)}</span>
                </div>
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax ({invoice.taxRate}%)</span>
                    <span className="font-medium text-slate-900">{fmt(invoice.taxAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t-2 border-indigo-200">
                  <span className="font-bold text-slate-900 text-base">Total Due</span>
                  <span className="font-bold text-indigo-600 text-xl">{fmt(invoice.total, currency)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="px-6 pb-5 pt-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-slate-600 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Payment history */}
          {invoice.payments.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Payment History</h3>
              <div className="space-y-3">
                {invoice.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${p.status === "PAID" ? "bg-emerald-500" : p.status === "FAILED" ? "bg-red-500" : "bg-amber-400"}`} />
                      <span className="text-slate-600">{p.paymentMethod ?? "Card"}</span>
                      {p.paidAt && (
                        <span className="text-slate-400">{new Date(p.paidAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-900">{fmt(p.amount, currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Stripe pay now */}
          {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-1">Online Payment</h3>
              <p className="text-xs text-slate-400 mb-4">Accept card payment instantly via Stripe</p>
              <button
                id="stripe-pay-btn"
                onClick={handleStripePayment}
                disabled={isPaymentLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
              >
                {isPaymentLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CreditCard size={14} />
                )}
                Pay {fmt(invoice.total, currency)} with Stripe
                <ArrowUpRight size={13} />
              </button>
            </div>
          )}

          {/* Invoice meta */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className={`badge ${className}`}><StatusIcon size={10} />{label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Client</span>
                <Link href={`/clients/${invoice.clientId}`} className="text-indigo-600 hover:underline font-medium flex items-center gap-1">
                  {invoice.client.name} <ExternalLink size={11} />
                </Link>
              </div>
              {invoice.sentAt && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Sent at</span>
                  <span className="text-slate-700">{new Date(invoice.sentAt).toLocaleDateString()}</span>
                </div>
              )}
              {invoice.paidAt && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Paid at</span>
                  <span className="text-emerald-600 font-semibold">{new Date(invoice.paidAt).toLocaleDateString()}</span>
                </div>
              )}
              {invoice.sale && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Sale recorded</span>
                  <span className="text-emerald-600">✓</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick status actions */}
          {!["PAID", "CANCELLED"].includes(invoice.status) && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Update Status</h3>
              <div className="space-y-2">
                {invoice.status !== "SENT" && (
                  <button
                    onClick={() => handleStatus(InvoiceStatus.SENT)}
                    disabled={isPending}
                    className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Mark as Sent
                  </button>
                )}
                {invoice.status !== "OVERDUE" && (
                  <button
                    onClick={() => handleStatus(InvoiceStatus.OVERDUE)}
                    disabled={isPending}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Mark as Overdue
                  </button>
                )}
                <button
                  onClick={() => handleStatus(InvoiceStatus.CANCELLED)}
                  disabled={isPending}
                  className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
