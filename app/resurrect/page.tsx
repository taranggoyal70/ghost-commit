"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ghost, CheckCircle2, XCircle, Loader2, 
  Code2, Package, Shield, Rocket, GitBranch,
  Sparkles, Zap, ExternalLink
} from "lucide-react";

interface ResurrectionStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  icon: any;
  details?: string;
}

export default function ResurrectPage() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repo") || "";
  
  const [isResurrecting, setIsResurrecting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [githubPrUrl, setGithubPrUrl] = useState("");
  
  const [steps, setSteps] = useState<ResurrectionStep[]>([
    {
      id: "analyze",
      title: "Analyzing Repository",
      description: "Cloning and analyzing codebase structure",
      status: "pending",
      icon: Code2,
    },
    {
      id: "dependencies",
      title: "Updating Dependencies",
      description: "Upgrading packages to latest versions",
      status: "pending",
      icon: Package,
    },
    {
      id: "breaking",
      title: "Fixing Breaking Changes",
      description: "AI-powered code transformation",
      status: "pending",
      icon: Zap,
    },
    {
      id: "auth",
      title: "Adding Stack Auth",
      description: "Integrating authentication system",
      status: "pending",
      icon: Shield,
    },
    {
      id: "deploy",
      title: "Deploying to Production",
      description: "Deploying to Vercel",
      status: "pending",
      icon: Rocket,
    },
    {
      id: "pr",
      title: "Creating Pull Request",
      description: "Generating PR with all changes",
      status: "pending",
      icon: GitBranch,
    },
  ]);

  const startResurrection = async () => {
    setIsResurrecting(true);
    
    // Simulate resurrection process
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // Update step to running
      setSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: "running" } : step
      ));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      // Update step to completed
      setSteps(prev => prev.map((step, idx) => 
        idx === i ? { 
          ...step, 
          status: "completed",
          details: getStepDetails(step.id)
        } : step
      ));
    }
    
    // Set deployed URL
    setDeployedUrl(`https://${repoUrl.split('/').pop()}-resurrected.vercel.app`);
    setGithubPrUrl(`${repoUrl}/pull/1`);
    setIsResurrecting(false);
  };

  const getStepDetails = (stepId: string): string => {
    const details: Record<string, string> = {
      analyze: "✓ Detected Next.js 12 project\n✓ Found 47 outdated dependencies\n✓ Identified 12 breaking changes",
      dependencies: "✓ Updated React 17 → 19\n✓ Updated Next.js 12 → 15\n✓ Updated 45 other packages",
      breaking: "✓ Fixed 12 API changes\n✓ Updated deprecated hooks\n✓ Migrated to App Router",
      auth: "✓ Installed Stack Auth SDK\n✓ Created auth pages\n✓ Added protected routes",
      deploy: "✓ Built successfully\n✓ Deployed to Vercel\n✓ Custom domain configured",
      pr: "✓ Created comprehensive PR\n✓ Added migration guide\n✓ Documented all changes",
    };
    return details[stepId] || "";
  };

  useEffect(() => {
    if (repoUrl) {
      startResurrection();
    }
  }, [repoUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Ghost className="w-8 h-8 text-purple-400 animate-float" />
              <div>
                <h1 className="text-2xl font-bold text-white">Resurrecting Repository</h1>
                <p className="text-sm text-gray-400 truncate max-w-md">{repoUrl}</p>
              </div>
            </div>
            {deployedUrl && (
              <a
                href={deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition flex items-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>View Live App</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Overview */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {isResurrecting ? "Resurrection in Progress..." : "Resurrection Complete! 🎉"}
            </h2>
            <div className="text-purple-400 font-semibold">
              {currentStep + 1} / {steps.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border transition-all ${
                step.status === "completed"
                  ? "bg-green-500/10 border-green-500/30"
                  : step.status === "running"
                  ? "bg-purple-500/10 border-purple-500/30 shadow-lg shadow-purple-500/20"
                  : step.status === "failed"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${
                  step.status === "completed"
                    ? "bg-green-500/20"
                    : step.status === "running"
                    ? "bg-purple-500/20"
                    : "bg-gray-500/20"
                }`}>
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : step.status === "running" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-6 h-6 text-purple-400" />
                    </motion.div>
                  ) : step.status === "failed" ? (
                    <XCircle className="w-6 h-6 text-red-400" />
                  ) : (
                    <step.icon className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    {step.status === "running" && (
                      <div className="flex items-center space-x-2 text-purple-400 text-sm">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span>Processing...</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{step.description}</p>
                  
                  {/* Details */}
                  <AnimatePresence>
                    {step.details && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-3 bg-black/30 rounded-lg"
                      >
                        <pre className="text-xs text-green-400 font-mono whitespace-pre-line">
                          {step.details}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Card */}
        {!isResurrecting && deployedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                🎉 Repository Resurrected Successfully!
              </h2>
              <p className="text-gray-300 mb-8">
                Your dead project is now alive and deployed to production
              </p>

              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <a
                  href={deployedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
                >
                  <Rocket className="w-5 h-5" />
                  <span>View Live App</span>
                </a>
                <a
                  href={githubPrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
                >
                  <GitBranch className="w-5 h-5" />
                  <span>View Pull Request</span>
                </a>
              </div>

              <div className="mt-8 p-4 bg-black/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Share your resurrection:</p>
                <div className="flex items-center justify-center space-x-2">
                  <code className="px-3 py-2 bg-black/50 rounded text-purple-400 text-sm">
                    {deployedUrl}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(deployedUrl)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
