import { useState, useEffect } from 'react';
import { Users, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function DiscordStats() {
  const [stats, setStats] = useState<{ online: number; total: number } | null>(null);

  useEffect(() => {
    // Fetch Discord invite stats
    fetch('https://discord.com/api/v9/invites/34fqkXH6ts?with_counts=true')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.approximate_member_count === 'number') {
          setStats({
            online: data.approximate_presence_count || 0,
            total: data.approximate_member_count || 0
          });
        }
      })
      .catch(err => console.error("Failed to fetch Discord stats", err));
  }, []);

  if (!stats) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-wrap items-center justify-center gap-4 mt-8"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-white text-sm font-medium">{stats.online.toLocaleString()} متصل الآن</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <Users className="w-4 h-4 text-[#5865F2]" />
        <span className="text-white text-sm font-medium">{stats.total.toLocaleString()} عضو</span>
      </div>
    </motion.div>
  );
}
