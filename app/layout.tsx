import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StackProvider } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

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
    <html lang="en">
      <body className={inter.className}>
        <StackProvider app={stackServerApp}>
          {children}
        </StackProvider>
      </body>
    </html>
  );
}
