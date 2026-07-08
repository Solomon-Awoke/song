import dbConnect from "@/lib/db";
import User from "@/models/User";
import Song from "@/models/Song";
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

// POST /api/songs/[slug]/favorite — toggle favorite
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getAuthUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { slug } = await params;
  await dbConnect();

  const song = await Song.findOne({ slug });
  if (!song) return errorResponse("Song not found", 404);

  const userId = (user as any).id;
  const userDoc = await User.findById(userId);
  if (!userDoc) return errorResponse("User not found", 404);

  const index = userDoc.favorites.indexOf(song._id);
  if (index > -1) {
    // Remove favorite
    userDoc.favorites.splice(index, 1);
    song.likesCount = Math.max(0, (song.likesCount || 0) - 1);
  } else {
    // Add favorite
    userDoc.favorites.push(song._id);
    song.likesCount = (song.likesCount || 0) + 1;
  }

  await userDoc.save();
  await song.save();

  return successResponse({ favorited: index === -1 });
}
