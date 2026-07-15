// MusicBrainz API Client — 1 req/sec rate limit, no key needed
const MB_BASE = "https://musicbrainz.org/ws/2";
const CAA_BASE = "https://coverartarchive.org";
const USER_AGENT = "Resonix/1.0 (music-discovery-app)";

let lastRequestTime = 0;

async function mbFetch(path: string, params?: Record<string, string>) {
  try {
    // Rate limit: 1 req/sec
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < 1100) {
      await new Promise((r) => setTimeout(r, 1100 - elapsed));
    }
    lastRequestTime = Date.now();

    const url = new URL(`${MB_BASE}${path}`);
    url.searchParams.set("fmt", "json");
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
      }
    }
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      console.warn(`[Vercel Serverless MB Warn] MusicBrainz API returned status: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err: any) {
    console.error(`[Vercel Serverless MB Error] MusicBrainz fetch failed path=${path}:`, {
      message: err?.message,
      stack: err?.stack,
    });
    return null;
  }
}

export async function searchMBArtist(name: string) {
  const data = await mbFetch("/artist/", { query: `artist:${name}`, limit: "5" });
  return data?.artists ?? [];
}

export async function getMBArtistById(mbid: string) {
  return mbFetch(`/artist/${mbid}`, { inc: "release-groups+url-rels+artist-rels" });
}

export async function getArtistReleaseGroups(mbid: string, limit = 10) {
  const data = await mbFetch("/release-group/", {
    artist: mbid,
    type: "album",
    limit: String(limit),
  });
  return data?.["release-groups"] ?? [];
}

export async function getReleaseGroupById(mbid: string) {
  return mbFetch(`/release-group/${mbid}`, { inc: "releases" });
}

export async function getCoverArtUrl(releaseMbid: string): Promise<string | null> {
  try {
    const res = await fetch(`${CAA_BASE}/release/${releaseMbid}/front`, {
      method: "HEAD",
      redirect: "follow",
    });
    if (res.ok) return res.url;
    return null;
  } catch {
    return null;
  }
}

export async function getCoverArtForReleaseGroup(releaseGroupMbid: string): Promise<string | null> {
  try {
    const res = await fetch(`${CAA_BASE}/release-group/${releaseGroupMbid}/front`, {
      method: "HEAD",
      redirect: "follow",
    });
    if (res.ok) return res.url;
    return null;
  } catch {
    return null;
  }
}
