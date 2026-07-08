import dbConnect from "@/lib/db";
import Song from "@/models/Song";
import Category from "@/models/Category";
import type { SearchableSong } from "./search";

export async function preloadAllSongs(): Promise<SearchableSong[]> {
  await dbConnect();
  const songs = await Song.find({ isApproved: true })
    .populate("category", "nameAm nameEn slug")
    .lean();

  return songs.map((song: any) => ({
    _id: song._id.toString(),
    titleAm: song.titleAm,
    titleEn: song.titleEn || undefined,
    lyricsAm: song.lyricsAm,
    lyricsEn: song.lyricsEn || undefined,
    tags: song.tags || [],
    slug: song.slug,
    category: song.category
      ? {
          _id: song.category._id.toString(),
          nameAm: song.category.nameAm,
          nameEn: song.category.nameEn,
          slug: song.category.slug,
        }
      : undefined,
  }));
}

export async function preloadCategories() {
  await dbConnect();
  return Category.find().sort({ order: 1 }).lean();
}
