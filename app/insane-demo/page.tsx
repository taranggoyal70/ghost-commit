"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Zap, Code2, Box, Github } from 'lucide-react';
import LiveCodeTransform from '../components/LiveCodeTransform';
import Repo3DVisualization from '../components/Repo3DVisualization';
import Link from 'next/link';

export default function InsaneDemoPage() {
  const [activeDemo, setActiveDemo] = useState<'code' | '3d' | 'both'>('both');
  const [isResurrecting, setIsResurrecting] = useState(false);

  const startResurrection = () => {
    setIsResurrecting(true);
    // Auto-stop after demo
    setTimeout(() => setIsResurrecting(false), 30000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Epic Header */}
      <div className="relative overflow-hidden border-b border-purple-500/30">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        
        <nav className="relative z-10 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">Ghost Commit</span>
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
                <Link href="/use-cases" className="text-gray-300 hover:text-white transition">
                  Use Cases
                </Link>
                <Link href="/demo" className="text-gray-300 hover:text-white transition">
                  Normal Demo
                </Link>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                  Dashboard
                </Link>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-bold animate-pulse">
                  🔥 INSANE MODE
                </span>
              </div>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Rocket className="w-16 h-16 text-yellow-400" />
              </motion.div>
              <h1 className="text-6xl font-bold text-white">
                INSANE MODE
              </h1>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-16 h-16 text-purple-400" />
              </motion.div>
            </div>
            
            <p className="text-2xl text-gray-300 mb-8">
              Watch AI Transform Code in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold">REAL-TIME</span>
            </p>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={startResurrection}
                disabled={isResurrecting}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg text-lg transition disabled:opacity-50 flex items-center space-x-2"
              >
                {isResurrecting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6" />
                    </motion.div>
                    <span>RESURRECTING...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6" />
                    <span>START RESURRECTION</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Animated background - optimized */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              style={{
                left: `${(i * 8.33)}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
                y: [0, -80],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* View Toggle */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setActiveDemo('code')}
            className={`px-6 py-3 rounded-lg font-medium transition flex items-center space-x-2 ${
              activeDemo === 'code'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Code2 className="w-5 h-5" />
            <span>Live Code Transform</span>
          </button>
          <button
            onClick={() => setActiveDemo('3d')}
            className={`px-6 py-3 rounded-lg font-medium transition flex items-center space-x-2 ${
              activeDemo === '3d'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Box className="w-5 h-5" />
            <span>3D Visualization</span>
          </button>
          <button
            onClick={() => setActiveDemo('both')}
            className={`px-6 py-3 rounded-lg font-medium transition flex items-center space-x-2 ${
              activeDemo === 'both'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>BOTH (Insane!)</span>
          </button>
        </div>

        {/* Live Code Transform */}
        {(activeDemo === 'code' || activeDemo === 'both') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LiveCodeTransform isActive={isResurrecting || true} />
          </motion.div>
        )}

        {/* 3D Visualization */}
        {(activeDemo === '3d' || activeDemo === 'both') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Repo3DVisualization isActive={isResurrecting || true} />
          </motion.div>
        )}

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Files Transformed', value: '127', icon: Code2, color: 'purple' },
            { label: 'Lines Changed', value: '3,492', icon: Zap, color: 'yellow' },
            { label: 'Issues Fixed', value: '23', icon: Github, color: 'green' },
            { label: 'AI Confidence', value: '98%', icon: Sparkles, color: 'pink' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 }}
              className={`bg-gradient-to-br from-${stat.color}-600/20 to-${stat.color}-900/20 border border-${stat.color}-500/30 rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                <motion.span
                  className="text-3xl font-bold text-white"
                  animate={{ scale: isResurrecting ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: isResurrecting ? Infinity : 0 }}
                >
                  {stat.value}
                </motion.span>
              </div>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Resurrect Your Dead Repos?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            This is just a preview. The real magic happens when you connect your GitHub!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/demo"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg text-lg transition"
            >
              Try Real Demo
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-lg transition"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
