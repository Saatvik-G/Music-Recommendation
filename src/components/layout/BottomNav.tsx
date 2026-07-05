"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Home, Search, Compass, ListMusic, MessageCircle } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/playlist", label: "Playlists", icon: ListMusic },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-white/10 bg-[#09090b]/90 backdrop-blur-xl pb-safe">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 group py-1 px-2 rounded-xl">
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  active ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm" : "text-zinc-400 group-hover:text-white"
                }`}
              >
                <Icon size={18} />
              </motion.div>
              <span className={`text-[10px] font-semibold tracking-tight ${active ? "text-amber-400" : "text-zinc-500"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
