"use client";

import { useState, useTransition } from "react";
import { CreditCard, CheckCircle2, Loader2, Lock } from "lucide-react";

interface Props {
  invoiceId: string;
  isPaid: boolean;
  total: number;
  currency: string;
}

export function PublicPayPageClient({ invoiceId, isPaid, total, currency }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePay = () => {
    startTransition(async () => {
      try {
        setError(null);
        const res = await fetch("/api/stripe/public-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoiceId }),
        });
        const data = await res.json();
        if (!res.ok || !data.url) {
          setError(data.error ?? "Payment initialisation failed. Please try again.");
          return;
        }
        window.location.href = data.url;
      } catch {
        setError("Network error. Please check your connection and try again.");
      }
    });
  };

  if (isPaid) {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm">Payment received</p>
          <p className="text-xs text-emerald-600">Thank you — this invoice has been settled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        id="public-pay-btn"
        onClick={handlePay}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <CreditCard size={16} />
        )}
        {isPending
          ? "Redirecting to Stripe…"
          : `Pay ${currency} $${total.toFixed(2)} securely`}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <Lock size={11} />
        <span>256-bit SSL encryption · Powered by Stripe</span>
      </div>
    </div>
  );
}
