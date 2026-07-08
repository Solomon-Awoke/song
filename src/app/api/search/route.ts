import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Song from "@/models/Song";
import { successResponse, errorResponse } from "@/lib/api-helpers";

// This is an optional server-side search fallback
// Primary search is client-side via Fuse.js
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return errorResponse("Query parameter 'q' is required", 400);
  }

  await dbConnect();

  const regex = new RegExp(query, "i");
  const songs = await Song.find({
    isApproved: true,
    $or: [
      { titleAm: regex },
      { titleEn: regex },
      { lyricsAm: regex },
      { lyricsEn: regex },
      { tags: regex },
    ],
  })
    .populate("category", "nameAm nameEn slug")
    .limit(20)
    .lean();

  return successResponse(songs);
}
