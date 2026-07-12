"use client";

import { useState, useEffect, useCallback, Suspense, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Ghost, CheckCircle2, XCircle, Loader2,
  Code2, Package, GitBranch, Sparkles, ExternalLink,
  AlertTriangle, Calendar, Star, ListChecks,
} from "lucide-react";

interface DetectedIssue {
  type: string;
  severity: "high" | "medium" | "low";
  message: string;
}

interface PlanStep {
  title: string;
  description: string;
}

interface ResurrectResult {
  repo: {
    owner: string;
    name: string;
    fullName: string;
    description: string | null;
    url: string;
  };
  analysis: {
    language: string;
    framework: string;
    lastCommit: string | null;
    daysSinceLastCommit: number | null;
    dependencyCount: number;
    devDependencyCount: number;
    stars: number;
    openIssues: number;
    issues: DetectedIssue[];
  };
  plan: {
    source: string;
    steps: PlanStep[];
  };
  aiPowered: boolean;
}

const severityStyles: Record<DetectedIssue["severity"], string> = {
  high: "bg-red-500/10 border-red-500/30 text-red-300",
  medium: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
  low: "bg-white/5 border-white/10 text-gray-300",
};

function ResurrectPageInner() {
  const searchParams = useSearchParams();
  const initialRepo = searchParams.get("repo") || "";

  const [repoInput, setRepoInput] = useState(initialRepo);
  const [analyzedRepo, setAnalyzedRepo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResurrectResult | null>(null);

  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [issueUrl, setIssueUrl] = useState<string | null>(null);
  const [issueError, setIssueError] = useState<string | null>(null);

  const runAnalysis = useCallback(async (repoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIssueUrl(null);
    setIssueError(null);
    setAnalyzedRepo(repoUrl);

    try {
      const response = await fetch("/api/resurrect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.details ? `${data.error}: ${data.details}` : data.error || "Request failed");
        return;
      }

      setResult(data as ResurrectResult);
    } catch (err: any) {
      setError(err.message || "Network error — could not reach /api/resurrect");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialRepo) {
      runAnalysis(initialRepo);
    }
  }, [initialRepo, runAnalysis]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (repoInput.trim() && !isLoading) {
      runAnalysis(repoInput.trim());
    }
  };

  const createIssue = async () => {
    if (!result) return;
    setIsCreatingIssue(true);
    setIssueError(null);

    try {
      const response = await fetch("/api/create-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: analyzedRepo,
          analysis: {
            framework: result.analysis.framework,
            dependencies: result.analysis.dependencyCount,
            issues: result.analysis.issues.map((issue) => ({
              message: issue.message,
              severity: issue.severity,
              recommendation:
                result.plan.steps.find((s) =>
                  s.description.toLowerCase().includes(issue.type.replace(/-/g, " "))
                )?.title || "See resurrection plan",
            })),
            recommendations: {
              topActions: result.plan.steps.map(
                (step) => `${step.title} — ${step.description}`
              ),
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setIssueError(
          data.details ? `${data.error}: ${data.details}` : data.error || "Failed to create issue"
        );
        return;
      }

      setIssueUrl(data.issue.url);
    } catch (err: any) {
      setIssueError(err.message || "Network error — could not reach /api/create-issue");
    } finally {
      setIsCreatingIssue(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Ghost className="w-8 h-8 text-purple-400 animate-float" />
            <div>
              <h1 className="text-2xl font-bold text-white">Resurrection Plan</h1>
              <p className="text-sm text-gray-400">
                Real repo analysis + an AI plan you can turn into a GitHub issue
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Repo input */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="https://github.com/owner/repo"
              required
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
            />
            <button
              type="submit"
              disabled={isLoading || !repoInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span>{isLoading ? "Analyzing..." : "Analyze"}</span>
            </button>
          </div>
        </form>

        {/* Loading */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-10 h-10 text-purple-400" />
            </motion.div>
            <p className="mt-4 text-gray-300 font-medium">
              Analyzing {analyzedRepo}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Fetching repository data from GitHub and generating a plan…
            </p>
          </motion.div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-4"
          >
            <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Analysis failed</h3>
              <p className="text-red-300 text-sm whitespace-pre-line">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="space-y-8">
            {/* Repository card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white/5 border border-white/10 rounded-xl"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <a
                    href={result.repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-white hover:text-purple-300 transition inline-flex items-center gap-2"
                  >
                    {result.repo.fullName}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {result.repo.description && (
                    <p className="text-gray-400 text-sm mt-1">{result.repo.description}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    result.aiPowered
                      ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                      : "bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
                  }`}
                >
                  {result.plan.source}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>{result.analysis.framework}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Package className="w-4 h-4 text-purple-400" />
                  <span>
                    {result.analysis.dependencyCount} deps
                    {result.analysis.devDependencyCount > 0 &&
                      ` (+${result.analysis.devDependencyCount} dev)`}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>
                    {result.analysis.lastCommit
                      ? `Last commit ${result.analysis.daysSinceLastCommit}d ago`
                      : "No commits found"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span>{result.analysis.stars} stars</span>
                </div>
              </div>
            </motion.div>

            {/* Detected issues */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Detected Issues ({result.analysis.issues.length})
              </h2>
              {result.analysis.issues.length === 0 ? (
                <p className="text-gray-400 text-sm p-4 bg-white/5 border border-white/10 rounded-xl">
                  No issues detected from the available repository data.
                </p>
              ) : (
                <div className="space-y-3">
                  {result.analysis.issues.map((issue, idx) => (
                    <div
                      key={`${issue.type}-${idx}`}
                      className={`p-4 rounded-lg border flex items-center justify-between gap-4 ${severityStyles[issue.severity]}`}
                    >
                      <span className="text-sm">{issue.message}</span>
                      <span className="text-xs uppercase font-semibold tracking-wide opacity-70 flex-shrink-0">
                        {issue.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Resurrection plan */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-purple-400" />
                Resurrection Plan
              </h2>
              <div className="space-y-4">
                {result.plan.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    className="p-5 bg-white/5 border border-white/10 rounded-xl flex items-start space-x-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{step.title}</h3>
                      {step.description && (
                        <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Primary action: create real GitHub issue */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl"
            >
              {issueUrl ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <p className="text-white font-medium">
                      Issue created on {result.repo.fullName}
                    </p>
                  </div>
                  <a
                    href={issueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition flex items-center space-x-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>View Issue</span>
                  </a>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-semibold">Turn this plan into action</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Creates a real GitHub issue on {result.repo.fullName} containing this plan.
                    </p>
                  </div>
                  <button
                    onClick={createIssue}
                    disabled={isCreatingIssue}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center space-x-2 flex-shrink-0"
                  >
                    {isCreatingIssue ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <GitBranch className="w-5 h-5" />
                    )}
                    <span>
                      {isCreatingIssue ? "Creating issue..." : "Create GitHub issue with this plan"}
                    </span>
                  </button>
                </div>
              )}

              {issueError && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm whitespace-pre-line">{issueError}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && !result && (
          <div className="text-center py-16 text-gray-500">
            <Ghost className="w-12 h-12 mx-auto mb-4 text-purple-400/40" />
            <p>Enter a public GitHub repository URL to analyze it and generate a resurrection plan.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResurrectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      }
    >
      <ResurrectPageInner />
    </Suspense>
  );
}
