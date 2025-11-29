"use client";

import { motion } from 'framer-motion';
import { Shield, Zap, Users, Lock, CheckCircle2, Sparkles, Rocket, Code2, Globe, Github } from 'lucide-react';
import Link from 'next/link';

export default function StackAuthShowcase() {
  const features = [
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Built by Y Combinator S24, trusted by thousands of developers",
      benefit: "No security vulnerabilities to worry about"
    },
    {
      icon: Zap,
      title: "5-Minute Integration",
      description: "Add authentication to any project in minutes, not days",
      benefit: "Save 40+ hours of development time"
    },
    {
      icon: Users,
      title: "Multiple OAuth Providers",
      description: "Google, GitHub, Microsoft, and more out of the box",
      benefit: "Users can sign in however they prefer"
    },
    {
      icon: Lock,
      title: "Session Management",
      description: "Automatic token refresh, secure cookie storage",
      benefit: "Users stay logged in seamlessly"
    },
    {
      icon: Code2,
      title: "Developer-First API",
      description: "Clean, intuitive hooks and components",
      benefit: "Write less code, ship faster"
    },
    {
      icon: Globe,
      title: "Production Ready",
      description: "Scales from MVP to millions of users",
      benefit: "No migration needed as you grow"
    }
  ];

  const stats = [
    { number: "5 min", label: "Setup Time" },
    { number: "40+ hrs", label: "Dev Time Saved" },
    { number: "99.9%", label: "Uptime SLA" },
    { number: "1000+", label: "Apps Using It" },
  ];

  const codeExample = `import { useStackApp, useUser } from "@stackframe/stack";

export default function MyApp() {
  const app = useStackApp();
  const user = useUser();

  // That's it! Authentication is done.
  // No complex setup, no security concerns.
  
  return user ? (
    <Dashboard user={user} />
  ) : (
    <button onClick={() => app.signInWithOAuth('google')}>
      Sign in with Google
    </button>
  );
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">Stack Auth Showcase</span>
            </Link>
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-purple-300 font-semibold">Y Combinator Summer 2024</span>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6">
            Why We Chose
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Stack Auth
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            The authentication platform that saved us 40+ hours of development time
            and gave our users enterprise-grade security from day one.
          </p>

          <div className="flex justify-center space-x-4">
            <a
              href="https://stack-auth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
            >
              Visit Stack Auth →
            </a>
            <Link
              href="/resurrect-live"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition"
            >
              See It In Action
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
            >
              <div className="text-4xl font-bold text-purple-400 mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            What Stack Auth Brings to Ghost Commit
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition"
              >
                <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 mb-3">{feature.description}</p>
                <div className="flex items-start space-x-2 text-green-400 text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{feature.benefit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            This Simple. This Powerful.
          </h2>
          
          <div className="bg-black/50 border border-purple-500/30 rounded-xl p-8">
            <pre className="text-gray-300 overflow-x-auto">
              <code>{codeExample}</code>
            </pre>
          </div>
          
          <p className="text-center text-gray-400 mt-6">
            That's all it takes. No complex configuration, no security concerns, no headaches.
          </p>
        </motion.div>

        {/* Benefits for Stack Auth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            How Ghost Commit Showcases Stack Auth
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
              <Rocket className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Real-World Use Case</h3>
              <p className="text-gray-300 mb-4">
                Ghost Commit demonstrates Stack Auth in a production-ready application, showing developers exactly how to integrate it into their projects.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Complete OAuth implementation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Protected routes and session management</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>User profile and dashboard integration</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl">
              <Users className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Developer Experience</h3>
              <p className="text-gray-300 mb-4">
                Every developer who uses Ghost Commit experiences Stack Auth's seamless integration, showing them how easy authentication can be.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Instant sign-in with Google/GitHub</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Persistent sessions across visits</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Zero friction authentication</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center p-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl"
        >
          <Shield className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Add Stack Auth to Your Project?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join Ghost Commit and thousands of other apps using Stack Auth for enterprise-grade authentication in minutes.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://docs.stack-auth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
            >
              Read the Docs
            </a>
            <a
              href="https://app.stack-auth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition"
            >
              Get Started Free
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
