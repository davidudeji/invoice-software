import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { ProductForm } from '@/components/Inventory/ProductForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New Product' };

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AppSidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-2xl mx-auto p-8 space-y-6 page-enter">
          <div className="flex items-center gap-4">
            <Link
              href="/inventory"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">New Product</h1>
              <p className="text-slate-500 text-sm">Add a new item to your inventory</p>
            </div>
          </div>

          <ProductForm categories={categories} />
        </div>
      </main>
    </div>
  );
}
