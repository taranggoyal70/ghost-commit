"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, AlertCircle, Clock, TrendingUp, Code } from 'lucide-react';

interface GitHubStats {
  stars: number;
  forks: number;
  issues: number;
  lastCommit: string;
  language: string;
  watchers: number;
}

export default function GitHubStatsLive({ repoUrl }: { repoUrl: string }) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!repoUrl) return;

    const fetchStats = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Extract owner and repo from URL
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
          setError('Invalid GitHub URL');
          setLoading(false);
          return;
        }

        const [, owner, repo] = match;
        const cleanRepo = repo.replace('.git', '');

        // Fetch from GitHub API
        const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`);
        
        if (!response.ok) {
          throw new Error('Repository not found');
        }

        const data = await response.json();
        
        setStats({
          stars: data.stargazers_count,
          forks: data.forks_count,
          issues: data.open_issues_count,
          lastCommit: new Date(data.pushed_at).toLocaleDateString(),
          language: data.language || 'Unknown',
          watchers: data.watchers_count,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [repoUrl]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-white/10 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const statItems = [
    { icon: Star, label: 'Stars', value: stats.stars.toLocaleString(), color: 'text-yellow-400' },
    { icon: GitFork, label: 'Forks', value: stats.forks.toLocaleString(), color: 'text-blue-400' },
    { icon: AlertCircle, label: 'Issues', value: stats.issues.toLocaleString(), color: 'text-red-400' },
    { icon: Clock, label: 'Last Commit', value: stats.lastCommit, color: 'text-green-400' },
    { icon: Code, label: 'Language', value: stats.language, color: 'text-purple-400' },
    { icon: TrendingUp, label: 'Watchers', value: stats.watchers.toLocaleString(), color: 'text-pink-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-purple-500/30 rounded-xl"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <TrendingUp className="w-6 h-6 text-purple-400" />
        <span>Live Repository Stats</span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
          >
            <div className="flex items-center space-x-2 mb-2">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm text-gray-400">{item.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{item.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
