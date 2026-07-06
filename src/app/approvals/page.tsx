"use client";

import { AppSidebar } from "@/components/Layout/AppSidebar";
import { useInvoiceStore } from "@/lib/store";
import { ApprovalWorkflow } from "@/components/Invoices/ApprovalWorkflow";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function ApprovalsPage() {
    const { invoices, clients } = useInvoiceStore();
    const [filter, setFilter] = useState<'pending' | 'all'>('pending');

    const filteredInvoices = invoices.filter(inv => {
        if (filter === 'pending') return inv.status === 'SENT';
        return inv.status !== 'DRAFT';
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <AppSidebar />

            <main className="pl-64">
                <div className="max-w-5xl mx-auto p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Approvals</h1>
                            <p className="text-slate-500 text-sm">Review and authorize pending invoices.</p>
                        </div>

                        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'pending' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Pending Review
                            </button>
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                All History
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filteredInvoices.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                                <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                                    <CheckCircle size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
                                <p className="text-slate-500">No invoices require your approval at the moment.</p>
                            </div>
                        ) : (
                            filteredInvoices.map((invoice) => {
                                const client = clients.find(c => c.id === invoice.clientId);
                                return (
                                    <div key={invoice.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-lg text-slate-900">{client?.name || 'Unknown Client'}</h3>
                                                    <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{invoice.number}</span>
                                                </div>
                                                <p className="text-sm text-slate-500">Due {new Date(invoice.dueDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-slate-900">${invoice.total.toFixed(2)}</p>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Amount</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50/50 p-6">
                                            <ApprovalWorkflow invoice={invoice} />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
