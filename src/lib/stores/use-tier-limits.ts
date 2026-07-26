import { usePlanStore } from './plan-store';

// ─────────────────────────────────────────────
// USAGE COUNTS
// Pass the current counts from your data-fetching layer
// (server components, SWR, React Query, etc.) into this hook.
// ─────────────────────────────────────────────

export interface UsageSnapshot {
  invoiceCount?: number;
  clientCount?: number;
  productCount?: number;
  categoryCount?: number;
}

// ─────────────────────────────────────────────
// TIER GATE RESULT
// ─────────────────────────────────────────────

export interface TierGate {
  /** Whether the user can create another invoice */
  canCreateInvoice: boolean;
  /** Whether the user can add another client */
  canCreateClient: boolean;
  /** Whether the user can add another product */
  canCreateProduct: boolean;
  /** Whether the user can add another category */
  canCreateCategory: boolean;
  /** Whether AI features are enabled for this plan */
  canUseAI: boolean;
  /** Whether OCR scanning is enabled for this plan */
  canUseOCR: boolean;
  /** Whether advanced reports are available */
  canViewAdvancedReports: boolean;
  /** Whether email delivery is enabled */
  canSendEmail: boolean;
  /** Shorthand: true if the user is on a free plan */
  isFreeTier: boolean;
  /** Shorthand: true if any limit has been hit */
  upgradeRequired: boolean;
  /** Human-readable reason for the upgrade gate (if any) */
  upgradeReason: string | null;
  /** Current plan name */
  plan: 'free' | 'pro' | 'enterprise';
  /** Raw limits for the current plan */
  limits: ReturnType<typeof usePlanStore.getState>['limits'];
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

/**
 * `useTierLimits(usage?)` — returns feature gate flags for the current plan.
 *
 * Usage:
 * ```tsx
 * const { canCreateInvoice, upgradeRequired, upgradeReason } = useTierLimits({
 *   invoiceCount: invoices.length,
 * });
 *
 * if (!canCreateInvoice) return <UpgradeBanner reason={upgradeReason} />;
 * ```
 *
 * Pass `usage` counts from your server data — the hook compares them against
 * the plan limits to compute gate flags. Passing undefined counts defaults
 * to "allowed" (optimistic gate — server enforces hard limits).
 */
export function useTierLimits(usage: UsageSnapshot = {}): TierGate {
  const { plan, limits } = usePlanStore();

  const {
    invoiceCount = 0,
    clientCount = 0,
    productCount = 0,
    categoryCount = 0,
  } = usage;

  // A limit of 0 means unlimited
  const withinLimit = (current: number, max: number) =>
    max === 0 || current < max;

  const canCreateInvoice = withinLimit(invoiceCount, limits.maxInvoices);
  const canCreateClient = withinLimit(clientCount, limits.maxClients);
  const canCreateProduct = withinLimit(productCount, limits.maxProducts);
  const canCreateCategory = withinLimit(categoryCount, limits.maxCategories);
  const canUseAI = limits.aiEnabled;
  const canUseOCR = limits.ocrEnabled;
  const canViewAdvancedReports = limits.advancedReports;
  const canSendEmail = limits.emailEnabled;

  const isFreeTier = plan === 'free';

  // Build a human-readable upgrade reason
  const reasons: string[] = [];
  if (!canCreateInvoice)
    reasons.push(`invoice limit (${limits.maxInvoices}/month)`);
  if (!canCreateClient) reasons.push(`client limit (${limits.maxClients})`);
  if (!canCreateProduct)
    reasons.push(`product limit (${limits.maxProducts})`);
  if (!canCreateCategory)
    reasons.push(`category limit (${limits.maxCategories})`);
  if (!canUseAI) reasons.push('AI features');
  if (!canUseOCR) reasons.push('OCR scanning');
  if (!canViewAdvancedReports) reasons.push('advanced reports');
  if (!canSendEmail) reasons.push('email delivery');

  const upgradeRequired = reasons.length > 0;
  const upgradeReason = upgradeRequired
    ? `Upgrade to Pro to unlock: ${reasons.join(', ')}.`
    : null;

  return {
    canCreateInvoice,
    canCreateClient,
    canCreateProduct,
    canCreateCategory,
    canUseAI,
    canUseOCR,
    canViewAdvancedReports,
    canSendEmail,
    isFreeTier,
    upgradeRequired,
    upgradeReason,
    plan,
    limits,
  };
}
