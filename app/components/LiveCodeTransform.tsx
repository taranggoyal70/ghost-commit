"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

interface CodeChange {
  file: string;
  before: string;
  after: string;
  explanation: string;
}

export default function LiveCodeTransform({ isActive }: { isActive: boolean }) {
  const [currentChange, setCurrentChange] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);

  const codeChanges: CodeChange[] = [
    {
      file: 'components/Button.jsx',
      before: `import React from 'react';

class Button extends React.Component {
  render() {
    return (
      <button onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}`,
      after: `'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button {...props}>
      {children}
    </button>
  );
}`,
      explanation: 'Converting React Class Component to TypeScript Functional Component with Next.js 14'
    },
    {
      file: 'pages/index.js',
      before: `export default function Home() {
  return <div>Hello World</div>
}`,
      after: `export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Hello World</h1>
    </div>
  )
}`,
      explanation: 'Adding Tailwind CSS styling and modern layout'
    },
    {
      file: 'package.json',
      before: `{
  "dependencies": {
    "react": "^17.0.2",
    "next": "^12.0.0"
  }
}`,
      after: `{
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0"
  }
}`,
      explanation: 'Upgrading to React 18 and Next.js 14 with TypeScript'
    }
  ];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setIsTransforming(true);
      
      setTimeout(() => {
        setCurrentChange((prev) => (prev + 1) % codeChanges.length);
        setIsTransforming(false);
      }, 1500);
    }, 6000); // Slower interval for better performance

    return () => clearInterval(interval);
  }, [isActive]);

  const change = codeChanges[currentChange];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Code2 className="w-8 h-8 text-purple-400" />
            {isTransforming && (
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Live AI Transformation</h3>
            <p className="text-sm text-gray-400">{change.file}</p>
          </div>
        </div>
        
        <motion.div
          animate={{ scale: isTransforming ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 rounded-full"
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-white font-medium">
            {isTransforming ? 'Transforming...' : 'AI Active'}
          </span>
        </motion.div>
      </div>

      {/* Code Comparison */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Before */}
        <motion.div
          className="relative"
          animate={{ opacity: isTransforming ? 0.5 : 1 }}
        >
          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
            <span className="text-xs text-red-300 font-medium">BEFORE</span>
          </div>
          <pre className="bg-gray-900 border border-gray-700 rounded-lg p-6 pt-12 overflow-x-auto">
            <code className="text-sm text-gray-300 font-mono">
              {change.before}
            </code>
          </pre>
        </motion.div>

        {/* After */}
        <motion.div
          className="relative"
          animate={{ 
            opacity: isTransforming ? 1 : 1,
            scale: isTransforming ? [1, 1.02, 1] : 1
          }}
        >
          <div className="absolute top-3 left-3 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
            <span className="text-xs text-green-300 font-medium">AFTER</span>
          </div>
          <pre className="bg-gray-900 border border-green-500/30 rounded-lg p-6 pt-12 overflow-x-auto relative">
            <AnimatePresence mode="wait">
              {isTransforming && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-green-500/10 rounded-lg flex items-center justify-center"
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-6 h-6 text-green-400 animate-pulse" />
                    <span className="text-green-300 font-medium">AI Rewriting...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <code className="text-sm text-gray-300 font-mono">
              {change.after}
            </code>
          </pre>
        </motion.div>
      </div>

      {/* Explanation */}
      <motion.div
        key={currentChange}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-purple-200 font-medium mb-1">AI Explanation:</p>
            <p className="text-sm text-gray-300">{change.explanation}</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <div className="mt-6 flex justify-center space-x-2">
        {codeChanges.map((_, idx) => (
          <motion.div
            key={idx}
            className={`h-2 rounded-full ${
              idx === currentChange ? 'w-8 bg-purple-500' : 'w-2 bg-gray-600'
            }`}
            animate={{
              width: idx === currentChange ? 32 : 8,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
