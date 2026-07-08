import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { successResponse, errorResponse, requireRole } from "@/lib/api-helpers";

// GET /api/categories/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const category = await Category.findById(id);
  if (!category) return errorResponse("Category not found", 404);
  return successResponse(category);
}

// PUT /api/categories/[id] — update (admin only)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("admin");
  if (!user) return errorResponse("Unauthorized", 403);

  const { id } = await params;
  const body = await request.json();
  await dbConnect();

  const category = await Category.findByIdAndUpdate(id, body, { new: true });
  if (!category) return errorResponse("Category not found", 404);
  return successResponse(category);
}

// DELETE /api/categories/[id] — delete (admin only)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("admin");
  if (!user) return errorResponse("Unauthorized", 403);

  const { id } = await params;
  await dbConnect();
  const category = await Category.findByIdAndDelete(id);
  if (!category) return errorResponse("Category not found", 404);
  return successResponse({ deleted: true });
}
