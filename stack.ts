import { StackServerApp } from "@stackframe/stack";

// Check if Stack Auth is configured
const isStackAuthConfigured = 
  process.env.NEXT_PUBLIC_STACK_PROJECT_ID &&
  process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;

export const stackServerApp = isStackAuthConfigured
  ? new StackServerApp({
      tokenStore: "nextjs-cookie",
      urls: {
        home: "/",
        signIn: "/signin",
        signUp: "/signup",
        afterSignIn: "/dashboard",
        afterSignUp: "/dashboard",
        afterSignOut: "/",
      },
    })
  : null as any; // Fallback for demo mode
