import { headers } from "next/headers";
import Link from "next/link";
import { requireAuth } from "@/lib/auth-helpers";
import type { SearchableSong } from "@/lib/search";
import SongCard from "@/components/song/SongCard";

// ---------- Helpers ----------

async function getBaseUrl(): Promise<string> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = headersList.get("x-forwarded-proto") ?? "http";
    return `${protocol}://${host}`;
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  }
}

// ---------- Empty State ----------

function EmptyState() {
  return (
    <div className="py-24 text-center">
      <div className="mb-4 text-4xl text-gold/40" aria-hidden="true">
        ✠
      </div>
      <p className="text-lg text-text-primary/50">ምንም የተወደደ መዝሙር የለም</p>
      <p className="mt-1 text-sm text-text-primary/30">
        No favorites yet. Browse songs and ❤️ to save.
      </p>
      <Link
        href="/songs"
        className="mt-6 inline-block rounded-lg border border-gold/30 bg-bg-mid px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
      >
        Browse Songs
      </Link>
    </div>
  );
}

// ---------- Song Grid ----------

function SongGrid({ songs }: { songs: SearchableSong[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {songs.map((song) => (
        <SongCard key={song._id} song={song} />
      ))}
    </div>
  );
}

// ---------- Page ----------

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await requireAuth();
  const baseUrl = await getBaseUrl();

  let songs: SearchableSong[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/favorites`, { cache: "no-store" });
    if (res.ok) {
      songs = (await res.json()) as SearchableSong[];
    }
  } catch {
    // Graceful fallback — empty grid
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-gold">የተወደዱ መዝሙራት</h1>
      <p className="mb-8 text-sm text-text-primary/50">My Favorites</p>

      {songs.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-text-primary/40">
            {songs.length} song{songs.length !== 1 ? "s" : ""} saved
          </p>
          <SongGrid songs={songs} />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
