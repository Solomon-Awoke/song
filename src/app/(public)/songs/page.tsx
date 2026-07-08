import { headers } from "next/headers";
import Link from "next/link";
import type { SearchableSong } from "@/lib/search";
import SongCard from "@/components/song/SongCard";

// ---------- Types ----------

interface CategoryItem {
  _id: string;
  nameAm: string;
  nameEn?: string;
  slug: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SongsResponse {
  items: SearchableSong[];
  pagination: PaginationInfo;
}

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

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

function buildQueryString(
  params: Record<string, string | undefined>,
): string {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      usp.set(key, value);
    }
  }
  return usp.toString();
}

// ---------- Filter Chips ----------

function FilterChips({
  categories,
  activeCategory,
}: {
  categories: CategoryItem[];
  activeCategory: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {/* "All" button — clears category filter */}
      <Link
        href="/songs"
        className={[
          "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150",
          !activeCategory
            ? "bg-gold text-bg-deep"
            : "bg-bg-mid text-text-primary/70 hover:bg-bg-accent hover:text-gold",
        ].join(" ")}
      >
        All
      </Link>

      {/* Category filter chips */}
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <Link
            key={cat._id}
            href={`/songs?${buildQueryString({ category: cat.slug })}`}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150",
              isActive
                ? "bg-gold text-bg-deep"
                : "bg-bg-mid text-text-primary/70 hover:bg-bg-accent hover:text-gold",
            ].join(" ")}
          >
            {cat.nameAm}
          </Link>
        );
      })}
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

// ---------- Empty State ----------

function EmptyState({ activeCategory }: { activeCategory: string }) {
  return (
    <div className="py-24 text-center">
      <div
        className="ethiopian-cross mb-4 text-3xl text-gold/40"
        aria-hidden="true"
      />
      <p className="text-lg text-text-primary/50">ምንም መዝሙር አልተገኘም</p>
      <p className="mt-1 text-sm text-text-primary/30">
        {activeCategory
          ? "No songs found in this category"
          : "No songs available yet"}
      </p>
      {activeCategory && (
        <Link
          href="/songs"
          className="mt-6 inline-block rounded-lg border border-gold/30 bg-bg-mid px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
        >
          Clear filter
        </Link>
      )}
    </div>
  );
}

// ---------- Pagination ----------

function Pagination({
  pagination,
  activeCategory,
}: {
  pagination: PaginationInfo;
  activeCategory: string;
}) {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const prevParams = buildQueryString({
    category: activeCategory || undefined,
    page: page > 1 ? String(page - 1) : undefined,
  });

  const nextParams = buildQueryString({
    category: activeCategory || undefined,
    page: page < totalPages ? String(page + 1) : undefined,
  });

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-4"
      aria-label="Song list pagination"
    >
      <Link
        href={`/songs?${prevParams}`}
        className={[
          "rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150",
          page <= 1
            ? "pointer-events-none bg-bg-mid text-text-primary/30"
            : "bg-bg-mid text-text-primary hover:bg-bg-accent hover:text-gold",
        ].join(" ")}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
      >
        ← Previous
      </Link>

      <span className="text-sm text-text-primary/50">
        Page {page} of {totalPages}
      </span>

      <Link
        href={`/songs?${nextParams}`}
        className={[
          "rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150",
          page >= totalPages
            ? "pointer-events-none bg-bg-mid text-text-primary/30"
            : "bg-bg-mid text-text-primary hover:bg-bg-accent hover:text-gold",
        ].join(" ")}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
      >
        Next →
      </Link>
    </nav>
  );
}

// ---------- Page ----------

export const dynamic = "force-dynamic";

export default async function SongsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeCategory = params.category ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const baseUrl = await getBaseUrl();

  // Fetch categories for filter chips
  let categories: CategoryItem[] = [];
  try {
    const catRes = await fetch(`${baseUrl}/api/categories`, {
      cache: "no-store",
    });
    if (catRes.ok) {
      categories = (await catRes.json()) as CategoryItem[];
    }
  } catch {
    // Graceful fallback — chips just won't render
  }

  // Fetch songs
  let songs: SearchableSong[] = [];
  let pagination: PaginationInfo = { page: 1, limit: 20, total: 0, totalPages: 0 };

  try {
    const songQuery = buildQueryString({
      category: activeCategory || undefined,
      page: String(page),
      limit: "20",
    });

    const songRes = await fetch(`${baseUrl}/api/songs?${songQuery}`, {
      cache: "no-store",
    });
    if (songRes.ok) {
      const data = (await songRes.json()) as SongsResponse;
      songs = data.items ?? [];
      pagination = data.pagination ?? pagination;
    }
  } catch {
    // Graceful fallback — empty grid
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-gold">የመዝሙራት ዝርዝር</h1>
      <p className="mb-8 text-sm text-text-primary/50">Browse Songs</p>

      <FilterChips categories={categories} activeCategory={activeCategory} />

      {songs.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-text-primary/40">
            {pagination.total} song{pagination.total !== 1 ? "s" : ""} found
          </p>
          <SongGrid songs={songs} />
        </>
      ) : (
        <EmptyState activeCategory={activeCategory} />
      )}

      <Pagination pagination={pagination} activeCategory={activeCategory} />
    </div>
  );
}
