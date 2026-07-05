// Spotify Web API Client (Client Credentials Flow — keyless server side search)
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getSpotifyAccessToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET) return null;

  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  try {
    const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      next: { revalidate: 3500 },
    });

    if (!res.ok) throw new Error(`Spotify auth failed: ${res.status}`);
    const data = await res.json();
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };
    return cachedToken.token;
  } catch (err) {
    console.warn("Spotify auth error:", err);
    return null;
  }
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  releaseYear: string;
  imageUrl: string;
  spotifyUrl: string;
  popularity: number;
}

export async function searchSpotifyTracks(query: string, limit = 20): Promise<SpotifyTrack[]> {
  const token = await getSpotifyAccessToken();
  if (!token) return [];

  try {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    const items = data.tracks?.items || [];

    return items.map((t: any) => ({
      id: t.id,
      name: t.name,
      artist: t.artists?.map((a: any) => a.name).join(", ") || "Unknown Artist",
      album: t.album?.name || "Single",
      releaseYear: t.album?.release_date ? t.album.release_date.split("-")[0] : "2024",
      imageUrl: t.album?.images?.[0]?.url || "",
      spotifyUrl: t.external_urls?.spotify || `https://open.spotify.com/search/${encodeURIComponent(query)}`,
      popularity: t.popularity || 50,
    }));
  } catch (err) {
    console.warn("Spotify track search error:", err);
    return [];
  }
}
