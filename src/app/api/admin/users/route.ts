import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Song from "@/models/Song";
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

const VALID_ROLES = ["viewer", "contributor", "editor", "admin"] as const;

function isAdmin(user: NonNullable<Awaited<ReturnType<typeof getAuthUser>>>) {
  return (user as any).role === "admin";
}

// GET /api/admin/users — list all users with song counts
export async function GET() {
  await dbConnect();

  const user = await getAuthUser();
  if (!user || !isAdmin(user)) {
    return errorResponse("Forbidden", 403);
  }

  const users = await User.find({})
    .select("name email role createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const songCounts = await Song.aggregate([
    { $group: { _id: "$createdBy", count: { $sum: 1 } } },
  ]);

  const countMap = new Map<string, number>();
  for (const entry of songCounts) {
    if (entry._id) {
      countMap.set(entry._id.toString(), entry.count);
    }
  }

  const result = users.map((u: any) => ({
    _id: u._id.toString(),
    name: u.name ?? "",
    email: u.email ?? "",
    role: u.role,
    createdAt: u.createdAt,
    songCount: countMap.get(u._id.toString()) ?? 0,
  }));

  return successResponse(result);
}

// PUT /api/admin/users — update user role
export async function PUT(request: NextRequest) {
  await dbConnect();

  const user = await getAuthUser();
  if (!user || !isAdmin(user)) {
    return errorResponse("Forbidden", 403);
  }

  const body = await request.json();
  const { userId, role } = body;

  if (!userId || !role) {
    return errorResponse("userId and role are required", 400);
  }

  if (!VALID_ROLES.includes(role)) {
    return errorResponse(
      `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
      400
    );
  }

  const targetUser = await User.findById(userId);
  if (!targetUser) {
    return errorResponse("User not found", 404);
  }

  const currentRole = targetUser.role as string;

  // Prevent demoting the last admin
  if (currentRole === "admin" && role !== "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return errorResponse("Cannot demote the last admin", 400);
    }
  }

  targetUser.role = role;
  await targetUser.save();

  return successResponse({
    _id: targetUser._id.toString(),
    name: targetUser.name ?? "",
    email: targetUser.email ?? "",
    role: targetUser.role,
    createdAt: targetUser.createdAt,
  });
}
