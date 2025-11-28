"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Ghost,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  GitBranch,
  Zap,
  ExternalLink,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useUser, useStackApp } from "@stackframe/stack";
import { useRouter } from "next/navigation";

interface Resurrection {
  id: string;
  repoName: string;
  repoUrl: string;
  scenario: string;
  status: "completed" | "in_progress" | "failed";
  createdAt: string;
  deployedUrl?: string;
  prUrl?: string;
}

export default function DashboardPage() {
  const user = useUser();
  const app = useStackApp();
  const router = useRouter();

  // Redirect if not signed in
  if (!user) {
    router.push("/signin");
    return null;
  }

  const handleSignOut = async () => {
    await app.signOut();
    router.push("/");
  };

  const [resurrections] = useState<Resurrection[]>([
    {
      id: "1",
      repoName: "old-react-app",
      repoUrl: "https://github.com/user/old-react-app",
      scenario: "Outdated React",
      status: "completed",
      createdAt: "2 hours ago",
      deployedUrl: "https://old-react-app-resurrected.vercel.app",
      prUrl: "https://github.com/user/old-react-app/pull/1",
    },
    {
      id: "2",
      repoName: "nextjs-pages-app",
      repoUrl: "https://github.com/user/nextjs-pages-app",
      scenario: "Next.js Migration",
      status: "in_progress",
      createdAt: "30 minutes ago",
    },
    {
      id: "3",
      repoName: "no-auth-app",
      repoUrl: "https://github.com/user/no-auth-app",
      scenario: "Add Authentication",
      status: "completed",
      createdAt: "1 day ago",
      deployedUrl: "https://no-auth-app-resurrected.vercel.app",
      prUrl: "https://github.com/user/no-auth-app/pull/1",
    },
  ]);

  const stats = {
    total: 12,
    completed: 10,
    inProgress: 1,
    failed: 1,
  };

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
              <Link href="/use-cases" className="text-gray-300 hover:text-white transition">
                Use Cases
              </Link>
              <Link href="/" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user.displayName || user.primaryEmail?.split('@')[0] || 'Developer'}! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            You've resurrected {stats.completed} repositories so far
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Resurrections</span>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Completed</span>
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.completed}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">In Progress</span>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.inProgress}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Failed</span>
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.failed}</div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/"
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
                Explore 10+ resurrection scenarios
              </p>
            </Link>

            <div className="p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl">
              <GitBranch className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Success Rate</h3>
              <p className="text-gray-400 text-sm">
                {Math.round((stats.completed / stats.total) * 100)}% of your resurrections succeeded
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Resurrections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Resurrections</h2>
            <Link href="/history" className="text-purple-400 hover:text-purple-300 text-sm">
              View all →
            </Link>
          </div>

          <div className="space-y-4">
            {resurrections.map((resurrection, index) => (
              <motion.div
                key={resurrection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/15 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {resurrection.repoName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          resurrection.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : resurrection.status === "in_progress"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {resurrection.status === "completed"
                          ? "Completed"
                          : resurrection.status === "in_progress"
                          ? "In Progress"
                          : "Failed"}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Scenario: {resurrection.scenario} • {resurrection.createdAt}
                    </p>
                    {resurrection.status === "completed" && (
                      <div className="flex items-center space-x-4">
                        {resurrection.deployedUrl && (
                          <a
                            href={resurrection.deployedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Live App</span>
                          </a>
                        )}
                        {resurrection.prUrl && (
                          <a
                            href={resurrection.prUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                          >
                            <GitBranch className="w-4 h-4" />
                            <span>View PR</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  {resurrection.status === "completed" && (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  )}
                  {resurrection.status === "in_progress" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                  )}
                  {resurrection.status === "failed" && (
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
