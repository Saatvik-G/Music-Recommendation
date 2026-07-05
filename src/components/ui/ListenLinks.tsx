"use client";
import { spotifySearchLink, youtubeMusicLink, appleMusicLink } from "@/lib/deep-links";
import { Music2, Play, Apple } from "lucide-react";

interface ListenLinksProps {
  artist: string;
  track?: string;
  size?: "sm" | "md";
}

export default function ListenLinks({ artist, track, size = "md" }: ListenLinksProps) {
  const sm = size === "sm";
  const btnClass = sm
    ? "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
    : "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <a
        href={spotifySearchLink(artist, track)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnClass} bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20 hover:bg-[#1DB954]/20`}
        title="Open in Spotify"
      >
        <Music2 size={sm ? 10 : 12} />
        Spotify
      </a>
      <a
        href={youtubeMusicLink(artist, track)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnClass} bg-[#FF0000]/10 text-[#FF6B6B] border border-[#FF0000]/20 hover:bg-[#FF0000]/20`}
        title="Open in YouTube Music"
      >
        <Play size={sm ? 10 : 12} />
        YT Music
      </a>
      <a
        href={appleMusicLink(artist, track)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnClass} bg-[#FC3C44]/10 text-[#FC3C44] border border-[#FC3C44]/20 hover:bg-[#FC3C44]/20`}
        title="Open in Apple Music"
      >
        <Apple size={sm ? 10 : 12} />
        Apple
      </a>
    </div>
  );
}
