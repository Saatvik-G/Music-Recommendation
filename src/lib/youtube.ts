// YouTube Data API v3 Client for YouTube Music, Coke Studio, Remixes & Live Tracks
const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY || "";

export interface YouTubeTrack {
  id: string;
  title: string;
  channel: string;
  imageUrl: string;
  youtubeUrl: string;
}

export async function searchYouTubeTracks(query: string, limit = 8): Promise<YouTubeTrack[]> {
  if (!YOUTUBE_KEY) return [];

  try {
    const searchQuery = `${query} official audio OR music video OR coke studio`;
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&videoCategoryCode=10&maxResults=${limit}&key=${YOUTUBE_KEY}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return [];
    const data = await res.json();
    const items = data.items || [];

    return items.map((item: any) => {
      const videoId = item.id?.videoId;
      const title = item.snippet?.title || "Track";
      const channel = item.snippet?.channelTitle || "Artist";
      const imageUrl = item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url;

      // Clean HTML entities in YouTube titles
      const cleanTitle = title
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");

      return {
        id: videoId,
        title: cleanTitle,
        channel,
        imageUrl,
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
  } catch (err) {
    console.warn("YouTube search error:", err);
    return [];
  }
}
