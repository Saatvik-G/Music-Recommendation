"use client";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const GENRES = [
  { name: "Indie Rock", emoji: "🎸", color: "from-orange-500/20 to-red-500/20", border: "border-orange-500/20 hover:border-orange-400/40", slug: "indie rock" },
  { name: "Jazz", emoji: "🎷", color: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/20 hover:border-amber-400/40", slug: "jazz" },
  { name: "Lo-fi", emoji: "🌙", color: "from-indigo-500/20 to-violet-500/20", border: "border-indigo-500/20 hover:border-indigo-400/40", slug: "lo-fi" },
  { name: "City Pop", emoji: "🌆", color: "from-pink-500/20 to-orange-500/20", border: "border-pink-500/20 hover:border-pink-400/40", slug: "city pop" },
  { name: "Afrobeats", emoji: "🥁", color: "from-green-500/20 to-emerald-500/20", border: "border-green-500/20 hover:border-green-400/40", slug: "afrobeats" },
  { name: "Electronic", emoji: "🎛️", color: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/20 hover:border-cyan-400/40", slug: "electronic" },
  { name: "Classical", emoji: "🎻", color: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/20 hover:border-rose-400/40", slug: "classical" },
  { name: "Hip-Hop", emoji: "🎤", color: "from-yellow-500/20 to-amber-500/20", border: "border-yellow-500/20 hover:border-yellow-400/40", slug: "hip-hop" },
  { name: "R&B / Soul", emoji: "💜", color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/20 hover:border-violet-400/40", slug: "r&b" },
  { name: "Metal", emoji: "🤘", color: "from-slate-500/20 to-gray-500/20", border: "border-slate-500/20 hover:border-slate-400/40", slug: "metal" },
  { name: "Folk", emoji: "🪕", color: "from-lime-500/20 to-green-500/20", border: "border-lime-500/20 hover:border-lime-400/40", slug: "folk" },
  { name: "K-Pop", emoji: "🌸", color: "from-fuchsia-500/20 to-pink-500/20", border: "border-fuchsia-500/20 hover:border-fuchsia-400/40", slug: "k-pop" },
];

export default function GenreGrid() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {GENRES.map((genre, i) => (
        <motion.button
          key={genre.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/genre/${encodeURIComponent(genre.slug)}`)}
          className={`glass border rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 bg-gradient-to-br ${genre.color} ${genre.border} glow-card`}
        >
          <span className="text-3xl">{genre.emoji}</span>
          <span className="text-xs font-semibold text-white/80 text-center leading-tight">{genre.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
