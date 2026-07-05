// Deep link generators for outbound listen links (no API key needed)
export function spotifySearchLink(artist: string, track?: string): string {
  const q = track ? `${artist} ${track}` : artist;
  return `https://open.spotify.com/search/${encodeURIComponent(q)}`;
}

export function youtubeMusicLink(artist: string, track?: string): string {
  const q = track ? `${artist} ${track}` : artist;
  return `https://music.youtube.com/search?q=${encodeURIComponent(q)}`;
}

export function appleMusicLink(artist: string, track?: string): string {
  const q = track ? `${artist} ${track}` : artist;
  return `https://music.apple.com/search?term=${encodeURIComponent(q)}`;
}

export function youtubeSearchLink(artist: string, track?: string): string {
  const q = track ? `${artist} ${track} official` : `${artist} music`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}
