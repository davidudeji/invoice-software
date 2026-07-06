"use client";

import { useEffect, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useInvoiceBuilderStore } from "@/lib/store";
import { createInvoice } from "@/app/actions/invoices";
import { SmartCapture } from "./SmartCapture";
import {
  Plus,
  Trash2,
  Send,
  Save,
  Package,
  ChevronDown,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { Client, Product, Category } from "@prisma/client";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ProductWithCategory = Product & { category: Pick<Category, "name"> | null };

interface Props {
  clients: Client[];
  products: ProductWithCategory[];
  defaultTaxRate: number;
  currency: string;
  businessName: string;
  logoUrl: string | null;
}

// ─────────────────────────────────────────────
// Helper: format currency
// ─────────────────────────────────────────────

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

export function InvoiceBuilderForm({
  clients,
  products,
  defaultTaxRate,
  currency,
  businessName,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = [
    useInvoiceBuilderStore((s) => s.notes), // placeholder, we'll use local for error
    () => {},
  ];

  // ── Zustand store ──
  const {
    clientId,
    dueDate,
    taxRate,
    notes,
    paymentTerms,
    items,
    subtotal,
    taxAmount,
    total,
    setClientId,
    setDueDate,
    setTaxRate,
    setNotes,
    setPaymentTerms,
    addItem,
    removeItem,
    updateItem,
    autofillFromOCR,
    reset,
  } = useInvoiceBuilderStore();

  // Set default tax rate on mount
  useEffect(() => {
    if (taxRate === 0 && defaultTaxRate > 0) {
      setTaxRate(defaultTaxRate);
    }
    // Ensure at least one blank item
    if (items.length === 0) {
      addItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── OCR autofill handler ──
  const handleOCRCapture = useCallback(
    (data: {
      vendorName?: string;
      items?: { description: string; quantity: number; unitPrice: number }[];
      taxAmount?: number;
      total?: number;
      dueDate?: string;
    }) => {
      // Map OCR items into builder items
      const builderItems = (data.items ?? []).map((i) => ({
        id: crypto.randomUUID(),
        productId: undefined,
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.quantity * i.unitPrice,
      }));

      autofillFromOCR({
        ...(builderItems.length > 0 && { items: builderItems }),
        ...(data.dueDate && { dueDate: data.dueDate }),
      });
    },
    [autofillFromOCR]
  );

  // ── Product selection handler ──
  const handleProductSelect = (itemId: string, productId: string) => {
    if (!productId) {
      updateItem(itemId, { productId: undefined });
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (product) {
      updateItem(itemId, {
        productId: product.id,
        description: product.name,
        unitPrice: product.price,
      });
    }
  };

  // ── Submit handler ──
  const handleSubmit = (sendEmail: boolean) => {
    setErrorMsg2("");
    if (!clientId) {
      setErrorMsg2("Please select a client.");
      return;
    }
    if (!dueDate) {
      setErrorMsg2("Please set a due date.");
      return;
    }
    if (items.length === 0 || items.every((i) => !i.description)) {
      setErrorMsg2("Please add at least one line item.");
      return;
    }

    startTransition(async () => {
      const result = await createInvoice(
        { message: null },
        {
          clientId,
          dueDate,
          taxRate,
          notes,
          paymentTerms,
          sendEmail,
          items: items.map((item) => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        }
      );

      if (result?.message && !result.success) {
        setErrorMsg2(result.message);
      } else {
        reset();
      }
    });
  };

  // Local error state workaround
  const [localError, setLocalError] = [
    "" as string,
    (v: string) => {
      (document.getElementById("invoice-builder-error") as HTMLElement | null)?.setAttribute("data-msg", v);
    },
  ];
  const setErrorMsg2 = (msg: string) => {
    const el = document.getElementById("invoice-builder-error");
    if (el) {
      if (msg) {
        el.textContent = msg;
        el.classList.remove("hidden");
      } else {
        el.textContent = "";
        el.classList.add("hidden");
      }
    }
  };

  // ── Tomorrow as min date ──
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 page-enter">
      {/* ── LEFT: Main Form ── */}
      <div className="xl:col-span-2 space-y-5">

        {/* OCR Smart Capture */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Package size={13} className="text-indigo-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-700">Smart Capture (OCR)</h2>
            <span className="text-xs text-slate-400">— optional: upload a receipt to auto-fill</span>
          </div>
          <SmartCapture onCapture={handleOCRCapture} />
        </div>

        {/* Invoice Details */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-5 pb-3 border-b border-slate-100">
            Invoice Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Client */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Client *
              </label>
              <div className="relative">
                <select
                  id="invoice-client"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 pr-10"
                >
                  <option value="">Select a client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.companyName ? ` — ${c.companyName}` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Due Date *
              </label>
              <input
                id="invoice-due-date"
                type="date"
                min={tomorrowStr}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>

            {/* Tax Rate */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Tax Rate (%)
              </label>
              <input
                id="invoice-tax-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Payment Terms
              </label>
              <div className="relative">
                <select
                  id="invoice-payment-terms"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 pr-10"
                >
                  <option value="NET_7">Net 7</option>
                  <option value="NET_14">Net 14</option>
                  <option value="NET_30">Net 30</option>
                  <option value="NET_60">Net 60</option>
                  <option value="DUE_ON_RECEIPT">Due on Receipt</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Notes (optional)
            </label>
            <textarea
              id="invoice-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment instructions, project details, or a thank-you note…"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Line Items</h2>
            <button
              id="add-line-item"
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={14} />
              Add Item
            </button>
          </div>

          {/* Mobile-friendly item list */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="relative bg-slate-50/70 rounded-xl border border-slate-200/80 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Item {index + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Product selector */}
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Product (optional)
                  </label>
                  <div className="relative">
                    <select
                      value={item.productId ?? ""}
                      onChange={(e) => handleProductSelect(item.id, e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 pr-8"
                    >
                      <option value="">Select from catalog…</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {fmt(p.price, currency)}
                          {p.category ? ` (${p.category.name})` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Description, qty, price row */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-slate-500 mb-1">Description *</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="What are you billing for?"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Unit Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    />
                  </div>
                </div>

                {/* Row total */}
                <div className="flex justify-end">
                  <span className="text-sm font-semibold text-slate-700">
                    Row Total: <span className="text-indigo-600">{fmt(item.total, currency)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Summary Sidebar ── */}
      <div className="space-y-5">
        {/* Summary Card */}
        <div className="card p-6 sticky top-6">
          <h2 className="text-base font-semibold text-slate-900 mb-5 pb-3 border-b border-slate-100">
            Summary
          </h2>

          {/* Business name preview */}
          <div className="flex items-center gap-2 mb-5 p-3 bg-indigo-50 rounded-xl">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {businessName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">{businessName}</p>
              <p className="text-xs text-slate-400">Issuing company</p>
            </div>
          </div>

          {/* Totals breakdown */}
          <div className="space-y-2.5 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-900">{fmt(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax ({taxRate}%)</span>
              <span className="font-medium text-slate-900">{fmt(taxAmount, currency)}</span>
            </div>
            <div className="h-px bg-slate-200 my-1" />
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Total Due</span>
              <span className="text-xl font-bold text-indigo-600">{fmt(total, currency)}</span>
            </div>
          </div>

          {/* Error display */}
          <div
            id="invoice-builder-error"
            className="hidden mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
          >
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span></span>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              id="save-draft-btn"
              type="button"
              disabled={isPending}
              onClick={() => handleSubmit(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save as Draft
            </button>
            <button
              id="send-invoice-btn"
              type="button"
              disabled={isPending}
              onClick={() => handleSubmit(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Send Invoice via Email
            </button>
          </div>

          {/* Item count */}
          <p className="text-center text-xs text-slate-400 mt-4">
            {items.length} line item{items.length !== 1 ? "s" : ""} · {currency}
          </p>
        </div>
      </div>
    </div>
  );
}
