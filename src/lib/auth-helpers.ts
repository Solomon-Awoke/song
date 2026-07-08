import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=" + encodeURIComponent("/my"));
  return user;
}

export async function requireRole(...roles: string[]) {
  const user = await getCurrentUser();
  if (!user || !roles.includes((user as any).role)) {
    redirect("/");
  }
  return user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return !!(user && (user as any).role === "admin");
}
