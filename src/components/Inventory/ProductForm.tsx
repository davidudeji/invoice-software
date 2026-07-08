'use client';

import { useActionState } from 'react';
import { createProduct } from '@/app/actions/products';
import type { Category } from '@prisma/client';

const initialState = { message: null };

interface Props {
  categories: Category[];
}

export function ProductForm({ categories }: Props) {
  const [state, formAction] = useActionState(createProduct, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Product name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="e.g. Premium Plan"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Optional product details"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="sku" className="mb-1 block text-sm font-medium text-slate-700">
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            placeholder="SKU-001"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-slate-700">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue="0"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="stockQuantity" className="mb-1 block text-sm font-medium text-slate-700">
            Stock quantity
          </label>
          <input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            min="0"
            defaultValue="0"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-500"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <input id="isActive" name="isActive" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
          <label htmlFor="isActive" className="text-sm text-slate-700">
            Active product
          </label>
        </div>
      </div>

      {state?.message ? (
        <p className={`text-sm ${state.message.includes('Failed') || state.message.includes('Error') ? 'text-red-600' : 'text-emerald-600'}`}>
          {state.message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Create product
        </button>
      </div>
    </form>
  );
}
