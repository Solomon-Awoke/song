import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Song from "@/models/Song";
import { successResponse, errorResponse, requireRole } from "@/lib/api-helpers";
import { parsePdfToSongs } from "@/lib/pdf-importer";

// POST /api/songs/import — import songs from PDF (admin only)
export async function POST(request: NextRequest) {
  const user = await requireRole("admin");
  if (!user) return errorResponse("Unauthorized", 403);

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null;

    if (!file) return errorResponse("No PDF file provided", 400);
    if (!category) return errorResponse("Category ID is required", 400);

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return errorResponse("File must be a PDF", 400);
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const { songs, errors } = await parsePdfToSongs(buffer);

    if (songs.length === 0) {
      return successResponse({
        total: 0,
        imported: 0,
        errors: errors.length > 0 ? errors : [{ index: 0, message: "No songs could be extracted from the PDF" }],
      });
    }

    // Import songs into database
    let imported = 0;
    const importErrors: { index: number; title: string; message: string }[] = [];

    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      try {
        // Generate a unique slug by appending index if needed
        const baseSlug = song.titleAm
          .replace(/[^a-zA-Z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .toLowerCase()
          .trim() || `imported-song-${Date.now()}`;

        const existing = await Song.findOne({ slug: baseSlug });
        const slug = existing ? `${baseSlug}-${i}-${Date.now()}` : baseSlug;

        await Song.create({
          titleAm: song.titleAm,
          lyricsAm: song.lyricsAm,
          category,
          slug,
          isApproved: false,
          createdBy: (user as any).id,
        });

        imported++;
      } catch (err) {
        importErrors.push({
          index: i,
          title: song.titleAm,
          message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return successResponse({
      total: songs.length,
      imported,
      errors: [...errors, ...importErrors],
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Import failed",
      500
    );
  }
}
