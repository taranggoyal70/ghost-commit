"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ghost, Github, Sparkles, Zap, Code2, Search, FileText, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import TypewriterText from "./components/TypewriterText";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const { user, app } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (app) await app.signOut();
    router.push("/");
  };

  const goResurrect = () => {
    if (!repoUrl.trim()) return;
    router.push(`/resurrect?repo=${encodeURIComponent(repoUrl.trim())}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Ghost className="w-8 h-8 text-purple-400 animate-float" />
              <span className="text-2xl font-bold text-white">Ghost Commit</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/use-cases" className="text-gray-300 hover:text-white transition">
                Use Cases
              </Link>
              <a
                href="https://github.com/taranggoyal70/ghost-commit"
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                GitHub
              </a>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-purple-300">
                      👋 {user.displayName || user.primaryEmail?.split("@")[0]}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/signin" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <Ghost className="w-24 h-24 text-purple-400" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-purple-500 rounded-full blur-xl"
              />
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Analyze &amp; Revive
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 min-h-[1.2em]">
              <TypewriterText
                texts={["Dead GitHub Repos", "Abandoned Projects", "Legacy Codebases", "Outdated Apps"]}
              />
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Paste a public GitHub repo. Ghost Commit reads the real codebase, uses AI to
            build a concrete resurrection plan — outdated dependencies, breaking changes,
            missing auth — and can open a GitHub issue with the plan in one click.
          </p>

          {/* Input */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goResurrect()}
                placeholder="https://github.com/username/dead-repo"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
              />
              <button
                onClick={goResurrect}
                disabled={!repoUrl.trim()}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Zap className="w-5 h-5" />
                <span>Analyze</span>
              </button>
            </div>
            <div className="mt-6">
              <Link
                href="/use-cases"
                className="text-purple-400 hover:text-purple-300 transition text-sm font-semibold"
              >
                Or browse resurrection scenarios →
              </Link>
            </div>
          </div>

          {/* What it actually does */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              {
                icon: Search,
                title: "Real repo analysis",
                description:
                  "Reads the actual GitHub repo — language, framework, dependencies, last activity, and detected issues.",
              },
              {
                icon: Sparkles,
                title: "AI resurrection plan",
                description:
                  "GPT-4 turns the analysis into an ordered, concrete plan for modernizing the project.",
              },
              {
                icon: FileText,
                title: "One-click GitHub issue",
                description:
                  "Open a real GitHub issue containing the plan, so the work is tracked where the code lives.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition"
              >
                <feature.icon className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* How It Works */}
          <div className="mt-32">
            <h2 className="text-4xl font-bold text-white mb-16">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Paste URL", desc: "Enter any public GitHub repo" },
                { step: "2", title: "AI analyzes", desc: "Reads the real code & dependencies" },
                { step: "3", title: "Get a plan", desc: "Concrete, ordered modernization steps" },
                { step: "4", title: "Open an issue", desc: "Track the plan on the real repo" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-purple-500/50" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-32 p-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Bring a dead repo back to life
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Point it at a project you abandoned and see what it would take to revive it.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition text-lg"
            >
              <Code2 className="w-5 h-5" />
              <span>Analyze a repo</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Ghost className="w-6 h-6 text-purple-400" />
              <span className="text-white font-semibold">Ghost Commit</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <a
                href="https://github.com/taranggoyal70/ghost-commit"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 hover:text-white transition"
              >
                <Github className="w-4 h-4" />
                <span>Source</span>
              </a>
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
