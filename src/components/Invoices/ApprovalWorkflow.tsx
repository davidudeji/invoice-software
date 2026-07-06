"use client";

import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { useState } from "react";

interface ApprovalWorkflowProps {
    invoice: {
        id: string;
        status: string;
    };
}

export function ApprovalWorkflow({ invoice }: ApprovalWorkflowProps) {
    const [isApproving, setIsApproving] = useState(false);

    // Mocking a "Manager" view for demonstration
    // In a real app, we check user permissions
    const canApprove = true;

    const handleApprove = () => {
        setIsApproving(true);
        setTimeout(() => {
            setIsApproving(false);
        }, 800);
    };

    const handleReject = () => {
        if (confirm("Are you sure you want to reject this invoice?")) {
            // Placeholder for future approval workflow integration.
        }
    };

    if (invoice.status === 'DRAFT') return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
                Approval Workflow
            </h3>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {invoice.status === 'PAID' && (
                        <div className="p-2 bg-green-100 text-green-700 rounded-full">
                            <CheckCircle size={20} />
                        </div>
                    )}
                    {invoice.status === 'OVERDUE' && (
                        <div className="p-2 bg-red-100 text-red-700 rounded-full">
                            <XCircle size={20} />
                        </div>
                    )}
                    {invoice.status === 'SENT' && (
                        <div className="p-2 bg-amber-100 text-amber-700 rounded-full">
                            <Clock size={20} />
                        </div>
                    )}

                    <div>
                        <p className="font-medium text-slate-900 capitalize">
                            {invoice.status === 'SENT' ? 'Pending Manager Review' : invoice.status === 'PAID' ? 'Approved for Payment' : invoice.status === 'OVERDUE' ? 'Invoice Requires Attention' : 'Draft'}
                        </p>
                        <p className="text-sm text-slate-500">
                            {invoice.status === 'SENT' ? 'Waiting for authorization to schedule payment.' : invoice.status === 'PAID' ? 'Payment completed and recorded.' : ''}
                        </p>
                    </div>
                </div>

                {invoice.status === 'SENT' && canApprove && (
                    <div className="flex gap-3">
                        <button
                            onClick={handleReject}
                            className="px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={isApproving}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                        >
                            {isApproving ? 'Approving...' : 'Approve & Schedule'}
                        </button>
                    </div>
                )}
            </div>

            {/* Smart Warnings */}
            {invoice.status === 'OVERDUE' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                    <AlertTriangle size={18} className="text-red-600 mt-0.5" />
                    <div className="text-sm text-red-800">
                        <p className="font-semibold">Action Required</p>
                        <p>This invoice is overdue and should be followed up promptly.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
