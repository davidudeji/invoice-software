"use client";

import { useActionState } from "react";
import { createClient } from "@/app/actions/clients";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { SubmitButton } from "@/components/SubmitButton";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

const initialState: {
  message?: string | null;
  errors?: Record<string, string[]>;
} = { message: "", errors: {} };

const inputClass =
  "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white";
const labelClass =
  "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

export default function NewClientPage() {
  const [state, formAction] = useActionState(createClient, initialState);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AppSidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-2xl mx-auto p-8 space-y-6 page-enter">
          <div className="flex items-center gap-4">
            <Link
              href="/clients"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">New Client</h1>
              <p className="text-slate-500 text-sm">
                Add a client to start creating invoices for them
              </p>
            </div>
          </div>

          {state?.message && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <AlertCircle size={16} className="flex-shrink-0" />
              {state.message}
            </div>
          )}

          <form action={formAction} className="card p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label htmlFor="client-name" className={labelClass}>
                  Full Name *
                </label>
                <input
                  id="client-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  className={inputClass}
                />
                {state?.errors?.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="client-company" className={labelClass}>
                  Company Name
                </label>
                <input
                  id="client-company"
                  name="companyName"
                  type="text"
                  placeholder="Acme Corp"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="client-email" className={labelClass}>
                  Email Address *
                </label>
                <input
                  id="client-email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  className={inputClass}
                />
                {state?.errors?.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="client-phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="client-phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="client-address" className={labelClass}>
                  Address
                </label>
                <textarea
                  id="client-address"
                  name="address"
                  rows={2}
                  placeholder="123 Main St, New York, NY 10001"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label htmlFor="client-website" className={labelClass}>
                  Website
                </label>
                <input
                  id="client-website"
                  name="website"
                  type="text"
                  placeholder="https://example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="client-taxid" className={labelClass}>
                  Tax ID / VAT
                </label>
                <input
                  id="client-taxid"
                  name="taxId"
                  type="text"
                  placeholder="US-123456789"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="client-notes" className={labelClass}>
                  Internal Notes
                </label>
                <textarea
                  id="client-notes"
                  name="notes"
                  rows={2}
                  placeholder="Optional internal notes about this client…"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <Link
                href="/clients"
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </Link>
              <SubmitButton pendingLabel="Creating…">
                Create Client
              </SubmitButton>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
