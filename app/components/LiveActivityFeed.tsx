"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap, User } from 'lucide-react';

interface Activity {
  id: string;
  user: string;
  repo: string;
  action: string;
  time: string;
}

const sampleActivities = [
  { user: "Alex Chen", repo: "old-react-app", action: "resurrected" },
  { user: "Sarah Kim", repo: "legacy-api", action: "modernized" },
  { user: "Mike Johnson", repo: "abandoned-blog", action: "deployed" },
  { user: "Emma Davis", repo: "dead-ecommerce", action: "revived" },
  { user: "Chris Lee", repo: "outdated-dashboard", action: "upgraded" },
  { user: "Lisa Wang", repo: "broken-auth", action: "fixed" },
];

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Add initial activity
    const initial = {
      id: Date.now().toString(),
      ...sampleActivities[0],
      time: 'just now'
    };
    setActivities([initial]);

    // Add new activity every 5 seconds
    const interval = setInterval(() => {
      const randomActivity = sampleActivities[Math.floor(Math.random() * sampleActivities.length)];
      const newActivity: Activity = {
        id: Date.now().toString(),
        ...randomActivity,
        time: 'just now'
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 5));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
        <h3 className="text-lg font-bold text-white">Live Activity</h3>
        <div className="flex-1"></div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  <span className="font-semibold">{activity.user}</span>
                  {' '}{activity.action}{' '}
                  <span className="text-purple-400">{activity.repo}</span>
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
