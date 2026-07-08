"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

interface RemoveSongButtonProps {
  playlistId: string;
  songId: string;
  onRemoved: () => void;
}

export default function RemoveSongButton({
  playlistId,
  songId,
  onRemoved,
}: RemoveSongButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      });

      if (res.ok) {
        onRemoved();
      } else {
        const data = await res.json();
        console.error("Failed to remove song:", data.error);
      }
    } catch (err) {
      console.error("Failed to remove song:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-accent/30 bg-red-accent/5 px-3 py-1.5 text-xs font-medium text-red-accent/80 transition-all hover:border-red-accent/60 hover:bg-red-accent/10 hover:text-red-accent disabled:opacity-50"
      aria-label="Remove song from playlist"
    >
      {loading ? (
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-accent/50 border-t-red-accent" />
      ) : (
        <FiTrash2 size="14" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">Remove</span>
    </button>
  );
}
