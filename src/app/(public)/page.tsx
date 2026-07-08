import { Suspense } from "react";
import { headers } from "next/headers";
import type { SearchableSong } from "@/lib/search";
import SongCard from "@/components/song/SongCard";
import CategoryCard from "@/components/song/CategoryCard";

// ---------- Types ----------

interface CategoryItem {
  _id: string;
  nameAm: string;
  nameEn?: string;
  slug: string;
  order: number;
  icon?: string;
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

// ---------- Hero Section ----------

function HeroSection() {
  return (
    <section className="px-4 pb-8 pt-20 text-center sm:pt-28">
      {/* Ethiopian cross decorative element */}
      <div
        className="ethiopian-cross mb-6 text-5xl sm:text-6xl"
        aria-hidden="true"
      />

      <h1 className="text-3xl font-bold leading-tight text-gold sm:text-4xl md:text-5xl lg:text-6xl">
        የኢትዮጵያ ኦርቶዶክስ ተዋህዶ ቤተ ክርስቲያን መዝሙራት
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-base text-gold-light/80 sm:text-lg md:text-xl">
        የምስጋና፣ የውዳሴና የጸሎት መዝሙራት ስብስብ
      </p>
    </section>
  );
}

// ---------- Categories Grid ----------

async function CategoriesGrid() {
  const baseUrl = await getBaseUrl();
  let categories: CategoryItem[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/categories`, {
      cache: "no-store",
    });
    if (res.ok) {
      categories = (await res.json()) as CategoryItem[];
    }
  } catch {
    // Graceful fallback — render nothing if API unavailable
  }

  // Show at most 9
  const display = categories.slice(0, 9);

  if (display.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-gold">
        የመዝሙር ዘርፎች
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {display.map((cat) => (
          <CategoryCard
            key={cat._id}
            nameAm={cat.nameAm}
            nameEn={cat.nameEn}
            slug={cat.slug}
            icon={cat.icon}
          />
        ))}
      </div>
    </section>
  );
}

function CategoriesFallback() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-gold">
        የመዝሙር ዘርፎች
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-bg-mid p-5 opacity-50"
          >
            <div className="mb-3 h-12 w-12 rounded-lg bg-gold/10" />
            <div className="mb-2 h-5 w-32 rounded bg-gold/10" />
            <div className="h-4 w-24 rounded bg-gold/10" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Recent Songs ----------

async function RecentSongs() {
  const baseUrl = await getBaseUrl();
  let songs: SearchableSong[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/songs?limit=6`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as {
        items: SearchableSong[];
        pagination: { total: number };
      };
      songs = data.items ?? [];
    }
  } catch {
    // Graceful fallback
  }

  if (songs.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-gold">
        የቅርብ ጊዜ መዝሙራት
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {songs.map((song) => (
          <SongCard key={song._id} song={song} />
        ))}
      </div>
    </section>
  );
}

function RecentSongsFallback() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-gold">
        የቅርብ ጊዜ መዝሙራት
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-bg-mid p-5 opacity-50"
          >
            <div className="mb-2 h-4 w-20 rounded bg-gold/10" />
            <div className="mb-2 h-6 w-48 rounded bg-gold/10" />
            <div className="h-4 w-36 rounded bg-gold/10" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Page ----------

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <Suspense fallback={<CategoriesFallback />}>
        <CategoriesGrid />
      </Suspense>

      <Suspense fallback={<RecentSongsFallback />}>
        <RecentSongs />
      </Suspense>
    </div>
  );
}
