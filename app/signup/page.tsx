"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ghost, Mail, Lock, User, Github, Chrome, ArrowRight, Sparkles, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { app, user, isConfigured } = useAuth();
  const authAvailable = isConfigured && !!app;

  // Redirect if already signed in — in an effect, never during render
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!app) return;
    setIsLoading(true);
    setError("");

    try {
      const result = (await app.signUpWithCredential({ email, password })) as any;
      if (result && result.status === "error") {
        setError(result.error?.message || "Failed to sign up");
        setIsLoading(false);
        return;
      }
      // Best-effort: store the display name on the new account
      if (name.trim()) {
        try {
          const newUser = (await app.getUser()) as any;
          await newUser?.setDisplayName?.(name.trim());
        } catch {
          // Non-fatal — account was still created
        }
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to sign up");
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: "github" | "google") => {
    if (!app) return;
    setIsLoading(true);
    setError("");

    try {
      await app.signInWithOAuth(provider);
    } catch (err: any) {
      setError(err?.message || "Failed to sign up");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Ghost className="w-12 h-12 text-purple-400 animate-float" />
            <span className="text-3xl font-bold text-white">Ghost Commit</span>
          </Link>
          <p className="text-gray-400">Create your account and start resurrecting</p>
        </motion.div>

        {/* Sign Up Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>

          {/* Auth not configured — honest notice, no fake sign-up */}
          {!authAvailable && (
            <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/40 rounded-lg text-sm">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-purple-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-purple-100 mb-3">
                    Authentication isn&apos;t configured on this deployment. You can
                    still analyze repos without an account —
                  </p>
                  <Link
                    href="/resurrect"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze a Repo</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthSignUp("github")}
              disabled={isLoading || !authAvailable}
              className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </button>

            <button
              onClick={() => handleOAuthSignUp("google")}
              disabled={isLoading || !authAvailable}
              className="w-full px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900/50 text-gray-400">Or sign up with email</span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <fieldset disabled={!authAvailable} className="space-y-4 disabled:opacity-50">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters</p>
              </div>

              <div className="flex items-start text-sm">
                <input type="checkbox" required className="mr-2 mt-1 rounded" />
                <label className="text-gray-300">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !authAvailable}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Ghost className="w-5 h-5" />
                    </motion.div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </fieldset>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <Link href="/signin" className="text-purple-400 hover:text-purple-300 font-semibold">
              Sign in
            </Link>
          </p>
        </motion.div>

        {/* Benefits — honest, feature-based only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-3"
        >
          <div className="flex items-center space-x-3 text-gray-300">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Ghost className="w-4 h-4 text-green-400" />
            </div>
            <span>Analyze public GitHub repos</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Ghost className="w-4 h-4 text-purple-400" />
            </div>
            <span>AI-generated resurrection plans</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
              <Ghost className="w-4 h-4 text-pink-400" />
            </div>
            <span>No account required to get started</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
