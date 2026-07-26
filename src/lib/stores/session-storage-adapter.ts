import type { StateStorage } from 'zustand/middleware';

/**
 * A Zustand `StateStorage` adapter that wraps `sessionStorage`.
 *
 * Safe for Next.js SSR: all methods are no-ops when `window` is not defined
 * (server-side rendering, edge runtime, etc.). This prevents the infamous
 * "sessionStorage is not defined" error during build/render.
 *
 * Characteristics:
 *  - Data lives only in the current browser tab.
 *  - Data is cleared when the tab/window is closed.
 *  - Data is NOT shared across tabs (unlike localStorage).
 *
 * These properties make it ideal for free-tier draft preservation —
 * users keep their in-progress work within a session without any
 * cross-tab leakage.
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

export const sessionStorageAdapter: StateStorage = {
  getItem(key: string): string | null {
    if (!isClient()) return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      // Incognito mode or storage quota exceeded
      return null;
    }
  },

  setItem(key: string, value: string): void {
    if (!isClient()) return;
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Storage full or blocked — silently swallow so the app still works
    }
  },

  removeItem(key: string): void {
    if (!isClient()) return;
    try {
      sessionStorage.removeItem(key);
    } catch {
      // noop
    }
  },
};
