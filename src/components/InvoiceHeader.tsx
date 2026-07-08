"use client";

import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/Card";
import { Badge } from "@/components/Badge";

type BadgeStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "partial"
  | "cancelled";

interface InvoiceHeaderProps {
  invoiceNumber: string;
  clientName: string;
  dueDate: string;
  status: BadgeStatus;
  amount: number;
  amountPaid?: number;
  currency?: string;
}

export function InvoiceHeader({
  invoiceNumber,
  clientName,
  dueDate,
  status,
  amount,
  amountPaid = 0,
  currency = "USD",
}: InvoiceHeaderProps) {
  const remainingBalance = amount - amountPaid;
  const isPaid = status === "paid";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="border-slate-200">
      <CardHeader
        title={
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-slate-900">
              Invoice
            </span>
            <span className="font-mono text-2xl text-slate-600">
              {invoiceNumber}
            </span>
          </div>
        }
        subtitle={`To: ${clientName} • Due ${dueDate}`}
        action={
          <Badge status={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        }
      />

      <CardBody className="pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {/* Total Amount */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Amount
            </p>
            <p className="font-mono text-2xl font-semibold text-slate-900">
              {formatCurrency(amount)}
            </p>
          </div>

          {/* Amount Paid */}
          {amountPaid > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Amount Paid
              </p>
              <p className="font-mono text-2xl font-semibold text-emerald-600">
                {formatCurrency(amountPaid)}
              </p>
            </div>
          )}

          {/* Remaining Balance */}
          {!isPaid && remainingBalance > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Balance Due
              </p>
              <p
                className={`font-mono text-2xl font-semibold ${remainingBalance > 0 ? "text-slate-900" : "text-emerald-600"}`}
              >
                {formatCurrency(remainingBalance)}
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar for Partial Payments */}
        {amountPaid > 0 && !isPaid && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Payment Progress
              </p>
              <p className="text-xs font-semibold text-slate-600">
                {Math.round((amountPaid / amount) * 100)}%
              </p>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(amountPaid / amount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
