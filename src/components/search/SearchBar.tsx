"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Clock, X, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/store";

const PLACEHOLDER_QUERIES = [
  "best Punjabi sad songs for late night driving",
  "soulful Hindi acoustic songs like Arijit Singh",
  "songs that feel like driving at 2AM",
  "80s retro synth-pop gems",
  "something between Arctic Monkeys and Diljit Dosanjh",
  "music for deep coding in the rain",
  "warm 90s nostalgic indie pop",
  "energetic Gym workout Punjabi drill",
];

const QUICK_LANGUAGE_TAGS = [
  { label: "All Languages", query: "all global songs" },
  { label: "Punjabi 👳", query: "Punjabi hits and vibes" },
  { label: "Hindi / Bollywood 🇮🇳", query: "soulful Hindi Bollywood songs" },
  { label: "English 🎧", query: "best English indie and pop" },
  { label: "Spanish 💃", query: "Latin Spanish acoustic and reggaeton" },
  { label: "K-Pop / Asian 🌸", query: "chill K-Pop and Japanese City Pop" },
  { label: "90s Nostalgia 📻", query: "90s retro nostalgic hits" },
];

export default function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const { query, setQuery, searchType, setSearchType, history } = useSearchStore();
  const [isFocused, setIsFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER_QUERIES[0]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % PLACEHOLDER_QUERIES.length;
      setPlaceholder(PLACEHOLDER_QUERIES[i]);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
  };

  const isEmoji = (str: string) =>
    /\p{Emoji}/u.test(str) && !/[a-zA-Z0-9]/.test(str.trim());

  const handleInput = (val: string) => {
    setQuery(val);
    if (isEmoji(val)) setSearchType("emoji");
    else setSearchType("text");
  };

  const recentHistory = history.slice(0, 5);

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto space-y-3 px-1 sm:px-0">
      <motion.div
        animate={{ scale: isFocused ? 1.01 : 1 }}
        transition={{ duration: 0.2 }}
        className={`relative glass rounded-2xl border transition-all duration-300 ${
          isFocused
            ? "border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.2)] bg-[#141318]"
            : "border-white/10 hover:border-white/20 bg-[#121118]/90"
        }`}
      >
        {/* Search icon indicator */}
        <div className="absolute left-3.5 sm:left-4.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchType === "emoji" ? (
            <Sparkles size={18} className="text-amber-400" />
          ) : (
            <Search size={18} className="text-zinc-400" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={`Try "${placeholder}"`}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-white placeholder-zinc-500 text-sm sm:text-base py-3.5 sm:py-4 pl-10 sm:pl-12 pr-28 sm:pr-32 outline-none font-medium truncate"
        />

        {/* Action controls */}
        <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 sm:gap-2">
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="hidden md:flex items-center gap-0.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-400 text-xs font-mono">
            <span className="text-[10px]">⌘</span>K
          </kbd>
          <button
            onClick={() => handleSearch()}
            className="gradient-gold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-zinc-950 transition-all hover:opacity-95 hover:scale-105 shadow-md shrink-0"
          >
            Discover
          </button>
        </div>
      </motion.div>

      {/* Multilingual Quick Tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1 w-full max-w-full touch-pan-x">
        <span className="text-[10px] sm:text-[11px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Globe size={11} className="text-amber-400" /> Explore:
        </span>
        {QUICK_LANGUAGE_TAGS.map((tag) => (
          <button
            key={tag.label}
            onClick={() => handleSearch(tag.query)}
            className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full glass border border-white/10 text-zinc-300 hover:text-white hover:border-amber-500/40 hover:bg-amber-500/10 transition-all shrink-0 font-medium whitespace-nowrap"
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* History dropdown */}
      <AnimatePresence>
        {isFocused && recentHistory.length > 0 && !query && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full mt-2 w-full glass rounded-2xl border border-white/10 overflow-hidden z-50 bg-[#141318]"
          >
            <p className="text-[10px] text-zinc-500 px-4 pt-3 pb-1 uppercase font-bold tracking-wider">Recent Searches</p>
            {recentHistory.map((h, i) => (
              <button
                key={i}
                onClick={() => handleSearch(h.query)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors"
              >
                <Clock size={13} className="text-amber-400/70 flex-shrink-0" />
                <span className="text-sm text-zinc-300 truncate">{h.query}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
