"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface SongItem {
  _id: string;
  titleAm: string;
  titleEn?: string;
  lyricsAm: string;
  slug: string;
  createdAt: string;
  createdBy?: { _id: string; name?: string; email?: string } | string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type ActionState = "idle" | "approving" | "rejecting";

export default function ModerationPage() {
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState>("idle");
  const [actionSongId, setActionSongId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/songs?includeUnapproved=true&limit=50");
      if (!res.ok) throw new Error("Failed to fetch songs");

      const data = await res.json();
      const items = Array.isArray(data) ? data : data?.items ?? [];
      setSongs(items);
      setPagination(data?.pagination ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleApprove = async (song: SongItem) => {
    setActionState("approving");
    setActionSongId(song._id);

    try {
      const res = await fetch(`/api/songs/${song.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });

      if (!res.ok) throw new Error("Failed to approve song");

      // Remove from pending list
      setSongs((prev) => prev.filter((s) => s._id !== song._id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setActionState("idle");
      setActionSongId(null);
    }
  };

  const handleReject = async (song: SongItem) => {
    if (!confirm(`Are you sure you want to delete "${song.titleAm}"?`)) return;

    setActionState("rejecting");
    setActionSongId(song._id);

    try {
      const res = await fetch(`/api/songs/${song.slug}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete song");

      // Remove from pending list
      setSongs((prev) => prev.filter((s) => s._id !== song._id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject");
    } finally {
      setActionState("idle");
      setActionSongId(null);
    }
  };

  const getSubmitterInfo = (song: SongItem): string => {
    if (!song.createdBy) return "—";
    if (typeof song.createdBy === "string") return song.createdBy.slice(-6);
    return song.createdBy.name ?? song.createdBy.email ?? song.createdBy._id.slice(-6);
  };

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gold">ግምገማ</h1>
        <LoadingSpinner variant="medium" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gold">ግምገማ</h1>
        <Card>
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <p className="text-red-accent">{error}</p>
            <Button variant="secondary" onClick={fetchSongs}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Empty state
  if (songs.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gold">ግምገማ</h1>
        <Card>
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="text-5xl text-gold/30" aria-hidden="true">✓</div>
            <p className="text-lg font-medium text-text-primary/70">
              No pending songs for review
            </p>
            <p className="text-sm text-text-primary/40">
              All songs have been reviewed and approved
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gold">ግምገማ</h1>
          <p className="mt-1 text-sm text-text-primary/60">
            {pagination?.total ?? songs.length} song{pagination?.total !== 1 ? "s" : ""} pending review
          </p>
        </div>
        <Button variant="ghost" onClick={fetchSongs} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {songs.map((song) => {
          const isProcessing = actionState !== "idle" && actionSongId === song._id;

          return (
            <Card key={song._id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="font-medium text-gold-light truncate">
                  {song.titleAm}
                  {song.titleEn && (
                    <span className="ml-2 text-sm font-normal text-text-primary/50">
                      ({song.titleEn})
                    </span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-primary/50">
                  <span>Submitted: {getSubmitterInfo(song)}</span>
                  <span>Date: {formatDate(song.createdAt)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const preview = song.lyricsAm.length > 200
                        ? song.lyricsAm.slice(0, 200) + "..."
                        : song.lyricsAm;
                      alert(preview);
                    }}
                    className="underline hover:text-gold transition-colors"
                  >
                    Preview lyrics
                  </button>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(song)}
                  disabled={actionState !== "idle"}
                  loading={isProcessing && actionState === "approving"}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleReject(song)}
                  disabled={actionState !== "idle"}
                  loading={isProcessing && actionState === "rejecting"}
                >
                  Reject
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
