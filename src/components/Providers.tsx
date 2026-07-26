'use client';

import { SessionProvider } from 'next-auth/react';
import { PlanHydrator } from '@/components/PlanHydrator';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PlanHydrator />
      {children}
    </SessionProvider>
  );
}
