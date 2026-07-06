// ─────────────────────────────────────────────
// Re-export Prisma types as canonical types
// ─────────────────────────────────────────────
export type {
  User,
  Settings,
  Client,
  Product,
  Category,
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  Payment,
  PaymentStatus,
  Sale,
  AuditLog,
  AuditAction,
  AuditTarget,
  TaxRate,
  PaymentMethod,
} from '@prisma/client';

// ─────────────────────────────────────────────
// Invoice Builder (ephemeral UI state)
// ─────────────────────────────────────────────
export interface InvoiceBuilderItem {
  id: string; // local uuid for react key
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceBuilderState {
  clientId: string;
  date: string;
  dueDate: string;
  taxRate: number;
  notes: string;
  paymentTerms: string;
  items: InvoiceBuilderItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
}

// ─────────────────────────────────────────────
// Filter State (for inventory / invoices lists)
// ─────────────────────────────────────────────
export interface ProductFilterState {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  isActive: string; // 'all' | 'true' | 'false'
}

export interface InvoiceFilterState {
  search: string;
  status: string; // 'all' | InvoiceStatus
  clientId: string;
  dateFrom: string;
  dateTo: string;
}

export interface Ebook {
  id: string;
  title: string;
  author: string;
  price: number;
  description?: string;
  coverUrl?: string;
  fileUrl?: string;
  status: 'draft' | 'published';
  createdAt: string;
}

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  paidInvoicesCount: number;
  outstandingAmount: number;
  overdueCount: number;
  revenueChange: number; // percentage vs previous period
  revenueByMonth: { month: string; revenue: number }[];
}

// ─────────────────────────────────────────────
// Reports / AI
// ─────────────────────────────────────────────
export interface ReportData {
  dateFrom: string;
  dateTo: string;
  totalRevenue: number;
  totalSalesCount: number;
  outstandingDebt: number;
  overdueCount: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  revenueByPeriod: { label: string; revenue: number }[];
}

export interface AISummaryResponse {
  summary: string;
  generatedAt: string;
}

// ─────────────────────────────────────────────
// Server Action State
// ─────────────────────────────────────────────
export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string | null;
  success?: boolean;
};
