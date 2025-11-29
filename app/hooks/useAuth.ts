"use client";

import { useStackApp, useUser } from "@stackframe/stack";

export function useAuth() {
  const app = useStackApp();
  const user = useUser();
  
  return { 
    app, 
    user, 
    isConfigured: !!app 
  };
}
