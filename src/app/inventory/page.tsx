import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { InventoryListClient } from "@/components/Inventory/InventoryListClient";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Inventory" };

export const revalidate = 30;

export default async function InventoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { userId: session.user.id },
      include: { category: { select: { id: true, name: true, color: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar />
      <main className="md:pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 page-enter">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {products.length} product{products.length !== 1 ? "s" : ""} · manage catalog, stock & pricing
              </p>
            </div>
            <Link
              href="/inventory/new"
              id="add-product-btn"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Plus size={15} />
              Add Product
            </Link>
          </div>

          <InventoryListClient products={products} categories={categories} />
        </div>
      </main>
    </div>
  );
}
