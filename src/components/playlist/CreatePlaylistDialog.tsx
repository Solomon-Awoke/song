"use client";

import { useState, useRef, useEffect } from "react";
import { FiX, FiPlus } from "react-icons/fi";

interface CreatePlaylistDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreatePlaylistDialog({
  open,
  onClose,
  onCreated,
}: CreatePlaylistDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Focus the name input when dialog opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Playlist name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create playlist");
      }

      setName("");
      setDescription("");
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-gold/20 bg-bg-mid p-6 shadow-2xl shadow-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-text-primary/50 transition-colors hover:text-gold"
          aria-label="Close"
        >
          <FiX size="18" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 text-2xl text-gold" aria-hidden="true">
            ✠
          </div>
          <h2 className="text-lg font-bold text-gold">Create Playlist</h2>
          <p className="mt-1 text-xs text-text-primary/50">የመዝሙር ዝርዝር ይፍጠሩ</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playlist-name" className="mb-1.5 block text-xs font-medium text-text-primary/70">
              Name
            </label>
            <input
              ref={inputRef}
              id="playlist-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Playlist"
              className="w-full rounded-lg border border-gold/20 bg-bg-deep px-3.5 py-2.5 text-sm text-text-primary placeholder-text-primary/30 outline-none transition-colors focus:border-gold/50"
            />
          </div>

          <div>
            <label htmlFor="playlist-desc" className="mb-1.5 block text-xs font-medium text-text-primary/70">
              Description <span className="text-text-primary/30">(optional)</span>
            </label>
            <textarea
              id="playlist-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description..."
              rows={3}
              className="w-full resize-none rounded-lg border border-gold/20 bg-bg-deep px-3.5 py-2.5 text-sm text-text-primary placeholder-text-primary/30 outline-none transition-colors focus:border-gold/50"
            />
          </div>

          {error && (
            <p className="text-xs text-red-accent">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-bg-deep transition-all hover:bg-gold-mid disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-bg-deep border-t-transparent" />
            ) : (
              <FiPlus size="16" />
            )}
            {loading ? "Creating..." : "Create Playlist"}
          </button>
        </form>
      </div>
    </div>
  );
}
