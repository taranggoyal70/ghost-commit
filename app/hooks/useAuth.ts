"use client";

import { useStackApp, useUser } from "@stackframe/stack";

export function useAuth() {
  // Always call hooks - React requirement
  const app = useStackApp();
  const user = useUser();
  
  // Return the values - Stack Auth provider handles the null cases
  return { 
    app, 
    user, 
    isConfigured: !!app 
  };
}
