# Resonix — AI-Powered Global Music Discovery Engine

Resonix is an intent-driven music discovery platform focused strictly on semantic, mood, and activity-based curation. Built to combat choice paralysis, Resonix orchestrates multiple music APIs and generative AI models concurrently to surface recommendations across all genres, eras, and languages without playback lock-in.

---

## 🛠️ Tech Stack & Justifications
- **Framework**: Next.js 16 (App Router) — Leverages React Server Components and optimized API endpoints.
- **Client State**: Zustand — Low-boilerplate, decoupled reactive stores.
- **Database & Auth**: Supabase — Cookie-based session validation and robust row-level security (RLS) PostgreSQL database.
- **AI Core**: Google Gemini 2.5 Flash API — Free tier, fast structured JSON formatting.
- **Music Catalogs**: Spotify Web API + YouTube Data API v3 + Last.fm API + MusicBrainz.

---

## 📐 Architecture Overview

```
                        [Next.js App UI (Zustand State)]
                                       │
                                (POST Request)
                                       ▼
                       [Vercel Serverless Edge Router]
                                       │
         ┌───────────────────┬─────────┴───────────┬──────────────────┐
         ▼                   ▼                     ▼                  ▼
  [Gemini 2.5 Flash]   [Spotify API]       [YouTube Music API]   [Last.fm API]
   (Vibe/Interpretation) (100M+ Catalog)      (Coke/Live Tracks)   (Popularity Tags)
         │                   │                     │                  │
         └───────────────────┴─────────┬───────────┴──────────────────┘
                                       ▼
                         [Sorted by Popularity/Vibe]
                                       │
                             (Fetch HD Cover Art)
                                       ▼
                         [Return Cache-Controlled JSON]
```

---

## ⚙️ How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Saatvik-G/Music-Recommendation.git
   cd resonix
   ```
2. Create a `.env.local` file in the root directory:
   ```env
   LASTFM_API_KEY=your_key
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key
   GEMINI_API_KEY=your_key
   SPOTIFY_CLIENT_ID=your_id
   SPOTIFY_CLIENT_SECRET=your_secret
   YOUTUBE_API_KEY=your_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

---

## 🛡️ Edge Cases & Robustness
- **LLM Latency Mitigation**: The Gemini API call runs in a `Promise.race` wrapper with a 1.8-second timeout fallback. If the LLM lags, Spotify/YouTube/Last.fm catalog results serve immediately to keep responses sub-second.
- **Hanging Connections**: Covered art requests via iTunes use a strict 800ms `AbortController` timeout, defaulting instantly to curated local category imagery.
- **Rate-Limit Safeguards**: The MusicBrainz integration has a 1.1s rate-limiting queue built on top of the fetch layer to prevent API bans.
- **API Exclusions**: `.env.local` is strictly isolated using `.gitignore`. Pushed code does not contain hardcoded keys in the commit history.
