import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-helpers";
import { FiArrowLeft, FiMusic } from "react-icons/fi";
import SongCard from "@/components/song/SongCard";
import type { SearchableSong } from "@/lib/search";
import RemoveSongSection from "./RemoveSongSection";

// ---------- Types ----------

interface PlaylistDetail {
  _id: string;
  name: string;
  description?: string;
  songs: SearchableSong[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
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

// ---------- Empty State ----------

function EmptyPlaylist({ playlistName }: { playlistName: string }) {
  return (
    <div className="py-24 text-center">
      <div className="mb-4 text-4xl text-gold/40" aria-hidden="true">
        ✠
      </div>
      <p className="text-lg text-text-primary/50">ዝርዝሩ ባዶ ነው</p>
      <p className="mt-1 text-sm text-text-primary/30">
        &ldquo;{playlistName}&rdquo; has no songs yet.
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

// ---------- Page ----------

export const dynamic = "force-dynamic";

export default async function PlaylistDetailPage({ params }: PageProps) {
  const user = await requireAuth();
  const { id } = await params;
  const baseUrl = await getBaseUrl();

  let playlist: PlaylistDetail | null = null;
  try {
    const res = await fetch(`${baseUrl}/api/playlists/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      playlist = (await res.json()) as PlaylistDetail;
    }
  } catch {
    // Graceful — notFound below
  }

  if (!playlist) {
    notFound();
  }

  const songs = playlist.songs ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Back link */}
      <Link
        href="/my/playlists"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-primary/50 transition-colors hover:text-gold"
      >
        <FiArrowLeft size="16" aria-hidden="true" />
        Back to Playlists
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold">{playlist.name}</h1>
        {playlist.description && (
          <p className="mt-1 text-sm text-text-primary/60">{playlist.description}</p>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs text-text-primary/40">
          <FiMusic size="14" aria-hidden="true" />
          <span>
            {songs.length} song{songs.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Songs grid */}
      {songs.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {songs.map((song) => (
            <div key={song._id} className="relative">
              <SongCard song={song} />
              <div className="absolute right-3 top-3 z-10">
                <RemoveSongSection
                  playlistId={playlist._id}
                  songId={song._id}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyPlaylist playlistName={playlist.name} />
      )}
    </div>
  );
}
