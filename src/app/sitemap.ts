import type { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Song from "@/models/Song";
import Category from "@/models/Category";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/songs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Song pages
  const songs = await Song.find(
    { isApproved: true },
    { slug: 1, updatedAt: 1, _id: 0 },
  )
    .sort({ updatedAt: -1 })
    .lean();

  const songRoutes: MetadataRoute.Sitemap = songs.map((song) => ({
    url: `${BASE_URL}/songs/${song.slug}`,
    lastModified: song.updatedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Category pages
  const categories = await Category.find({}, { slug: 1, updatedAt: 1, _id: 0 })
    .lean();

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/songs?category=${cat.slug}`,
    lastModified: cat.updatedAt ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...songRoutes, ...categoryRoutes];
}
