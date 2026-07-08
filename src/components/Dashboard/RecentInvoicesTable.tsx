"use client";

import { useEffect, useState } from "react";
import { Eye, MoreHorizontal, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getInvoices } from "@/app/actions/invoices";
import type { Invoice, Client } from "@prisma/client";

type InvoiceWithClient = Invoice & { client: Pick<Client, "name" | "email"> };

export function RecentInvoicesTable() {
    const [invoices, setInvoices] = useState<InvoiceWithClient[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        const fetchInvoices = async () => {
            try {
                setIsLoading(true);
                const result = await getInvoices({ page: 1, pageSize: 5 });
                if (isMounted && result?.invoices) {
                    setInvoices(result.invoices as InvoiceWithClient[]);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load invoices');
                    setInvoices([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        
        fetchInvoices();
        
        return () => {
            isMounted = false;
        };
    }, []);

    if (error) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowUpRight size={24} className="text-red-300" />
                </div>
                <h3 className="text-slate-900 font-medium mb-1">Error loading invoices</h3>
                <p className="text-slate-500 text-sm mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-indigo-600 text-sm font-semibold hover:underline">
                    Retry &rarr;
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (invoices.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowUpRight size={24} className="text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-medium mb-1">No invoices yet</h3>
                <p className="text-slate-500 text-sm mb-4">Create your first invoice to get started now.</p>
                <Link href="/invoices/new" className="text-indigo-600 text-sm font-semibold hover:underline">
                    Create Invoice &rarr;
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Recent Invoices</h3>
                <Link href="/invoices" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                    View All
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Invoice #</th>
                            <th className="px-6 py-3">Client</th>
                            <th className="px-6 py-3">Due Date</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-slate-900">{inv.number}</td>
                                <td className="px-6 py-4 text-slate-600">{inv.client.name}</td>
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                    {new Date(inv.dueDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-700">
                                    ${inv.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : inv.status === 'OVERDUE' ? 'bg-rose-100 text-rose-700' : inv.status === 'SENT' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {inv.status.toLowerCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/invoices/${inv.id}`} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                                            <Eye size={16} />
                                        </Link>
                                        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
