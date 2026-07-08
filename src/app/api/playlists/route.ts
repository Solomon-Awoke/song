import dbConnect from "@/lib/db";
import Playlist from "@/models/Playlist";
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

// GET /api/playlists — list user's playlists
export async function GET() {
  const user = await getAuthUser();
  if (!user) return errorResponse("Unauthorized", 401);

  await dbConnect();
  const playlists = await Playlist.find({ owner: (user as any).id })
    .populate("songs", "titleAm titleEn slug")
    .sort({ updatedAt: -1 });

  return successResponse(playlists);
}

// POST /api/playlists — create
export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { name, description } = await request.json();
  if (!name) return errorResponse("Name is required", 400);

  await dbConnect();
  const playlist = await Playlist.create({
    name,
    description,
    owner: (user as any).id,
  });

  return successResponse(playlist, 201);
}
