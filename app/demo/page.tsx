"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ghost, Search, Sparkles, AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!repoUrl) {
      setError("Please enter a GitHub URL");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch('/api/quick-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || data.message || 'Analysis failed');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze repository');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Ghost className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">Ghost Commit</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                Live Demo
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Real AI Analysis</h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300">
            See Ghost Commit analyze a real GitHub repository with AI
          </p>
          <p className="text-sm text-gray-400 mt-2">
            This actually calls GitHub API + OpenAI GPT-4 (if configured)
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8"
        >
          <label className="block text-white font-semibold mb-3">
            GitHub Repository URL
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/facebook/react"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Repository Info */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <span>Repository Analyzed</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Repository</p>
                  <p className="text-white font-semibold">{result.repository.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Language</p>
                  <p className="text-white font-semibold">{result.repository.language || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Stars</p>
                  <p className="text-white font-semibold">⭐ {result.repository.stars.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last Commit</p>
                  <p className="text-white font-semibold">
                    {result.repository.daysSinceLastCommit} days ago
                  </p>
                </div>
              </div>

              {result.repository.description && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{result.repository.description}</p>
                </div>
              )}

              {result.repository.isStale && (
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-200">
                    This repository appears stale (no commits in 6+ months)
                  </span>
                </div>
              )}
            </div>

            {/* Analysis */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Technical Analysis</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Framework</p>
                  <p className="text-white font-semibold text-lg">{result.analysis.framework}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Dependencies</p>
                  <p className="text-white font-semibold text-lg">{result.analysis.dependencies}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Dev Dependencies</p>
                  <p className="text-white font-semibold text-lg">{result.analysis.devDependencies}</p>
                </div>
              </div>

              {result.analysis.issues.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    <span>Issues Detected ({result.analysis.issues.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {result.analysis.issues.map((issue: any, idx: number) => (
                      <div key={idx} className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white font-semibold">{issue.message}</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            issue.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                            issue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{issue.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Insights */}
            {result.analysis.aiInsights && (
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <span>AI Insights (GPT-4)</span>
                </h2>
                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-white whitespace-pre-wrap">{result.analysis.aiInsights}</p>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span>Recommendations</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Priority</p>
                  <p className={`font-semibold text-lg ${
                    result.recommendations.priority === 'high' ? 'text-red-400' :
                    result.recommendations.priority === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {result.recommendations.priority.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Estimated Time</p>
                  <p className="text-white font-semibold text-lg">{result.recommendations.estimatedTime}</p>
                </div>
              </div>

              {result.recommendations.topActions.length > 0 && (
                <div>
                  <p className="text-white font-semibold mb-3">Top Actions:</p>
                  <ul className="space-y-2">
                    {result.recommendations.topActions.map((action: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-gray-300 mb-4">
                This is real analysis using GitHub API and OpenAI GPT-4!
              </p>
              <Link
                href={`/resurrect?repo=${encodeURIComponent(repoUrl)}`}
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition"
              >
                Start Full Resurrection →
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
