import { getInvoices } from "@/app/actions/invoices";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { InvoiceListClient } from "@/components/Invoices/InvoiceListClient";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Invoices" };

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  
  const status = params.status as any;
  const page = parseInt(params.page || "1");

  const [{ invoices, total }, clients] = await Promise.all([
    getInvoices({ 
      status: status && status !== "all" ? status : undefined, 
      search: params.search,
      page,
    }),
    session?.user?.id
      ? prisma.client.findMany({
          where: { userId: session.user.id },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : [],
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8 space-y-6 page-enter">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {total} invoice{total !== 1 ? "s" : ""} total
              </p>
            </div>
            <Link
              href="/invoices/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Plus size={15} />
              New Invoice
            </Link>
          </div>

          <InvoiceListClient
            initialInvoices={invoices}
            clients={clients}
            total={total}
            currentPage={page}
          />
        </div>
      </main>
    </div>
  );
}
