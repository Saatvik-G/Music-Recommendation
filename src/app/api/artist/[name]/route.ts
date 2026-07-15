import { NextRequest, NextResponse } from "next/server";
import { getArtistInfo, getSimilarArtists, getArtistTopTags, getArtistTopTracks } from "@/lib/lastfm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const artistName = decodeURIComponent(name);
    const [info, similar, tags, topTracks] = await Promise.all([
      getArtistInfo(artistName).catch(() => null),
      getSimilarArtists(artistName, 8).catch(() => []),
      getArtistTopTags(artistName).catch(() => []),
      getArtistTopTracks(artistName, 8).catch(() => []),
    ]);
    return NextResponse.json(
      { info, similar, tags, topTracks },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("Artist API error:", error);
    return NextResponse.json({ error: "Artist data fetch failed" }, { status: 500 });
  }
}
