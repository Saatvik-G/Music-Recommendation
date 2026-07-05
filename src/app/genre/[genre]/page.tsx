"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Music2, Users, Star, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import ListenLinks from "@/components/ui/ListenLinks";

interface GenreData {
  overview: string;
  characteristics: string[];
  popularArtists: string[];
  essentialAlbums: { title: string; artist: string; year: string; why: string }[];
  beginnerPicks: { title: string; artist: string; why: string }[];
  underratedArtists: { name: string; why: string }[];
  similarGenres: string[];
  moodProfile: string[];
}

const TABS = ["Overview", "Artists", "Albums", "Hidden Gems", "Similar"] as const;

export default function GenrePage() {
  const params = useParams();
  const genre = decodeURIComponent(params.genre as string);
  const [data, setData] = useState<GenreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Overview");

  useEffect(() => {
    fetch(`/api/genre/${encodeURIComponent(genre)}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [genre]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-outfit text-4xl sm:text-5xl font-bold text-white capitalize mb-3">{genre}</h1>
          {data?.moodProfile && (
            <div className="flex gap-2 flex-wrap">
              {data.moodProfile.map((m) => (
                <span key={m} className="text-xs px-3 py-1 rounded-full glass border border-violet-500/20 text-violet-300">{m}</span>
              ))}
            </div>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={32} className="text-violet-400 animate-spin" />
            <p className="text-white/40 text-sm">Researching {genre}…</p>
          </div>
        ) : data ? (
          <>
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === t ? "gradient-primary text-white" : "glass border border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "Overview" && (
                  <div className="space-y-6">
                    <div className="glass border border-white/8 rounded-2xl p-6">
                      <p className="text-white/70 leading-relaxed">{data.overview}</p>
                    </div>
                    <div>
                      <h3 className="font-outfit font-semibold text-white mb-3 flex items-center gap-2">
                        <Sparkles size={15} className="text-violet-400" /> Characteristics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {data.characteristics.map((c) => (
                          <span key={c} className="glass border border-white/10 text-sm text-white/60 px-3 py-1.5 rounded-xl">{c}</span>
                        ))}
                      </div>
                    </div>
                    {data.beginnerPicks && (
                      <div>
                        <h3 className="font-outfit font-semibold text-white mb-3 flex items-center gap-2">
                          <Star size={15} className="text-yellow-400" /> Start Here
                        </h3>
                        <div className="space-y-3">
                          {data.beginnerPicks.map((p) => (
                            <div key={p.title} className="glass border border-white/8 rounded-xl p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-semibold text-white text-sm">{p.title}</div>
                                  <div className="text-xs text-white/40">{p.artist}</div>
                                  <p className="text-xs text-white/50 mt-1">{p.why}</p>
                                </div>
                                <ListenLinks artist={p.artist} track={p.title} size="sm" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "Artists" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {data.popularArtists.map((a, i) => (
                      <motion.div
                        key={a}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="glass border border-white/8 rounded-xl p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                          <Users size={14} className="text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{a}</div>
                          <ListenLinks artist={a} size="sm" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === "Albums" && (
                  <div className="space-y-3">
                    {data.essentialAlbums.map((album, i) => (
                      <motion.div
                        key={album.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="glass border border-white/8 rounded-xl p-4 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                          <Music2 size={18} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white">{album.title}</div>
                          <div className="text-sm text-white/50">{album.artist} · {album.year}</div>
                          <p className="text-xs text-white/40 mt-0.5">{album.why}</p>
                        </div>
                        <ListenLinks artist={album.artist} track={album.title} size="sm" />
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === "Hidden Gems" && (
                  <div className="space-y-3">
                    {data.underratedArtists.map((a, i) => (
                      <motion.div
                        key={a.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass border border-white/8 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-white">{a.name}</div>
                            <p className="text-sm text-white/50 mt-1">{a.why}</p>
                          </div>
                          <ListenLinks artist={a.name} size="sm" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === "Similar" && (
                  <div className="flex flex-wrap gap-3">
                    {data.similarGenres.map((g) => (
                      <Link
                        key={g}
                        href={`/genre/${encodeURIComponent(g)}`}
                        className="glass border border-white/10 rounded-xl px-5 py-3 text-white/70 hover:text-white hover:border-violet-500/30 transition-all capitalize"
                      >
                        {g}
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <p className="text-white/40 text-center py-20">Could not load genre data.</p>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
