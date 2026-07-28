import { createJSONStorage } from 'zustand/middleware';

/**
 * A Zustand `PersistStorage` adapter that wraps `sessionStorage`.
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

/**
 * SSR-safe raw StateStorage that reads/writes sessionStorage.
 * We feed this into `createJSONStorage` so that Zustand's persist
 * middleware gets a properly-typed `PersistStorage<unknown>` back.
 */
const rawSessionStorage = {
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

/**
 * Ready-to-use PersistStorage adapter for Zustand's `persist` middleware.
 * Wraps the raw sessionStorage in `createJSONStorage` so the types align.
 */
export const sessionStorageAdapter = createJSONStorage(() => rawSessionStorage);
