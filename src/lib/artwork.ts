// High-Definition Music Cover Art & Artwork Fetcher
// Optimized for sub-second responses with fast AbortController timeouts and instant caching

const ARTWORK_CACHE = new Map<string, string>();

const GENRE_CURATED_ARTWORK: Record<string, string> = {
  punjabi: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
  bollywood: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
  hindi: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
  rock: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600&auto=format&fit=crop",
  indie: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop",
  jazz: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop",
  electronic: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
  pop: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
  retro: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?q=80&w=600&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
};

export async function fetchCoverArt(artist: string, trackTitle?: string): Promise<string> {
  const cacheKey = `${artist.toLowerCase()}-${(trackTitle || "").toLowerCase()}`;
  if (ARTWORK_CACHE.has(cacheKey)) {
    return ARTWORK_CACHE.get(cacheKey)!;
  }

  // Fast iTunes API lookup with 800ms timeout so network never hangs
  try {
    const query = trackTitle ? `${artist} ${trackTitle}` : artist;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 800);

    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=${trackTitle ? "song" : "musicArtist"}&limit=1`,
      { signal: controller.signal, next: { revalidate: 86400 } }
    );
    clearTimeout(timer);
    
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results[0] && data.results[0].artworkUrl100) {
        const highResUrl = data.results[0].artworkUrl100.replace("100x100bb", "600x600bb");
        ARTWORK_CACHE.set(cacheKey, highResUrl);
        return highResUrl;
      }
    }
  } catch (err) {
    // Timeout or fetch error — fall through to fast genre image
  }

  // Fast fallback matching
  const queryLower = `${artist} ${trackTitle || ""}`.toLowerCase();
  for (const [genreKey, imgUrl] of Object.entries(GENRE_CURATED_ARTWORK)) {
    if (queryLower.includes(genreKey)) {
      ARTWORK_CACHE.set(cacheKey, imgUrl);
      return imgUrl;
    }
  }

  const defaultImg = GENRE_CURATED_ARTWORK.default;
  ARTWORK_CACHE.set(cacheKey, defaultImg);
  return defaultImg;
}

// Batch enricher for a list of music recommendations
export async function enrichRecommendationsWithArtwork<T extends { artist: string; title: string; imageUrl?: string }>(
  items: T[]
): Promise<T[]> {
  return Promise.all(
    items.map(async (item) => {
      // If item ALREADY has a valid Spotify/YouTube cover URL, return immediately without network fetch!
      if (item.imageUrl && item.imageUrl.startsWith("http") && !item.imageUrl.includes("placeholder")) {
        return item;
      }
      const artwork = await fetchCoverArt(item.artist, item.title);
      return { ...item, imageUrl: artwork };
    })
  );
}
