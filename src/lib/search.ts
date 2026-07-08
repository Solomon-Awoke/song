import Fuse, { type IFuseOptions } from "fuse.js";

export interface SearchableSong {
  _id: string;
  titleAm: string;
  titleEn?: string;
  lyricsAm: string;
  lyricsEn?: string;
  tags?: string[];
  slug: string;
  category?: {
    _id: string;
    nameAm: string;
    nameEn?: string;
    slug: string;
  };
}

export interface SearchOptions {
  query: string;
  limit?: number;
  threshold?: number;
}

const defaultOptions: IFuseOptions<SearchableSong> = {
  keys: [
    { name: "titleAm", weight: 5 },
    { name: "titleEn", weight: 5 },
    { name: "lyricsAm", weight: 3 },
    { name: "lyricsEn", weight: 3 },
    { name: "tags", weight: 2 },
  ],
  threshold: 0.4,
  distance: 100,
  ignoreLocation: true,
  minMatchCharLength: 1,
};

export function buildSongIndex(songs: SearchableSong[]): Fuse<SearchableSong> {
  return new Fuse(songs, {
    ...defaultOptions,
    keys: defaultOptions.keys,
  });
}

export function searchSongs(
  fuse: Fuse<SearchableSong>,
  query: string,
  limit: number = 20
): SearchableSong[] {
  if (!query || query.trim().length === 0) return [];

  const results = fuse.search(query.trim(), { limit });
  return results.map((r) => r.item);
}
