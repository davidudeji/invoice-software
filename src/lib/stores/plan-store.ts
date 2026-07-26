import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sessionStorageAdapter } from './session-storage-adapter';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type Plan = 'free' | 'pro' | 'enterprise';

export interface PlanLimits {
  /** Max invoices allowed per month (0 = unlimited) */
  maxInvoices: number;
  /** Max clients allowed in total (0 = unlimited) */
  maxClients: number;
  /** Max products/services in catalog (0 = unlimited) */
  maxProducts: number;
  /** Max categories (0 = unlimited) */
  maxCategories: number;
  /** Whether AI-powered features are enabled */
  aiEnabled: boolean;
  /** Whether OCR receipt scanning is enabled */
  ocrEnabled: boolean;
  /** Whether advanced reports are enabled */
  advancedReports: boolean;
  /** Whether email delivery is enabled */
  emailEnabled: boolean;
}

export interface PlanState {
  plan: Plan;
  limits: PlanLimits;
  /** Whether the plan state has been hydrated from the session */
  hydrated: boolean;
}

interface PlanStore extends PlanState {
  /** Set the active plan (called by PlanHydrator on mount) */
  setPlan: (plan: Plan) => void;
  /** Mark as hydrated once session data has been loaded */
  setHydrated: (hydrated: boolean) => void;
  /** Reset to free tier (e.g. on sign out) */
  resetToFree: () => void;
}

// ─────────────────────────────────────────────
// PLAN LIMITS CONFIG
// Centralised source of truth for all tier limits.
// Extend these as your pricing model evolves.
// ─────────────────────────────────────────────

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxInvoices: 5,
    maxClients: 3,
    maxProducts: 10,
    maxCategories: 3,
    aiEnabled: false,
    ocrEnabled: false,
    advancedReports: false,
    emailEnabled: false,
  },
  pro: {
    maxInvoices: 0, // unlimited
    maxClients: 0,
    maxProducts: 0,
    maxCategories: 0,
    aiEnabled: true,
    ocrEnabled: true,
    advancedReports: true,
    emailEnabled: true,
  },
  enterprise: {
    maxInvoices: 0,
    maxClients: 0,
    maxProducts: 0,
    maxCategories: 0,
    aiEnabled: true,
    ocrEnabled: true,
    advancedReports: true,
    emailEnabled: true,
  },
};

// ─────────────────────────────────────────────
// FREE TIER DEFAULTS
// ─────────────────────────────────────────────

const FREE_TIER_DEFAULTS: PlanState = {
  plan: 'free',
  limits: PLAN_LIMITS.free,
  hydrated: false,
};

// ─────────────────────────────────────────────
// PLAN STORE
// Persisted to sessionStorage so the plan survives
// page refreshes within the same browser tab.
// On a new session (new tab / new window) it re-hydrates
// from the NextAuth session via PlanHydrator.
// ─────────────────────────────────────────────

export const usePlanStore = create<PlanStore>()(
  persist(
    (set) => ({
      ...FREE_TIER_DEFAULTS,

      setPlan: (plan) =>
        set({
          plan,
          limits: PLAN_LIMITS[plan],
        }),

      setHydrated: (hydrated) => set({ hydrated }),

      resetToFree: () => set({ ...FREE_TIER_DEFAULTS, hydrated: false }),
    }),
    {
      name: 'invoicepay-plan',
      storage: sessionStorageAdapter,
      // Only persist plan identifier and limits — not hydration flag
      // (hydration flag should always start false on a fresh session load)
      partialize: (state) => ({
        plan: state.plan,
        limits: state.limits,
      }),
    }
  )
);
