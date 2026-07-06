'use client';

import { useActionState, useState } from 'react';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories';
import { SubmitButton } from '@/components/SubmitButton';
import { X, Tag, Trash2, Edit2, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import type { ActionState } from '@/types';

type CategoryWithCount = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  _count: { products: number };
};

interface Props {
  categories: CategoryWithCount[];
}

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4', '#64748b', '#1e293b',
];

const initialState: ActionState = { message: null };

function CategoryForm({
  category,
  onClose,
}: {
  category?: CategoryWithCount;
  onClose: () => void;
}) {
  const [color, setColor] = useState(category?.color ?? '#6366f1');

  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;

  const [state, formAction] = useActionState(action, initialState);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">
            {category ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {state?.message && !state.success && (
          <div className="mx-5 mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            <AlertCircle size={14} />
            {state.message}
          </div>
        )}
        {state?.success && (
          <div className="mx-5 mt-4 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-600">
            <CheckCircle size={14} />
            {state.message}
          </div>
        )}

        <form action={formAction} className="p-5 space-y-4">
          {/* Hidden color input */}
          <input type="hidden" name="color" value={color} />

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Name *
            </label>
            <input
              name="name"
              defaultValue={category?.name}
              required
              placeholder="e.g. Electronics, Services"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
            {state?.errors?.name && (
              <p className="mt-1 text-xs text-red-500">{state.errors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={category?.description ?? ''}
              rows={2}
              placeholder="Optional description"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Colour
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-lg transition-all ${color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-lg border border-slate-200 flex-shrink-0" style={{ backgroundColor: color }} />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setColor(e.target.value);
                }}
                className="w-28 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <SubmitButton className="flex-1">
              {category ? 'Save Changes' : 'Create Category'}
            </SubmitButton>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CategoryList({ categories }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  async function handleDelete(id: string) {
    setDeletingId(id);
    setDeleteError('');
    const result = await deleteCategory(id);
    if (!result.success) {
      setDeleteError(result.message ?? 'Delete failed.');
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-4">
      {showCreate && <CategoryForm onClose={() => setShowCreate(false)} />}
      {editingId && (
        <CategoryForm
          category={categories.find((c) => c.id === editingId)}
          onClose={() => setEditingId(null)}
        />
      )}

      {deleteError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle size={14} />
          {deleteError}
        </div>
      )}

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreate(true)}
          id="add-category-btn"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Plus size={15} />
          New Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="card py-16 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Tag size={20} className="text-slate-400" />
          </div>
          <p className="font-medium text-slate-600">No categories yet</p>
          <p className="text-sm text-slate-400 mt-1">Create categories to organise your products.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Create your first category →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-5 flex items-start justify-between gap-4 group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-10 w-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  <Tag size={18} style={{ color: cat.color }} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{cat.description}</p>
                  )}
                  <span
                    className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    {cat._count.products} product{cat._count.products !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => setEditingId(cat.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
