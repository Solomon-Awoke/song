import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function paginatedResponse(items: any[], total: number, page: number, limit: number) {
  return NextResponse.json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function getAuthUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireRole(...roles: string[]) {
  const user = await getAuthUser();
  if (!user || !roles.includes((user as any).role)) {
    return null;
  }
  return user;
}
