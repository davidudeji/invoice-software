import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { PublicPayPageClient } from "@/components/Invoices/PublicPayPageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: { number: true },
  });
  return {
    title: invoice ? `Invoice ${invoice.number}` : "Invoice",
    description: "Secure online payment for your invoice.",
  };
}

export default async function PublicInvoicePage({ params }: Props) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      items: { include: { product: { select: { name: true } } } },
      user: {
        include: {
          settings: true,
        },
      },
    },
  });

  if (!invoice) notFound();

  const settings = invoice.user.settings;
  const isPaid = invoice.status === "PAID" || invoice.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      {/* Outer container */}
      <div className="max-w-2xl mx-auto">
        {/* Business Header */}
        <div className="text-center mb-8">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.businessName ?? "Business Logo"}
              className="h-12 w-auto mx-auto object-contain mb-3"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">
                {(settings?.businessName ?? "I")[0]}
              </span>
            </div>
          )}
          <h1 className="text-xl font-bold text-slate-900">
            {settings?.businessName ?? "Invoice"}
          </h1>
          {settings?.email && (
            <p className="text-sm text-slate-500">{settings.email}</p>
          )}
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header Band */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">
                  Invoice
                </p>
                <p className="text-2xl font-bold">{invoice.number}</p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    invoice.status === "PAID"
                      ? "bg-emerald-400/20 text-emerald-100 border border-emerald-400/30"
                      : invoice.status === "OVERDUE"
                      ? "bg-red-400/20 text-red-100 border border-red-400/30"
                      : "bg-white/20 text-white border border-white/30"
                  }`}
                >
                  {invoice.status.replace("_", " ")}
                </span>
                <p className="text-indigo-200 text-xs mt-2">
                  Due {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Billed To */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Billed To
              </p>
              <p className="font-semibold text-slate-900">{invoice.client.name}</p>
              {invoice.client.companyName && (
                <p className="text-sm text-slate-600">{invoice.client.companyName}</p>
              )}
              <p className="text-sm text-slate-500">{invoice.client.email}</p>
              {invoice.client.address && (
                <p className="text-sm text-slate-500 whitespace-pre-line mt-1">
                  {invoice.client.address}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Issue Date
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {format(new Date(invoice.date), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Due Date
                </p>
                <p
                  className={`text-sm font-medium ${
                    !isPaid && new Date(invoice.dueDate) < new Date()
                      ? "text-red-600"
                      : "text-slate-800"
                  }`}
                >
                  {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Line Items */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Items
              </p>
              <div className="space-y-2">
                {invoice.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between py-2"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium text-slate-900">
                        {item.description}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                      ${item.total.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>${invoice.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Due</span>
                <span className="text-indigo-600 text-lg">
                  {settings?.currency ?? "USD"} ${invoice.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Notes
                </p>
                <p className="text-sm text-slate-600">{invoice.notes}</p>
              </div>
            )}

            {/* Payment CTA */}
            <PublicPayPageClient
              invoiceId={invoice.id}
              isPaid={isPaid}
              total={invoice.total}
              currency={settings?.currency ?? "USD"}
            />
          </div>

          {/* Footer */}
          {settings?.invoiceFooter && (
            <div className="px-8 py-4 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500 text-center">
                {settings.invoiceFooter}
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Secure payment powered by Stripe · Invoice {invoice.number}
        </p>
      </div>
    </div>
  );
}
