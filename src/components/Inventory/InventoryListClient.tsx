"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Filter, Package, DollarSign, Boxes, Pencil, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { deleteProduct } from "@/app/actions/products";
import type { Product, Category } from "@prisma/client";

interface Props {
  products: Array<Product & { category: Pick<Category, "id" | "name" | "color"> | null }>;
  categories: Category[];
}

export function InventoryListClient({ products, categories }: Props) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.sku || "").toLowerCase().includes(search.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryId === "all" || product.categoryId === categoryId;
      const matchesMinPrice = !minPrice || product.price >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || product.price <= Number(maxPrice);
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }, [products, search, categoryId, minPrice, maxPrice]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    setDeleteError("");
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (!result.success) {
        setDeleteError(result.message ?? "Delete failed.");
      }
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-4">
      {deleteError && (
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle size={14} />
          {deleteError}
        </div>
      )}

      {/* Filter Bar */}
      <div className="card p-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or SKU…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="text-sm bg-transparent focus:outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min price"
            className="w-28 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price"
            className="w-28 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div className="text-xs text-slate-400 ml-auto">
          {filteredProducts.length} of {products.length}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="card py-16 text-center text-slate-500">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Package size={20} className="text-slate-400" />
          </div>
          <p className="font-medium">No products match your filters</p>
          <p className="text-sm mt-1">Try a different keyword or price range.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card overflow-hidden group hover:shadow-md transition-shadow">
              <div className="border-b border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{product.sku || "No SKU"}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {product.category && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: `${product.category.color}20`, color: product.category.color }}
                      >
                        {product.category.name}
                      </span>
                    )}
                    {!product.isActive && (
                      <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign size={14} className="text-slate-400" /> Price
                  </span>
                  <span className="font-semibold text-slate-900">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Boxes size={14} className="text-slate-400" /> Stock
                  </span>
                  <span className={`font-semibold ${product.stockQuantity <= 5 ? 'text-amber-600' : 'text-slate-900'}`}>
                    {product.stockQuantity} {product.stockQuantity <= 5 && product.stockQuantity > 0 ? '(low)' : ''}
                    {product.stockQuantity === 0 ? '— out of stock' : ''}
                  </span>
                </div>
                {product.description && (
                  <p className="text-slate-500 text-xs line-clamp-2">{product.description}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-1 border-t border-slate-100 p-3">
                <Link
                  href={`/inventory/${product.id}/edit`}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-1"
                >
                  <Pencil size={12} />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  disabled={deletingId === product.id || isPending}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1 disabled:opacity-40"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
