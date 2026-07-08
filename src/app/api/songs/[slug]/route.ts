import dbConnect from "@/lib/db";
import Song from "@/models/Song";
import { successResponse, errorResponse, requireRole, getAuthUser } from "@/lib/api-helpers";

// GET /api/songs/[slug] (public)
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();

  const song = await Song.findOne({ slug }).populate("category", "nameAm nameEn slug");
  if (!song) return errorResponse("Song not found", 404);

  return successResponse(song);
}

// PUT /api/songs/[slug] — update (editor/admin only)
export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await requireRole("admin", "editor");
  if (!user) return errorResponse("Unauthorized", 403);

  const { slug } = await params;
  const body = await request.json();
  await dbConnect();

  const song = await Song.findOneAndUpdate({ slug }, body, { new: true });
  if (!song) return errorResponse("Song not found", 404);
  return successResponse(song);
}

// DELETE /api/songs/[slug] — delete (admin only)
export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await requireRole("admin");
  if (!user) return errorResponse("Unauthorized", 403);

  const { slug } = await params;
  await dbConnect();
  const song = await Song.findOneAndDelete({ slug });
  if (!song) return errorResponse("Song not found", 404);
  return successResponse({ deleted: true });
}
