"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ghost, CheckCircle2, Loader2, AlertCircle, 
  Github, Sparkles, Rocket, Code2, Shield, Cloud 
} from 'lucide-react';
import Link from 'next/link';
import { celebrateSuccess } from '../utils/confetti';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  details?: string;
}

export default function ResurrectLivePage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [scenario, setScenario] = useState('default');
  const [isResurrecting, setIsResurrecting] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const scenarios = [
    { id: 'outdated-react', name: 'Outdated React App', icon: Code2 },
    { id: 'no-auth', name: 'No Authentication', icon: Shield },
    { id: 'nextjs-migration', name: 'Next.js Migration', icon: Rocket },
    { id: 'default', name: 'General Modernization', icon: Sparkles },
  ];

  const handleResurrect = async () => {
    if (!repoUrl) return;

    setIsResurrecting(true);
    setError('');
    setResult(null);

    // Initialize steps
    const initialSteps: Step[] = [
      { id: '1', title: 'Analyzing Repository', description: 'Fetching repo data and dependencies', status: 'running' },
      { id: '2', title: 'Generating AI Plan', description: 'Creating transformation strategy', status: 'pending' },
      { id: '3', title: 'Applying Transformations', description: 'Updating code and dependencies', status: 'pending' },
      { id: '4', title: 'Adding Stack Auth', description: 'Integrating authentication', status: 'pending' },
      { id: '5', title: 'Creating Deployment', description: 'Setting up production deployment', status: 'pending' },
    ];

    setSteps(initialSteps);

    try {
      // Call the real API
      const response = await fetch('/api/resurrect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, scenario }),
      });

      if (!response.ok) {
        throw new Error('Resurrection failed');
      }

      const data = await response.json();

      // Update steps with real results
      const completedSteps = initialSteps.map((step, index) => ({
        ...step,
        status: 'completed' as const,
        details: data.steps[index]?.details || 'Completed successfully',
      }));

      setSteps(completedSteps);
      setResult(data.result);
      celebrateSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to resurrect repository');
      setSteps(prev => prev.map(step => 
        step.status === 'running' ? { ...step, status: 'failed' as const } : step
      ));
    } finally {
      setIsResurrecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Ghost className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">Ghost Commit</span>
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Live Repository Resurrection
          </h1>
          <p className="text-xl text-gray-300">
            Watch as AI brings your dead project back to life in real-time
          </p>
        </motion.div>

        {/* Input Section */}
        {!isResurrecting && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8"
          >
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3">
                GitHub Repository URL
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleResurrect}
                  disabled={!repoUrl}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Resurrect</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                Resurrection Scenario
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setScenario(s.id)}
                    className={`p-4 rounded-lg border-2 transition ${
                      scenario === s.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <s.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-sm text-white font-medium">{s.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-200">{error}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Progress Steps */}
        <AnimatePresence>
          {steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 mb-8"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border-2 ${
                    step.status === 'completed'
                      ? 'bg-green-500/10 border-green-500/50'
                      : step.status === 'running'
                      ? 'bg-purple-500/10 border-purple-500/50'
                      : step.status === 'failed'
                      ? 'bg-red-500/10 border-red-500/50'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {step.status === 'completed' && (
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                      )}
                      {step.status === 'running' && (
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                      )}
                      {step.status === 'failed' && (
                        <AlertCircle className="w-8 h-8 text-red-400" />
                      )}
                      {step.status === 'pending' && (
                        <div className="w-8 h-8 rounded-full border-2 border-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                      {step.details && (
                        <pre className="mt-2 text-xs text-gray-300 bg-black/30 p-3 rounded overflow-x-auto">
                          {step.details}
                        </pre>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl p-8"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Resurrection Complete!
              </h2>
              <p className="text-gray-300">
                Your project has been successfully brought back to life
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Transformations Applied</h3>
                <ul className="space-y-2">
                  {result.transformations?.map((t: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Next Steps</h3>
                <div className="space-y-3">
                  <a
                    href={result.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition"
                  >
                    <Github className="w-5 h-5" />
                    <span>View Pull Request</span>
                  </a>
                  <a
                    href={result.deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition"
                  >
                    <Cloud className="w-5 h-5" />
                    <span>View Deployment</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setSteps([]);
                  setResult(null);
                  setRepoUrl('');
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                Resurrect Another Project
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
