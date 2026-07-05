"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import MoodSelector from "@/components/discovery/MoodSelector";
import RecommendationCard from "@/components/ui/RecommendationCard";
import type { MusicRecommendation } from "@/lib/gemini";

const COLORS = [
  { name: "Crimson", hex: "#dc2626" }, { name: "Orange", hex: "#ea580c" },
  { name: "Amber", hex: "#d97706" }, { name: "Lime", hex: "#65a30d" },
  { name: "Emerald", hex: "#059669" }, { name: "Cyan", hex: "#0891b2" },
  { name: "Indigo", hex: "#4338ca" }, { name: "Violet", hex: "#7c3aed" },
  { name: "Pink", hex: "#db2777" },
];

const WEATHERS = [
  { label: "Rainy", emoji: "🌧️" }, { label: "Sunny", emoji: "☀️" },
  { label: "Stormy", emoji: "⛈️" }, { label: "Foggy", emoji: "🌫️" },
  { label: "Snowy", emoji: "❄️" }, { label: "Cloudy", emoji: "☁️" },
  { label: "Windy", emoji: "🌬️" }, { label: "Night", emoji: "🌙" },
];

const PERSONALITIES = [
  { label: "INTJ", desc: "Architect" }, { label: "INFP", desc: "Mediator" },
  { label: "ENFP", desc: "Campaigner" }, { label: "ISTP", desc: "Virtuoso" },
  { label: "Night Owl", desc: "Late nights" }, { label: "Dreamer", desc: "Head in clouds" },
  { label: "Introvert", desc: "Solo mode" }, { label: "Explorer", desc: "Always curious" },
];

const ACTIVITIES = [
  { label: "Coding", emoji: "💻" }, { label: "Reading", emoji: "📚" },
  { label: "Running", emoji: "🏃" }, { label: "Gym", emoji: "💪" },
  { label: "Gaming", emoji: "🎮" }, { label: "Sleeping", emoji: "😴" },
  { label: "Road Trip", emoji: "🚗" }, { label: "Studying", emoji: "📖" },
  { label: "Cooking", emoji: "🍳" }, { label: "Meditating", emoji: "🧘" },
  { label: "Partying", emoji: "🎉" }, { label: "Cleaning", emoji: "🧹" },
];

const TABS = ["Mood", "Color", "Weather", "Personality", "Activity"] as const;
type Tab = typeof TABS[number];

export default function DiscoverPage() {
  const [tab, setTab] = useState<Tab>("Mood");
  const [results, setResults] = useState<MusicRecommendation[]>([]);
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState("");

  const fetchRecs = async (mode: string, value: string) => {
    setSelected(value);
    setIsLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, value }),
      });
      const data = await res.json();
      setResults(data.recommendations || []);
      setInterpretation(data.interpretation || "");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
        <div className="mb-8">
          <h1 className="font-outfit text-3xl font-bold text-white">Discover Music</h1>
          <p className="text-white/40 mt-1">Let AI guide you to the perfect sound based on your world right now</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelected(""); setResults([]); }}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t
                  ? "gradient-primary text-white"
                  : "glass border border-white/10 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mb-8">
          {tab === "Mood" && (
            <MoodSelector onSelect={(m) => fetchRecs("mood", m)} selected={selected} />
          )}

          {tab === "Color" && (
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => fetchRecs("color", c.name)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl glass border transition-all ${selected === c.name ? "border-white/40" : "border-white/10 hover:border-white/20"}`}
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }} />
                  <span className="text-sm text-white/70">{c.name}</span>
                </button>
              ))}
            </div>
          )}

          {tab === "Weather" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {WEATHERS.map((w) => (
                <button
                  key={w.label}
                  onClick={() => fetchRecs("weather", w.label)}
                  className={`glass border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${selected === w.label ? "border-violet-500/50 bg-violet-500/10" : "border-white/10 hover:border-white/20"}`}
                >
                  <span className="text-3xl">{w.emoji}</span>
                  <span className="text-sm text-white/70">{w.label}</span>
                </button>
              ))}
            </div>
          )}

          {tab === "Personality" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PERSONALITIES.map((p) => (
                <button
                  key={p.label}
                  onClick={() => fetchRecs("personality", p.label)}
                  className={`glass border rounded-xl p-4 text-left transition-all ${selected === p.label ? "border-violet-500/50 bg-violet-500/10" : "border-white/10 hover:border-white/20"}`}
                >
                  <div className="font-outfit font-bold text-white text-lg">{p.label}</div>
                  <div className="text-xs text-white/40">{p.desc}</div>
                </button>
              ))}
            </div>
          )}

          {tab === "Activity" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {ACTIVITIES.map((a) => (
                <button
                  key={a.label}
                  onClick={() => fetchRecs("activity", a.label)}
                  className={`glass border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${selected === a.label ? "border-violet-500/50 bg-violet-500/10" : "border-white/10 hover:border-white/20"}`}
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="text-xs text-white/70">{a.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {interpretation && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 mb-6 p-3 glass rounded-xl border border-violet-500/20"
          >
            <Sparkles size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-violet-200/80">{interpretation}</p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={32} className="text-violet-400 animate-spin" />
            <p className="text-white/40 text-sm">Finding music that matches your vibe…</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((rec, i) => (
                <RecommendationCard key={`${rec.title}-${i}`} rec={rec} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
