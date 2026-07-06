import { create } from 'zustand';
import { InvoiceBuilderItem, InvoiceBuilderState, ProductFilterState, InvoiceFilterState } from '@/types';

// ─────────────────────────────────────────────
// INVOICE BUILDER STORE
// Ephemeral state for the in-flight invoice creation form.
// Cleared on submit / navigation away.
// ─────────────────────────────────────────────

interface InvoiceBuilderStore extends InvoiceBuilderState {
  // Setters
  setClientId: (clientId: string) => void;
  setDate: (date: string) => void;
  setDueDate: (dueDate: string) => void;
  setTaxRate: (rate: number) => void;
  setNotes: (notes: string) => void;
  setPaymentTerms: (terms: string) => void;

  // Line item actions
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<InvoiceBuilderItem>) => void;

  // OCR autofill
  autofillFromOCR: (data: Partial<InvoiceBuilderState>) => void;

  // Reset
  reset: () => void;
}

function computeTotals(items: InvoiceBuilderItem[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  return { subtotal, taxAmount, total };
}

function newItem(): InvoiceBuilderItem {
  return {
    id: crypto.randomUUID(),
    productId: undefined,
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0,
  };
}

const BUILDER_DEFAULTS: InvoiceBuilderState = {
  clientId: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: '',
  taxRate: 0,
  notes: '',
  paymentTerms: 'NET_30',
  items: [],
  subtotal: 0,
  taxAmount: 0,
  total: 0,
};

export const useInvoiceBuilderStore = create<InvoiceBuilderStore>((set, get) => ({
  ...BUILDER_DEFAULTS,

  setClientId: (clientId) => set({ clientId }),
  setDate: (date) => set({ date }),
  setDueDate: (dueDate) => set({ dueDate }),
  setNotes: (notes) => set({ notes }),
  setPaymentTerms: (paymentTerms) => set({ paymentTerms }),

  setTaxRate: (taxRate) =>
    set((state) => ({
      taxRate,
      ...computeTotals(state.items, taxRate),
    })),

  addItem: () =>
    set((state) => {
      const items = [...state.items, newItem()];
      return { items, ...computeTotals(items, state.taxRate) };
    }),

  removeItem: (id) =>
    set((state) => {
      const items = state.items.filter((item) => item.id !== id);
      return { items, ...computeTotals(items, state.taxRate) };
    }),

  updateItem: (id, updates) =>
    set((state) => {
      const items = state.items.map((item) => {
        if (item.id !== id) return item;
        const merged = { ...item, ...updates };
        // Recalculate row total whenever price or quantity changes
        merged.total = merged.quantity * merged.unitPrice;
        return merged;
      });
      return { items, ...computeTotals(items, state.taxRate) };
    }),

  autofillFromOCR: (data) =>
    set((state) => {
      const items = data.items ?? state.items;
      const taxRate = data.taxRate ?? state.taxRate;
      return {
        ...state,
        ...data,
        items,
        taxRate,
        ...computeTotals(items, taxRate),
      };
    }),

  reset: () => set({ ...BUILDER_DEFAULTS, items: [] }),
}));

// ─────────────────────────────────────────────
// PRODUCT FILTER STORE
// ─────────────────────────────────────────────

interface ProductFilterStore extends ProductFilterState {
  setSearch: (search: string) => void;
  setCategoryId: (id: string) => void;
  setMinPrice: (price: string) => void;
  setMaxPrice: (price: string) => void;
  setIsActive: (val: string) => void;
  reset: () => void;
}

const PRODUCT_FILTER_DEFAULTS: ProductFilterState = {
  search: '',
  categoryId: '',
  minPrice: '',
  maxPrice: '',
  isActive: 'all',
};

export const useProductFilterStore = create<ProductFilterStore>((set) => ({
  ...PRODUCT_FILTER_DEFAULTS,
  setSearch: (search) => set({ search }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setIsActive: (isActive) => set({ isActive }),
  reset: () => set(PRODUCT_FILTER_DEFAULTS),
}));

// ─────────────────────────────────────────────
// INVOICE FILTER STORE
// ─────────────────────────────────────────────

interface InvoiceFilterStore extends InvoiceFilterState {
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setClientId: (id: string) => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  reset: () => void;
}

const INVOICE_FILTER_DEFAULTS: InvoiceFilterState = {
  search: '',
  status: 'all',
  clientId: '',
  dateFrom: '',
  dateTo: '',
};

export const useInvoiceFilterStore = create<InvoiceFilterStore>((set) => ({
  ...INVOICE_FILTER_DEFAULTS,
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setClientId: (clientId) => set({ clientId }),
  setDateFrom: (dateFrom) => set({ dateFrom }),
  setDateTo: (dateTo) => set({ dateTo }),
  reset: () => set(INVOICE_FILTER_DEFAULTS),
}));
