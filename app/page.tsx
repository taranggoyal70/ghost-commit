"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ghost, Github, Sparkles, Zap, Code2, Rocket, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleResurrect = async () => {
    if (!repoUrl) return;
    setIsAnalyzing(true);
    // Navigate to resurrection page
    window.location.href = `/resurrect?repo=${encodeURIComponent(repoUrl)}`;
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
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/signin" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Floating Ghost Icon */}
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
            Resurrect Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Dead GitHub Repos
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            AI-powered resurrection brings your abandoned projects back to life.
            Updated dependencies, fixed breaking changes, added auth, and deployed—all automatically.
          </p>

          {/* Input Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/dead-repo"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                />
              </div>
              <button
                onClick={handleResurrect}
                disabled={!repoUrl || isAnalyzing}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Resurrect</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              ✨ Powered by Stack Auth • Free for first resurrection
            </p>
            <div className="mt-6">
              <Link
                href="/use-cases"
                className="text-purple-400 hover:text-purple-300 transition text-sm font-semibold"
              >
                Or browse 10+ resurrection scenarios →
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              {
                icon: Code2,
                title: "Auto-Update Dependencies",
                description: "Upgrades all packages to latest versions and fixes breaking changes",
              },
              {
                icon: Github,
                title: "Stack Auth Integration",
                description: "Automatically adds authentication and user management",
              },
              {
                icon: Rocket,
                title: "Deploy to Production",
                description: "Deploys your resurrected app to Vercel instantly",
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            {[
              { number: "1000+", label: "Repos Resurrected" },
              { number: "95%", label: "Success Rate" },
              { number: "< 5min", label: "Avg Time" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="mt-32">
            <h2 className="text-4xl font-bold text-white mb-16">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Paste URL", desc: "Enter your dead repo URL" },
                { step: "2", title: "AI Analyzes", desc: "Detects issues & creates plan" },
                { step: "3", title: "Auto-Fix", desc: "Updates code & adds features" },
                { step: "4", title: "Deploy", desc: "Live app in production" },
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
            transition={{ delay: 1 }}
            className="mt-32 p-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Bring Your Projects Back to Life?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of developers who've resurrected their dead repos
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition text-lg"
            >
              Start Resurrecting Now
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
            <div className="text-gray-400 text-sm">
              Built for Stack Auth (YC S24) Mini Hackathon • MIT License
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
