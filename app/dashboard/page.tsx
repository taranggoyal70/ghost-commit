"use client";

import { motion } from "framer-motion";
import { Ghost, Plus, Zap, LogOut, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isConfigured } = useAuth();

  const handleSignOut = async () => {
    if (user) {
      await user.signOut();
    }
    router.push("/");
  };

  const displayName =
    user?.displayName || user?.primaryEmail?.split("@")[0] || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Ghost className="w-8 h-8 text-purple-400 animate-float" />
              <span className="text-2xl font-bold text-white">Ghost Commit</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
              <Link href="/use-cases" className="text-gray-300 hover:text-white transition">
                Use Cases
              </Link>
              <Link href="/resurrect" className="text-gray-300 hover:text-white transition">
                Analyze a Repo
              </Link>
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : isConfigured ? (
                <Link
                  href="/signin"
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {user ? (
          <>
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome{displayName ? `, ${displayName}` : ""}! 👋
              </h1>
              <p className="text-gray-400 text-lg">
                Analyze a GitHub repo and get an AI-generated resurrection plan.
              </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/resurrect"
                  className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition group"
                >
                  <Plus className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-white mb-2">New Resurrection</h3>
                  <p className="text-gray-400 text-sm">
                    Paste a GitHub URL and start resurrecting
                  </p>
                </Link>

                <Link
                  href="/use-cases"
                  className="p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition group"
                >
                  <Zap className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-white mb-2">Browse Scenarios</h3>
                  <p className="text-gray-400 text-sm">
                    Explore resurrection scenarios and use cases
                  </p>
                </Link>
              </div>
            </motion.div>

            {/* Honest empty state — no database, no invented history */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Your Resurrections</h2>
              <div className="p-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-center">
                <Ghost className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No resurrections yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Analyze your first repo to get an AI-powered resurrection plan.
                </p>
                <Link
                  href="/resurrect"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Your First Repo</span>
                </Link>
              </div>
            </motion.div>
          </>
        ) : (
          /* Not signed in (or auth not configured) — honest prompt, no fake identity */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center py-16"
          >
            <Ghost className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-float" />
            <h1 className="text-3xl font-bold text-white mb-4">
              {isConfigured ? "Sign in to view your dashboard" : "Dashboard"}
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              {isConfigured
                ? "Sign in with your account to access your dashboard. You can also analyze repos without an account."
                : "Authentication isn't configured on this deployment, but you can still analyze repos without an account."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isConfigured && (
                <Link
                  href="/signin"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
              )}
              <Link
                href="/resurrect"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg transition"
              >
                <Sparkles className="w-5 h-5" />
                <span>Analyze a Repo</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
