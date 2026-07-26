// ─────────────────────────────────────────────
// Stores barrel — single import point for all Zustand stores
// ─────────────────────────────────────────────

export { usePlanStore, PLAN_LIMITS } from './plan-store';
export type { Plan, PlanLimits, PlanState } from './plan-store';

export { useTierLimits } from './use-tier-limits';
export type { TierGate, UsageSnapshot } from './use-tier-limits';

export { sessionStorageAdapter } from './session-storage-adapter';

// Core app stores (invoice builder, filters, legacy)
export {
  useInvoiceBuilderStore,
  useProductFilterStore,
  useInvoiceFilterStore,
  useInvoiceStore,
} from '@/lib/store';
