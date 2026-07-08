import dbConnect from "@/lib/db";
import User from "@/models/User";
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

// GET /api/favorites — return current user's favorited songs with full data
export async function GET() {
  const user = await getAuthUser();
  if (!user) return errorResponse("Unauthorized", 401);

  await dbConnect();
  const userDoc = await User.findById((user as any).id).populate({
    path: "favorites",
    populate: { path: "category", select: "nameAm nameEn slug" },
  });

  if (!userDoc) return errorResponse("User not found", 404);

  return successResponse(userDoc.favorites);
}
