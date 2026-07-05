import { NextRequest, NextResponse } from "next/server";
import { genreDeepDive } from "@/lib/gemini";
import { getTagTopArtists, getTagTopTracks } from "@/lib/lastfm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ genre: string }> }
) {
  try {
    const { genre } = await params;
    const decodedGenre = decodeURIComponent(genre);
    const [aiData, topArtists, topTracks] = await Promise.all([
      genreDeepDive(decodedGenre),
      getTagTopArtists(decodedGenre, 12).catch(() => []),
      getTagTopTracks(decodedGenre, 8).catch(() => []),
    ]);
    return NextResponse.json({ ...aiData, lastfmArtists: topArtists, lastfmTracks: topTracks });
  } catch (error) {
    console.error("Genre API error:", error);
    return NextResponse.json({ error: "Genre data fetch failed" }, { status: 500 });
  }
}
