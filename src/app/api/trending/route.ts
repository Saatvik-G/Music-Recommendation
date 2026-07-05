import { NextResponse } from "next/server";
import { getChartTopArtists, getChartTopTracks } from "@/lib/lastfm";

export async function GET() {
  try {
    const [artists, tracks] = await Promise.all([
      getChartTopArtists(10),
      getChartTopTracks(10),
    ]);
    return NextResponse.json({ artists, tracks }, { headers: { "Cache-Control": "s-maxage=3600" } });
  } catch (error) {
    console.error("Trending API error:", error);
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 });
  }
}
