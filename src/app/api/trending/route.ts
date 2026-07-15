import { NextRequest, NextResponse } from "next/server";
import { getChartTopArtists } from "@/lib/lastfm";
import { fetchAppleMusicTrending } from "@/lib/apple-music";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country") || "in";
    const countStr = searchParams.get("count") || "10";
    const count = parseInt(countStr, 10) || 10;

    const [artists, appleMusicSongs] = await Promise.all([
      getChartTopArtists(10).catch(() => []),
      fetchAppleMusicTrending(country, count).catch(() => []),
    ]);

    const tracks = appleMusicSongs.map((song) => ({
      name: song.name,
      artist: {
        name: song.artistName,
      },
      image: [
        { "#text": song.artworkUrl, size: "small" },
        { "#text": song.artworkUrl, size: "medium" },
        { "#text": song.artworkUrl, size: "large" },
        { "#text": song.artworkUrl, size: "extralarge" },
      ],
      url: song.url,
    }));

    return NextResponse.json(
      { artists, tracks, fetchedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("Trending API error:", error);
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 });
  }
}

