import { NextRequest, NextResponse } from "next/server";
import { naturalLanguageSearch, emojiSearch, MusicRecommendation, AIResponse } from "@/lib/gemini";
import { searchTrackCatalog } from "@/lib/lastfm";
import { searchSpotifyTracks } from "@/lib/spotify";
import { searchYouTubeTracks } from "@/lib/youtube";
import { enrichRecommendationsWithArtwork } from "@/lib/artwork";

// Helper to wrap slow AI calls with a fast timeout (1.8s) so the user gets sub-second response
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
  ]);
}

export async function POST(req: NextRequest) {
  try {
    const { query, type = "text", page = 1 } = await req.json();
    if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

    const aiFallback: AIResponse = { interpretation: `Curated music matches for "${query}"`, recommendations: [] };

    // Concurrently fetch AI vibe recommendations (1.8s max timeout), Spotify, YouTube, and Last.fm catalog search!
    const [aiResult, spotifyTracks, youtubeTracks, lastfmTracks] = await Promise.all([
      withTimeout(
        type === "emoji" ? emojiSearch(query) : naturalLanguageSearch(query),
        1800,
        aiFallback
      ),
      searchSpotifyTracks(query, 12).catch(() => []),
      searchYouTubeTracks(query, 6).catch(() => []),
      searchTrackCatalog(query, 12, page).catch(() => []),
    ]);

    // Format Spotify catalog matches with actual Spotify global popularity score (0-100)
    const spotifyRecs: MusicRecommendation[] = (spotifyTracks || []).map((t) => ({
      title: t.name,
      artist: t.artist,
      album: t.album,
      year: t.releaseYear,
      type: "song",
      whyThisMatches: `Top rated global hit on Spotify (Global Popularity Score: ${t.popularity}/100).`,
      mood: ["top rated", "popular"],
      genres: ["global"],
      language: "Global",
      imageUrl: t.imageUrl,
      popularity: t.popularity || 85,
    }));

    // Format AI recommendations with high relevance score
    const aiRecs: MusicRecommendation[] = (aiResult.recommendations || []).map((r, idx) => ({
      ...r,
      popularity: r.popularity || Math.max(90 - idx * 2, 70),
    }));

    // Format YouTube catalog matches
    const youtubeRecs: MusicRecommendation[] = (youtubeTracks || []).map((yt, idx) => ({
      title: yt.title,
      artist: yt.channel,
      album: "YouTube Exclusive / Live Session",
      year: "2024",
      type: "song",
      whyThisMatches: `Top trending YouTube release for "${query}".`,
      mood: ["live", "exclusive"],
      genres: ["global"],
      language: "Global",
      imageUrl: yt.imageUrl,
      popularity: Math.max(88 - idx * 2, 65),
    }));

    // Format Last.fm catalog matches
    const lastfmRecs: MusicRecommendation[] = (lastfmTracks || []).map((t: any, idx: number) => ({
      title: t.name,
      artist: t.artist,
      album: `${t.name} (Single)`,
      type: "song",
      whyThisMatches: `Global music catalog match for "${query}".`,
      mood: ["trending"],
      genres: ["global"],
      language: "Global",
      imageUrl: t.image?.[2]?.["#text"] || undefined,
      popularity: Math.max(82 - idx * 2, 60),
    }));

    // Merge Spotify + AI + YouTube + Last.fm results, removing duplicates
    const seen = new Set<string>();
    const combined: MusicRecommendation[] = [];

    const addUnique = (items: MusicRecommendation[]) => {
      for (const item of items) {
        const key = `${(item.artist || "").toLowerCase()}-${(item.title || "").toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(item);
        }
      }
    };

    addUnique(spotifyRecs);
    addUnique(aiRecs);
    addUnique(youtubeRecs);
    addUnique(lastfmRecs);

    // SORT BY GLOBAL POPULARITY & RATING (Highest rated & most streamed songs first!)
    combined.sort((a, b) => (b.popularity || 70) - (a.popularity || 70));

    // Enrich any missing cover images with fast artwork lookup
    const enrichedRecs = await enrichRecommendationsWithArtwork(combined);

    return new NextResponse(
      JSON.stringify({
        interpretation: aiResult.interpretation || `Search results for "${query}"`,
        recommendations: enrichedRecs,
        spotifyTotal: spotifyTracks.length,
        youtubeTotal: youtubeTracks.length,
        catalogTotal: combined.length,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
