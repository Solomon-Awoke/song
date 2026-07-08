import { requireAuth, isAdmin } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const admin = await isAdmin();
  if (!admin) redirect("/");

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Admin navigation */}
      <header className="sticky top-0 z-40 border-b border-gold/20 bg-bg-mid/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="text-sm font-medium text-gold-light/70 hover:text-gold transition-colors"
          >
            ← ወደ መዝሙር ቤት
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/admin/moderation"
              className="text-sm font-medium text-text-primary/70 hover:text-gold transition-colors"
            >
              ግምገማ
            </Link>
            <Link
              href="/admin/import"
              className="text-sm font-medium text-text-primary/70 hover:text-gold transition-colors"
            >
              ማስመጣት
            </Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
