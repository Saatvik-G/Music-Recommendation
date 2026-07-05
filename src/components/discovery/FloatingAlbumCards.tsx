"use client";
import { motion } from "motion/react";

// Floating album art cards for hero section (visible on tablet/desktop to keep mobile clean & responsive)
const FLOAT_CARDS = [
  { top: "8%", left: "3%", delay: 0, scale: 0.85, rotate: -8, gradient: "from-amber-600/40 to-rose-600/40" },
  { top: "20%", right: "3%", delay: 0.5, scale: 0.9, rotate: 6, gradient: "from-indigo-600/40 to-purple-600/40" },
  { top: "55%", left: "2%", delay: 1, scale: 0.75, rotate: -4, gradient: "from-rose-600/40 to-amber-600/40" },
  { top: "60%", right: "4%", delay: 1.5, scale: 0.8, rotate: 10, gradient: "from-emerald-600/40 to-teal-600/40" },
];

const FAKE_COVERS = [
  ["🎸", "Indie Night"],
  ["🌊", "Ocean Waves"],
  ["🎷", "Jazz Club"],
  ["🌙", "Midnight Lo-fi"],
];

export default function FloatingAlbumCards() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
      {FLOAT_CARDS.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.7, 0.5, 0.7],
            scale: card.scale,
            y: [0, -12, -6, 0],
          }}
          transition={{
            opacity: { delay: card.delay, duration: 1.5 },
            scale: { delay: card.delay, duration: 0.8 },
            y: {
              delay: card.delay,
              duration: 5 + i * 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          }}
          style={{
            position: "absolute",
            top: card.top,
            left: "left" in card ? card.left : undefined,
            right: "right" in card ? card.right : undefined,
            rotate: card.rotate,
          }}
          className="w-24 h-24 rounded-2xl glass border border-white/10 overflow-hidden shadow-2xl"
        >
          <div className={`w-full h-full bg-gradient-to-br ${card.gradient} flex flex-col items-center justify-center gap-1`}>
            <span className="text-3xl">{FAKE_COVERS[i][0]}</span>
            <span className="text-[9px] text-white/70 font-semibold text-center px-1 leading-tight">
              {FAKE_COVERS[i][1]}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Orbs / glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
