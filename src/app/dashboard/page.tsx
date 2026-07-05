"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Music2, ListMusic, Clock, LogOut, User } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const QUICK_ACTIONS = [
  { label: "Discover Music", icon: Sparkles, href: "/discover", gradient: "from-violet-600/20 to-indigo-600/20", border: "border-violet-500/20" },
  { label: "AI Playlists", icon: ListMusic, href: "/playlist", gradient: "from-cyan-600/20 to-blue-600/20", border: "border-cyan-500/20" },
  { label: "Music Chat", icon: Music2, href: "/chat", gradient: "from-pink-600/20 to-violet-600/20", border: "border-pink-500/20" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/auth"); return; }
      setUser(user);
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const displayName = user?.email?.split("@")[0] || "Music Lover";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-white/8 rounded-3xl p-6 sm:p-8 mb-8 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/5 rounded-full blur-2xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="font-outfit text-2xl font-bold text-white">Hey, {displayName} 👋</h1>
                  <p className="text-sm text-white/40">{user?.email}</p>
                </div>
              </div>
              <p className="text-white/50 text-sm">Welcome to your Resonix dashboard. Discover, save, and explore music.</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 glass border border-white/10 rounded-xl text-white/40 hover:text-red-400 hover:border-red-500/20 transition-all text-xs flex-shrink-0"
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={action.href}
                  className={`block glass border ${action.border} rounded-2xl p-5 bg-gradient-to-br ${action.gradient} hover:scale-[1.02] transition-all duration-200 glow-card`}
                >
                  <Icon size={24} className="text-white mb-3" />
                  <h3 className="font-outfit font-semibold text-white">{action.label}</h3>
                  <p className="text-xs text-white/40 mt-0.5">Start discovering →</p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Recent discovery placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-outfit text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={16} className="text-white/40" /> Recently Discovered
          </h2>
          <div className="glass border border-white/8 rounded-2xl p-8 text-center">
            <Sparkles size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Start discovering music to build your history</p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 mt-4 gradient-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
            >
              <Sparkles size={14} /> Discover Now
            </Link>
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
