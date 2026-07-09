"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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

// ---------- Loading Spinner ----------

function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
    </div>
  );
}

// ---------- Page ----------

export default function PlaylistDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (status !== "authenticated") return;
    setIsLoading(true);
    setNotFound(false);
    setPlaylist(null);
    fetch(`/api/playlists/${params.id}`, { credentials: "include" })
      .then((res) => {
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return null;
        }
        if (!res.ok) throw new Error("Failed to fetch playlist");
        return res.json();
      })
      .then((data) => {
        if (data && !cancelled) {
          setPlaylist(data);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [status, params.id]);

  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-text-primary/50">Please log in to view your playlists.</p>
          <Link
            href="/login"
            className="inline-block rounded-lg border border-gold/30 bg-bg-mid px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (notFound || !playlist) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-text-primary/50">Playlist not found.</p>
          <Link
            href="/my/playlists"
            className="inline-block rounded-lg border border-gold/30 bg-bg-mid px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
          >
            Back to Playlists
          </Link>
        </div>
      </div>
    );
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
