"use client";

import { useStackApp, useUser } from "@stackframe/stack";

export interface AuthState {
  /** The Stack client app, or null when Stack Auth isn't configured. */
  app: ReturnType<typeof useStackApp> | null;
  /** The current Stack user, or null when signed out / not configured. */
  user: ReturnType<typeof useUser>;
  /** Whether Stack Auth is configured on this deployment. */
  isConfigured: boolean;
}

// NEXT_PUBLIC_* env vars are inlined at build time, so this flag is a
// constant for the lifetime of the bundle. layout.tsx only renders a
// StackProvider when these same vars are present, so we must never call
// the Stack hooks when they're absent (they'd throw without a provider).
const isStackConfigured = Boolean(
  process.env.NEXT_PUBLIC_STACK_PROJECT_ID &&
    process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
);

/** Only used when a StackProvider is guaranteed to be mounted. */
function useStackAuth(): AuthState {
  // Hooks are called unconditionally here; the try/catch only guards the
  // rare case where the provider failed to initialize despite env vars
  // being set (see stack.ts), so the page degrades instead of crashing.
  try {
    const app = useStackApp();
    const user = useUser();
    return { app, user, isConfigured: true };
  } catch {
    return { app: null, user: null, isConfigured: false };
  }
}

/** Used when Stack Auth isn't configured — never touches Stack hooks. */
function useNoAuth(): AuthState {
  return { app: null, user: null, isConfigured: false };
}

// The flag is a build-time constant, so every render uses the same hook
// implementation — this does not violate the rules of hooks.
export const useAuth: () => AuthState = isStackConfigured
  ? useStackAuth
  : useNoAuth;
