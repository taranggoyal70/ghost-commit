import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StackProvider } from "@stackframe/stack";
import { stackServerApp } from "@/stack";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ghost Commit - Resurrect Dead GitHub Repos with AI",
  description: "Bring your dead GitHub repositories back to life with AI-powered resurrection",
  keywords: ["GitHub", "AI", "Code", "Resurrection", "Stack Auth"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {stackServerApp ? (
          <StackProvider app={stackServerApp}>
            {children}
          </StackProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
