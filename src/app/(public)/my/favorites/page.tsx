"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { SearchableSong } from "@/lib/search";
import SongCard from "@/components/song/SongCard";

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

// ---------- Loading Spinner ----------

function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
    </div>
  );
}

// ---------- Page ----------

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [songs, setSongs] = useState<SearchableSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    setIsLoading(true);
    fetch("/api/favorites", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch favorites");
        return res.json();
      })
      .then((data) => {
        setSongs(data ?? []);
      })
      .catch(() => {
        setSongs([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [status]);

  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-text-primary/50">Please log in to view your favorites.</p>
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
