// Last.fm API Client — Global Track & Artist Catalog (100M+ songs)
const LASTFM_BASE = "https://ws.audioscrobbler.com/2.0/";
const API_KEY = process.env.LASTFM_API_KEY!;

async function lastfmFetch(method: string, params: Record<string, string>) {
  try {
    if (!API_KEY) {
      console.warn("[Vercel Serverless LastFM Warn] LASTFM_API_KEY is not defined");
      return null;
    }
    const url = new URL(LASTFM_BASE);
    url.searchParams.set("method", method);
    url.searchParams.set("api_key", API_KEY);
    url.searchParams.set("format", "json");
    url.searchParams.set("autocorrect", "1");
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.warn(`[Vercel Serverless LastFM Warn] Last.fm API returned status: ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (data.error) {
      console.warn(`[Vercel Serverless LastFM Warn] Last.fm error response: ${data.message}`);
      return null;
    }
    return data;
  } catch (err: any) {
    console.error(`[Vercel Serverless LastFM Error] Last.fm fetch failed method=${method}:`, {
      message: err?.message,
      stack: err?.stack,
    });
    return null;
  }
}

export async function searchArtist(name: string, limit = 12) {
  const data = await lastfmFetch("artist.search", { artist: name, limit: String(limit) });
  return data?.results?.artistmatches?.artist ?? [];
}

export async function searchTrackCatalog(query: string, limit = 20, page = 1) {
  const data = await lastfmFetch("track.search", { track: query, limit: String(limit), page: String(page) });
  return data?.results?.trackmatches?.track ?? [];
}

export async function getSimilarArtists(name: string, limit = 12) {
  const data = await lastfmFetch("artist.getSimilar", { artist: name, limit: String(limit) });
  return data?.similarartists?.artist ?? [];
}

export async function getArtistInfo(name: string) {
  const data = await lastfmFetch("artist.getInfo", { artist: name });
  return data?.artist ?? null;
}

export async function getArtistTopTags(name: string) {
  const data = await lastfmFetch("artist.getTopTags", { artist: name });
  return data?.toptags?.tag ?? [];
}

export async function getArtistTopTracks(name: string, limit = 15) {
  const data = await lastfmFetch("artist.getTopTracks", { artist: name, limit: String(limit) });
  return data?.toptracks?.track ?? [];
}

export async function getTrackInfo(artist: string, track: string) {
  const data = await lastfmFetch("track.getInfo", { artist, track });
  return data?.track ?? null;
}

export async function getSimilarTracks(artist: string, track: string, limit = 10) {
  const data = await lastfmFetch("track.getSimilar", { artist, track, limit: String(limit) });
  return data?.similartracks?.track ?? [];
}

export async function getTagTopArtists(tag: string, limit = 12) {
  const data = await lastfmFetch("tag.getTopArtists", { tag, limit: String(limit) });
  return data?.topartists?.artist ?? [];
}

export async function getTagTopTracks(tag: string, limit = 15) {
  const data = await lastfmFetch("tag.getTopTracks", { tag, limit: String(limit) });
  return data?.tracks?.track ?? [];
}

export async function getChartTopArtists(limit = 20) {
  const data = await lastfmFetch("chart.getTopArtists", { limit: String(limit) });
  return data?.artists?.artist ?? [];
}

export async function getChartTopTracks(limit = 20) {
  const data = await lastfmFetch("chart.getTopTracks", { limit: String(limit) });
  return data?.tracks?.track ?? [];
}

export function getArtistImageUrl(artist: { image?: { "#text": string; size: string }[] }): string {
  if (!artist?.image) return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop";
  const images = artist.image;
  const large = images.find((i) => i.size === "extralarge") || images.find((i) => i.size === "large");
  return large?.["#text"] || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop";
}
