"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Home, Search, Compass, ListMusic, MessageCircle, User, Disc } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/playlist", label: "Playlists", icon: ListMusic },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Disc size={20} className="text-zinc-950 animate-vinyl" />
          </div>
          <div className="flex flex-col">
            <span className="font-outfit font-extrabold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
              RESONIX
            </span>
            <span className="text-[9px] text-amber-400/80 uppercase font-bold tracking-widest -mt-1 hidden sm:block">
              Global Music Discovery
            </span>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active ? "text-amber-400" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-xl bg-amber-500/10 border border-amber-500/20"
                  />
                )}
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 glass border border-white/10 hover:border-amber-500/40 rounded-xl px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-all bg-white/[0.02]"
          >
            <User size={14} className="text-amber-400" />
            <span className="hidden sm:block">My Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
