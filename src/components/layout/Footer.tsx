import Link from "next/link";
import { ExternalLink, Mail, Music2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">R</span>
              </div>
              <span className="font-outfit font-bold text-lg gradient-text">Resonix</span>
            </div>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              AI-powered music discovery. No streams, no ads — just the perfect song for every moment.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com/Saatvik-G/Music-Recommendation" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg glass border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all">
                <ExternalLink size={15} />
              </a>
              <a href="mailto:contact@resonix.app"
                className="p-2 rounded-lg glass border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all">
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Discover</h4>
            <ul className="space-y-2">
              {[
                { label: "Search", href: "/search" },
                { label: "Mood Discovery", href: "/discover" },
                { label: "Genre Explorer", href: "/genre/indie rock" },
                { label: "AI Playlists", href: "/playlist" },
                { label: "Music Chat", href: "/chat" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/40 hover:text-white/70 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Info</h4>
            <ul className="space-y-2">
              {[
                { label: "About", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "API", href: "#" },
                { label: "GitHub", href: "https://github.com/Saatvik-G/Music-Recommendation" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/40 hover:text-white/70 transition-colors" target={l.href.startsWith("http") ? "_blank" : undefined}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/25">© 2025 Resonix. Built with ❤️ and AI.</p>
          <p className="text-xs text-white/20">Powered by Gemini AI · Last.fm · MusicBrainz</p>
        </div>
      </div>
    </footer>
  );
}
