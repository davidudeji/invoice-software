import { create } from 'zustand';
import {
  InvoiceBuilderItem,
  InvoiceBuilderState,
  ProductFilterState,
  InvoiceFilterState,
} from '@/types';
import type { Ebook } from '@/types';

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

export const useInvoiceBuilderStore = create<InvoiceBuilderStore>((set) => ({
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

// ─────────────────────────────────────────────
// LEGACY UI STORE COMPATIBILITY LAYER
// The older pages still expect a single global store with basic CRUD helpers.
// ─────────────────────────────────────────────

type LegacyProduct = {
  id: string;
  name: string;
  sku: string;
  categoryId?: string;
  price: number;
  stockQuantity: number;
  description?: string;
  status?: 'active' | 'archived';
  isActive?: boolean;
  createdAt: Date | string;
};

type LegacyCategory = {
  id: string;
  name: string;
  color?: string;
};

type LegacyClient = {
  id: string;
  name: string;
  email?: string;
};

type LegacyInvoice = {
  id: string;
  number: string;
  clientId: string;
  date: string;
  dueDate: string;
  status: string;
  items?: Array<{ id: string; description: string; quantity: number; price: number }>;
  total: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  taxAmount: number;
  discount?: number;
  notes?: string;
  createdAt: string;
  approvalStatus?: string;
  matchStatus?: string;
};

type CartItem = {
  productId: string;
  quantity: number;
  priceAtAdd: number;
};

interface InvoiceStoreState {
  products: LegacyProduct[];
  categories: LegacyCategory[];
  clients: LegacyClient[];
  invoices: LegacyInvoice[];
  cart: CartItem[];
  ebooks: Ebook[];
  addProduct: (product: LegacyProduct) => void;
  addInvoice: (invoice: LegacyInvoice) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  approveInvoice: (id: string) => void;
  rejectInvoice: (id: string) => void;
  submitForApproval: (id: string) => void;
  addEbook: (ebook: Ebook) => void;
  deleteEbook: (id: string) => void;
}

export const useInvoiceStore = create<InvoiceStoreState>((set) => ({
  products: [],
  categories: [],
  clients: [],
  invoices: [],
  cart: [],
  ebooks: [],
  addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
  addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),
  addToCart: (item) =>
    set((state) => {
      const exists = state.cart.find((entry) => entry.productId === item.productId);
      if (exists) {
        return {
          cart: state.cart.map((entry) =>
            entry.productId === item.productId ? { ...entry, quantity: entry.quantity + item.quantity } : entry
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),
  removeFromCart: (productId) => set((state) => ({ cart: state.cart.filter((entry) => entry.productId !== productId) })),
  updateCartQuantity: (productId, quantity) =>
    set((state) => ({
      cart: quantity <= 0
        ? state.cart.filter((entry) => entry.productId !== productId)
        : state.cart.map((entry) => (entry.productId === productId ? { ...entry, quantity } : entry)),
    })),
  clearCart: () => set({ cart: [] }),
  approveInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.map((invoice) => (invoice.id === id ? { ...invoice, approvalStatus: 'approved' } : invoice)),
    })),
  rejectInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.map((invoice) => (invoice.id === id ? { ...invoice, approvalStatus: 'rejected' } : invoice)),
    })),
  submitForApproval: (id) =>
    set((state) => ({
      invoices: state.invoices.map((invoice) => (invoice.id === id ? { ...invoice, approvalStatus: 'pending' } : invoice)),
    })),
  addEbook: (ebook) => set((state) => ({ ebooks: [ebook, ...state.ebooks] })),
  deleteEbook: (id) => set((state) => ({ ebooks: state.ebooks.filter((ebook) => ebook.id !== id) })),
}));
