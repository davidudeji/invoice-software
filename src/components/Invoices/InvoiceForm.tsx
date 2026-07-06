"use client";

import { useEffect, useState } from "react";
import { useInvoiceStore } from "@/lib/store";
import { Invoice, InvoiceItem } from "@/types";
import { InvoiceItemsList } from "./InvoiceItemsList";
import { Save, Send, AlertCircle, CheckCircle } from "lucide-react";

type InvoiceFormData = Partial<Invoice> & {
    items?: InvoiceItem[];
    clientId?: string;
    dueDate?: Date | string;
    subtotal?: number;
    taxAmount?: number;
    total?: number;
    taxRate?: number;
};

interface InvoiceFormProps {
    data: InvoiceFormData;
    onChange: (data: InvoiceFormData) => void;
    onSave: () => void;
}

export function InvoiceForm({ data, onChange, onSave }: InvoiceFormProps) {
    const { clients } = useInvoiceStore();

    // Auto-match status check
    const [matchHint, setMatchHint] = useState<{ status: 'matched' | 'mismatched' | 'none', poNumber?: string }>({ status: 'none' });

    // Computed values for display locally, but also need to be passed up if changed?
    // Actually, the parent calculates totals or we do it here. 
    // Let's assume data comes in with items, we calculate totals and push back up.

    const clientId = data.clientId;
    const items = data.items ?? [];
    const dueDate = data.dueDate;

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxRate = 10;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    // Update parent with totals whenever items change
    useEffect(() => {
        if (data.subtotal !== subtotal || data.total !== total) {
            onChange({
                ...data,
                subtotal,
                taxRate,
                taxAmount,
                total
            });
        }
    }, [items, subtotal, total]); // dependencies

    // Real-time Matching Hint
    useEffect(() => {
        if (!clientId || total === 0) {
            setMatchHint({ status: 'none' });
            return;
        }

        setMatchHint({ status: 'none' });
    }, [clientId, total]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 h-fit">
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 className="text-lg font-semibold text-slate-900">Invoice Details</h3>
                    {matchHint.status === 'matched' && (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle size={12} /> Matches PO #{matchHint.poNumber}
                        </span>
                    )}
                    {matchHint.status === 'mismatched' && (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <AlertCircle size={12} /> PO Mismatch
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                        <select
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            value={clientId || ""}
                            onChange={(e) => onChange({ ...data, clientId: e.target.value })}
                        >
                            <option value="">Select a client...</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                        <input
                            type="date"
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            value={dueDate instanceof Date ? dueDate.toISOString().split('T')[0] : (dueDate || "")}
                            onChange={(e) => onChange({ ...data, dueDate: new Date(e.target.value) })}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-2">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Line Items</h3>
                <InvoiceItemsList items={items} onChange={(newItems) => onChange({ ...data, items: newItems })} />
            </div>

            <div className="pt-4 flex gap-3">
                <button
                    onClick={onSave}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-sm"
                >
                    <Save size={16} />
                    Save Draft
                </button>
                <button
                    onClick={onSave}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all text-sm"
                >
                    <Send size={16} />
                    Process Invoice
                </button>
            </div>

            <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Tax (10%)</span>
                    <span className="font-medium text-slate-900">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
