'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePlanStore } from '@/lib/stores/plan-store';
import type { Plan } from '@/lib/stores/plan-store';

/**
 * PlanHydrator
 *
 * A zero-UI client component that seeds the Zustand plan store from the
 * NextAuth session on mount. Place it inside a client boundary (e.g. inside
 * <Providers>) so it has access to the session context.
 *
 * How it works:
 *  1. On mount, reads the session from NextAuth.
 *  2. Derives the plan tier from session metadata (extend with Stripe data later).
 *  3. Calls `setPlan` on the plan store.
 *  4. Marks the store as hydrated — components can use `hydrated` to avoid
 *     showing upgrade banners before the session is known.
 *
 * Extension point:
 *  When you add Stripe subscription data to the session (via the JWT callback
 *  in auth.ts), update the `derivePlan` function below to read it.
 */
function derivePlan(session: ReturnType<typeof useSession>['data']): Plan {
  if (!session?.user) return 'free';

  // TODO: When Stripe is integrated, read from session.user.stripePlan
  // Example: return (session.user as { stripePlan?: Plan }).stripePlan ?? 'free';

  // For now, all authenticated users are treated as 'free'.
  // Change this to 'pro' here to test gating behaviour.
  return 'free';
}

export function PlanHydrator() {
  const { data: session, status } = useSession();
  const { setPlan, setHydrated } = usePlanStore();

  useEffect(() => {
    // Wait until NextAuth has resolved (not loading)
    if (status === 'loading') return;

    const plan = derivePlan(session);
    setPlan(plan);
    setHydrated(true);
  }, [status, session, setPlan, setHydrated]);

  // Renders nothing — purely side-effect component
  return null;
}
