"use client";

import { useStackApp, useUser } from "@stackframe/stack";

export function useAuth() {
  try {
    const app = useStackApp();
    const user = useUser();
    return { app, user, isConfigured: true };
  } catch (error) {
    // Stack Auth not configured - return null values
    return { app: null, user: null, isConfigured: false };
  }
}
