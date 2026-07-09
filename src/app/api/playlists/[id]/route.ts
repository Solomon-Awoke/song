import dbConnect from "@/lib/db";
import Playlist from "@/models/Playlist";
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

// GET /api/playlists/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { id } = await params;
  await dbConnect();

  const playlist = await Playlist.findOne({ _id: id, owner: (user as any).id })
    .populate("songs", "titleAm titleEn slug lyricsAm lyricsEn category")
    .lean();

  if (!playlist) return errorResponse("Playlist not found", 404);
  return successResponse(playlist);
}

// PUT /api/playlists/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { id } = await params;
  const body = await request.json();
  await dbConnect();

  const playlist = await Playlist.findOneAndUpdate(
    { _id: id, owner: (user as any).id },
    body,
    { new: true }
  );

  if (!playlist) return errorResponse("Playlist not found", 404);
  return successResponse(playlist);
}

// DELETE /api/playlists/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { id } = await params;
  await dbConnect();

  const playlist = await Playlist.findOneAndDelete({
    _id: id,
    owner: (user as any).id,
  });

  if (!playlist) return errorResponse("Playlist not found", 404);
  return successResponse({ deleted: true });
}
