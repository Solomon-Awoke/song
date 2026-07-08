import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import LyricsDisplay from "@/components/song/LyricsDisplay";
import ShareButton from "@/components/song/ShareButton";
import ToastProvider from "@/components/ui/Toast";

// ---------- Types ----------

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface SongData {
  titleAm: string;
  titleEn?: string;
  lyricsAm: string;
  lyricsEn?: string;
  slug: string;
  author?: string;
  biblicalRefs?: string[];
  category?: { nameAm?: string; nameEn?: string; slug?: string };
}

// ---------- Helpers ----------

async function getBaseUrl(): Promise<string> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = headersList.get("x-forwarded-proto") ?? "http";
    return `${protocol}://${host}`;
  } catch {
    return "http://localhost:3000";
  }
}

async function fetchSong(slug: string): Promise<SongData | null> {
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/songs/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as SongData;
  } catch {
    return null;
  }
}

// ---------- Metadata ----------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = await fetchSong(slug);

  if (!song) {
    return {
      title: "Song Not Found — መዝሙር አልተገኘም",
      description:
        "The requested song could not be found. / የተጠየቀው መዝሙር አልተገኘም።",
    };
  }

  const description =
    song.lyricsAm
      ?.replace(/[\[\]]/g, "")
      .split("\n")
      .filter(Boolean)
      .slice(0, 2)
      .join(" • ")
      .slice(0, 100) ?? "";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const songUrl = `${baseUrl}/songs/${slug}`;

  const openGraph = {
    title: song.titleAm,
    description,
    url: songUrl,
    siteName: "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን መንፈሳዊ መዝሙራት",
    type: "music.song" as const,
  };

  return {
    title: song.titleAm,
    description,
    openGraph,
    twitter: {
      card: "summary",
      title: song.titleAm,
      description,
    },
    alternates: {
      canonical: songUrl,
    },
  };
}

// ---------- Loading State ----------

function SongLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6 text-center">
        <div className="mx-auto h-6 w-6 rounded-full bg-gold/20" />
        <div className="mx-auto h-8 w-64 rounded-md bg-gold/10" />
        <div className="mx-auto h-5 w-48 rounded-md bg-gold/10" />
        <div className="mx-auto mt-8 h-px w-24 bg-gold/10" />
        <div className="mx-auto mt-8 h-96 max-w-4xl rounded-xl border border-gold/5 bg-bg-mid/20 p-8">
          <div className="space-y-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 rounded bg-gold/10 ${
                  i % 3 === 0 ? "w-3/4" : i % 3 === 1 ? "w-full" : "w-5/6"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Not Found ----------

function SongNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-4xl text-gold/40" aria-hidden="true">
        ✠
      </div>
      <h1 className="font-sans mb-3 text-2xl font-bold text-gold">
        መዝሙር አልተገኘም
      </h1>
      <p className="font-serif mb-2 text-lg italic text-text-primary/60">
        Song not found
      </p>
      <p className="max-w-md text-sm leading-relaxed text-text-primary/40">
        The song you&apos;re looking for might have been removed, renamed, or
        does not exist. / የሚፈልጉት መዝሙር ተወግዶ፣ ተሰይሞ ወይም የለም ሊሆን ይችላል።
      </p>
      <a
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-bg-mid px-5 py-2.5 text-sm font-medium text-gold transition-all duration-150 hover:bg-gold/10 hover:border-gold/50"
      >
        ← Back to Home
      </a>
    </div>
  );
}

// ---------- JSON-LD Structured Data ----------

function SongJsonLd({
  song,
  songUrl,
}: {
  song: SongData;
  songUrl: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: song.titleAm,
    ...(song.titleEn && { alternateName: song.titleEn }),
    description: song.lyricsAm
      .replace(/[\[\]]/g, "")
      .split("\n")
      .filter(Boolean)
      .slice(0, 2)
      .join(" • ")
      .slice(0, 160),
    url: songUrl,
    ...(song.author && { byArtist: { "@type": "MusicGroup", name: song.author } }),
    ...(song.category?.nameAm && {
      genre: song.category.nameAm,
    }),
    inLanguage: ["am", "en"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ---------- Content Fetcher ----------

async function SongContent({ slug }: { slug: string }) {
  const song = await fetchSong(slug);

  if (!song) {
    return <SongNotFound />;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const songUrl = `${baseUrl}/songs/${slug}`;

  return (
    <>
      <SongJsonLd song={song} songUrl={songUrl} />

      <ToastProvider>
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end">
            <ShareButton
              url={songUrl}
              titleAm={song.titleAm}
              titleEn={song.titleEn}
            />
          </div>
        </div>
        <LyricsDisplay
          lyricsAm={song.lyricsAm}
          lyricsEn={song.lyricsEn}
          titleAm={song.titleAm}
          titleEn={song.titleEn}
        />
      </ToastProvider>
    </>
  );
}

// ---------- Page ----------

export default async function SongPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<SongLoading />}>
      <SongContent slug={slug} />
    </Suspense>
  );
}


