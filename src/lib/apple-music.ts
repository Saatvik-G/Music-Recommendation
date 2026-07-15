export interface AppleMusicSong {
  id: string;
  name: string;
  artistName: string;
  artworkUrl: string;
  url: string;
  releaseDate?: string;
}

export async function fetchAppleMusicTrending(
  country: string = "in",
  count: number = 20
): Promise<AppleMusicSong[]> {
  const cleanCountry = country.toLowerCase().trim();
  const url = `https://rss.marketingtools.apple.com/api/v2/${cleanCountry}/music/most-played/${count}/songs.json`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // Daily caching / Next.js server-side caching
    });

    if (!res.ok) {
      throw new Error(`Apple Music RSS API returned status ${res.status}`);
    }

    const data = await res.json();
    const results = data?.feed?.results || [];

    return results.map((song: any) => ({
      id: song.id,
      name: song.name,
      artistName: song.artistName,
      artworkUrl: (song.artworkUrl100 || "").replace("{w}x{h}", "300x300"),
      url: song.url || "",
      releaseDate: song.releaseDate,
    }));
  } catch (error) {
    console.error("Error fetching Apple Music trending:", error);
    return [];
  }
}
