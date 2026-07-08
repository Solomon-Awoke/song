import { z } from "zod";

export const createCategorySchema = z.object({
  nameAm: z.string().min(1, "Amharic name is required"),
  nameEn: z.string().optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  order: z.number().int().min(0).default(0),
  icon: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createSongSchema = z.object({
  titleAm: z.string().min(1, "Amharic title is required"),
  titleEn: z.string().optional(),
  lyricsAm: z.string().min(1, "Amharic lyrics are required"),
  lyricsEn: z.string().optional(),
  category: z.string().min(1, "Category ID is required"),
  tags: z.array(z.string()).default([]),
  author: z.string().optional(),
  biblicalRefs: z.array(z.string()).default([]),
});

export const updateSongSchema = createSongSchema.partial();
