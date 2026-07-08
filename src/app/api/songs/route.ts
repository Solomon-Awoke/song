import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Song from "@/models/Song";
import Category from "@/models/Category";
import { successResponse, errorResponse, paginatedResponse, getAuthUser } from "@/lib/api-helpers";

// GET /api/songs — list with filters (public)
export async function GET(request: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const includeUnapproved = searchParams.get("includeUnapproved") === "true";

  const query: any = {};

  // Filter by category slug: lookup category by slug first
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) query.category = cat._id;
    else return successResponse([]); // No matching category = no results
  }

  // Only show approved songs to non-admin users
  if (!includeUnapproved) {
    query.isApproved = true;
  }

  // Basic text search (case-insensitive regex on Amharic and English fields)
  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { titleAm: regex },
      { titleEn: regex },
      { lyricsAm: regex },
      { lyricsEn: regex },
      { tags: regex },
    ];
  }

  const total = await Song.countDocuments(query);
  const songs = await Song.find(query)
    .populate("category", "nameAm nameEn slug")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return paginatedResponse(songs, total, page, limit);
}

// POST /api/songs — create (authenticated users, auto-unapproved for non-editors)
export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const body = await request.json();
  await dbConnect();

  const role = (user as any).role;
  const isAutoApproved = role === "admin" || role === "editor";

  const song = await Song.create({
    ...body,
    createdBy: (user as any).id,
    isApproved: isAutoApproved,
  });

  return successResponse(song, 201);
}
