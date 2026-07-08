import dbConnect from "@/lib/db";
import Playlist from "@/models/Playlist";
import Song from "@/models/Song";
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

// POST /api/playlists/[id]/songs — add song to playlist
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { id } = await params;
  const { songId } = await request.json();
  if (!songId) return errorResponse("songId is required", 400);

  await dbConnect();

  const playlist = await Playlist.findOne({ _id: id, owner: (user as any).id });
  if (!playlist) return errorResponse("Playlist not found", 404);

  const song = await Song.findById(songId);
  if (!song) return errorResponse("Song not found", 404);

  // Check if song already exists in playlist
  if (playlist.songs.some((s: any) => s.toString() === songId)) {
    return successResponse({ message: "Song already in playlist" });
  }

  playlist.songs.push(song._id);
  await playlist.save();

  return successResponse(playlist);
}

// DELETE /api/playlists/[id]/songs — remove song from playlist
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { id } = await params;
  const { songId } = await request.json();
  if (!songId) return errorResponse("songId is required", 400);

  await dbConnect();

  const playlist = await Playlist.findOne({ _id: id, owner: (user as any).id });
  if (!playlist) return errorResponse("Playlist not found", 404);

  const songObjectId = songId;
  const index = playlist.songs.findIndex((s: any) => s.toString() === songObjectId);
  if (index === -1) return errorResponse("Song not in playlist", 404);

  playlist.songs.splice(index, 1);
  await playlist.save();

  return successResponse(playlist);
}
