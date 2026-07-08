import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { successResponse, errorResponse, requireRole } from "@/lib/api-helpers";

// GET /api/categories — list all (public)
export async function GET() {
  await dbConnect();
  const categories = await Category.find().sort({ order: 1 });
  return successResponse(categories);
}

// POST /api/categories — create (admin only)
export async function POST(request: Request) {
  const user = await requireRole("admin");
  if (!user) return errorResponse("Unauthorized", 403);

  const body = await request.json();
  await dbConnect();

  const category = await Category.create(body);
  return successResponse(category, 201);
}
