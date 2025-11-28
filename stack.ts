import { StackServerApp } from "@stackframe/stack";

// Check if Stack Auth is configured
const isStackAuthConfigured = 
  process.env.NEXT_PUBLIC_STACK_PROJECT_ID &&
  process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;

// Only initialize Stack Auth if properly configured
let stackServerApp: any = null;

if (isStackAuthConfigured) {
  try {
    stackServerApp = new StackServerApp({
      tokenStore: "nextjs-cookie",
      urls: {
        home: "/",
        signIn: "/signin",
        signUp: "/signup",
        afterSignIn: "/dashboard",
        afterSignUp: "/dashboard",
        afterSignOut: "/",
      },
    });
  } catch (error) {
    console.log('Stack Auth not configured - running in demo mode');
    stackServerApp = null;
  }
}

export { stackServerApp };
