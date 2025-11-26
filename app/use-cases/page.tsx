"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Ghost, Code2, Rocket, Shield, Zap, 
  RefreshCw, ArrowRight, CheckCircle2,
  Package, GitBranch, Database, Cloud
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  examples: string[];
  demoRepo: string;
  steps: string[];
}

const useCases: UseCase[] = [
  {
    id: "outdated-react",
    title: "Outdated React App",
    description: "React 16/17 → React 18/19 with all breaking changes fixed",
    icon: RefreshCw,
    color: "from-blue-600 to-cyan-600",
    examples: [
      "Old Create React App projects",
      "Class components → Hooks",
      "Legacy Redux → Redux Toolkit",
      "Webpack 4 → Webpack 5"
    ],
    demoRepo: "https://github.com/example/old-react-app",
    steps: [
      "Update React 16 → 19",
      "Convert class components to hooks",
      "Fix deprecated lifecycle methods",
      "Update React Router v5 → v6",
      "Migrate to modern build tools",
      "Add TypeScript support"
    ]
  },
  {
    id: "no-auth",
    title: "Add Authentication",
    description: "Add Stack Auth to any app - zero configuration needed",
    icon: Shield,
    color: "from-purple-600 to-pink-600",
    examples: [
      "Apps without user management",
      "Public-only applications",
      "No login/signup pages",
      "Missing protected routes"
    ],
    demoRepo: "https://github.com/example/no-auth-app",
    steps: [
      "Install Stack Auth SDK",
      "Create auth pages (login/signup)",
      "Add protected routes",
      "Implement user context",
      "Add profile management",
      "Configure OAuth providers"
    ]
  },
  {
    id: "nextjs-migration",
    title: "Next.js Migration",
    description: "Migrate from Pages Router to App Router (Next.js 13+)",
    icon: Rocket,
    color: "from-orange-600 to-red-600",
    examples: [
      "Next.js 12 → 14",
      "Pages Router → App Router",
      "getServerSideProps → Server Components",
      "API Routes → Route Handlers"
    ],
    demoRepo: "https://github.com/example/nextjs-pages",
    steps: [
      "Update Next.js to v14",
      "Create app directory",
      "Migrate pages to app router",
      "Convert to Server Components",
      "Update API routes",
      "Fix metadata and SEO"
    ]
  },
  {
    id: "add-typescript",
    title: "Add TypeScript",
    description: "Convert JavaScript project to TypeScript with full type safety",
    icon: Code2,
    color: "from-blue-600 to-indigo-600",
    examples: [
      "Pure JavaScript projects",
      "No type checking",
      "Runtime errors",
      "Poor IDE support"
    ],
    demoRepo: "https://github.com/example/js-only-app",
    steps: [
      "Install TypeScript",
      "Create tsconfig.json",
      "Rename .js → .ts/.tsx",
      "Add type definitions",
      "Fix type errors",
      "Add strict mode"
    ]
  },
  {
    id: "modernize-build",
    title: "Modernize Build Tools",
    description: "Webpack → Vite for 10x faster builds",
    icon: Zap,
    color: "from-yellow-600 to-orange-600",
    examples: [
      "Slow Webpack builds",
      "Old build configurations",
      "No HMR (Hot Module Replacement)",
      "Long development startup"
    ],
    demoRepo: "https://github.com/example/webpack-app",
    steps: [
      "Install Vite",
      "Create vite.config",
      "Update index.html",
      "Fix import paths",
      "Update scripts",
      "Test HMR"
    ]
  },
  {
    id: "add-database",
    title: "Add Database Layer",
    description: "Add Prisma ORM + PostgreSQL for data persistence",
    icon: Database,
    color: "from-green-600 to-teal-600",
    examples: [
      "Apps with no database",
      "Local storage only",
      "No data persistence",
      "Mock data everywhere"
    ],
    demoRepo: "https://github.com/example/no-db-app",
    steps: [
      "Install Prisma",
      "Create schema",
      "Set up PostgreSQL",
      "Generate client",
      "Create API endpoints",
      "Migrate data"
    ]
  },
  {
    id: "deploy-ready",
    title: "Make Deploy-Ready",
    description: "Add CI/CD, Docker, and deploy to production",
    icon: Cloud,
    color: "from-cyan-600 to-blue-600",
    examples: [
      "Never deployed projects",
      "No CI/CD pipeline",
      "No Docker setup",
      "Manual deployment"
    ],
    demoRepo: "https://github.com/example/local-only-app",
    steps: [
      "Create Dockerfile",
      "Set up GitHub Actions",
      "Configure environment variables",
      "Add health checks",
      "Deploy to Vercel/Railway",
      "Set up monitoring"
    ]
  },
  {
    id: "add-testing",
    title: "Add Testing Suite",
    description: "Add Jest, React Testing Library, and E2E tests",
    icon: CheckCircle2,
    color: "from-pink-600 to-rose-600",
    examples: [
      "Zero test coverage",
      "No testing framework",
      "Manual testing only",
      "Frequent bugs"
    ],
    demoRepo: "https://github.com/example/no-tests-app",
    steps: [
      "Install Jest + RTL",
      "Create test setup",
      "Write unit tests",
      "Add integration tests",
      "Set up E2E with Playwright",
      "Configure CI testing"
    ]
  },
  {
    id: "monorepo-migration",
    title: "Convert to Monorepo",
    description: "Migrate to Turborepo for better code organization",
    icon: GitBranch,
    color: "from-violet-600 to-purple-600",
    examples: [
      "Multiple separate repos",
      "Shared code duplication",
      "Version sync issues",
      "Complex deployments"
    ],
    demoRepo: "https://github.com/example/multi-repo",
    steps: [
      "Install Turborepo",
      "Create workspace structure",
      "Move packages",
      "Configure build pipeline",
      "Set up shared configs",
      "Update CI/CD"
    ]
  },
  {
    id: "add-ui-library",
    title: "Add Modern UI Library",
    description: "Add Tailwind CSS + shadcn/ui for beautiful components",
    icon: Package,
    color: "from-indigo-600 to-blue-600",
    examples: [
      "Plain CSS/Bootstrap",
      "Inconsistent styling",
      "No component library",
      "Poor design system"
    ],
    demoRepo: "https://github.com/example/plain-css-app",
    steps: [
      "Install Tailwind CSS",
      "Set up PostCSS",
      "Add shadcn/ui",
      "Create design tokens",
      "Migrate components",
      "Add dark mode"
    ]
  }
];

export default function UseCasesPage() {
  const router = useRouter();
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);

  const handleResurrect = (useCase: UseCase) => {
    router.push(`/resurrect?repo=${encodeURIComponent(useCase.demoRepo)}&scenario=${useCase.id}`);
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
            <Link href="/" className="text-gray-300 hover:text-white transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Choose Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Resurrection Scenario
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ghost Commit handles any type of dead project. Select your scenario and watch AI bring it back to life.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer ${
                selectedUseCase === useCase.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedUseCase(useCase.id)}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-4`}>
                <useCase.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-2">{useCase.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{useCase.description}</p>

              {/* Examples */}
              <div className="space-y-2 mb-4">
                {useCase.examples.slice(0, 3).map((example, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-400">{example}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResurrect(useCase);
                }}
                className={`w-full px-4 py-2 bg-gradient-to-r ${useCase.color} hover:opacity-90 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2`}
              >
                <span>Try This Scenario</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Steps Preview (on hover) */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity p-6 overflow-y-auto">
                <h4 className="text-lg font-semibold text-white mb-4">Resurrection Steps:</h4>
                <div className="space-y-2">
                  {useCase.steps.map((step, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-sm text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResurrect(useCase);
                  }}
                  className={`w-full mt-6 px-4 py-3 bg-gradient-to-r ${useCase.color} hover:opacity-90 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2`}
                >
                  <Zap className="w-5 h-5" />
                  <span>Resurrect Now</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 p-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't See Your Scenario?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Ghost Commit can handle ANY dead project. Paste your repo URL and let AI figure it out.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition"
          >
            <Ghost className="w-5 h-5" />
            <span>Try Custom Resurrection</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
