"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import {
  FiHeart,
  FiShare2,
  FiFileText,
  FiPlus,
  FiPlay,
  FiPause,
} from "react-icons/fi";
import { generateSongPdf } from "@/lib/pdf-export";
import AuthPromptModal from "@/components/ui/AuthPromptModal";

interface LyricsDisplayProps {
  lyricsAm: string;
  lyricsEn?: string;
  titleAm: string;
  titleEn?: string;
  slug: string;
}

type LangTab = "am" | "en";
type ScrollSpeed = 0.5 | 1 | 2;

const SPEED_OPTIONS: { label: string; value: ScrollSpeed }[] = [
  { label: "0.5×", value: 0.5 },
  { label: "1×", value: 1 },
  { label: "2×", value: 2 },
];

function formatLyrics(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function LyricsDisplay({
  lyricsAm,
  lyricsEn,
  titleAm,
  titleEn,
  slug,
}: LyricsDisplayProps) {
  const [mobileTab, setMobileTab] = useState<LangTab>("am");
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState<
    "favorite" | "playlist" | "share" | "pdf" | "general"
  >("general");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { isScrolling, speed, startScroll, stopScroll, setSpeed } =
    useAutoScroll(scrollContainerRef);
  const speedBtnRef = useRef<HTMLButtonElement | null>(null);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  // ---------- Favorite state ----------
  const [isFavorited, setIsFavorited] = useState(false);

  // ---------- Share state ----------
  const [copied, setCopied] = useState(false);

  // ---------- Playlist state ----------
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null);
  const [playlistSuccess, setPlaylistSuccess] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);

  const amLines = formatLyrics(lyricsAm);
  const enLines = lyricsEn ? formatLyrics(lyricsEn) : [];
  const hasEnglish = !!lyricsEn && lyricsEn.trim().length > 0;

  function handleSpeed(s: ScrollSpeed) {
    setSpeed(s);
    setShowSpeedMenu(false);
  }

  function handleAutoScrollToggle() {
    if (isScrolling) {
      stopScroll();
    } else {
      startScroll();
    }
  }

  function handleAuthRequired(
    action: "favorite" | "playlist" | "share" | "pdf",
  ) {
    if (!isLoggedIn) {
      setAuthAction(action);
      setShowAuthModal(true);
      return false;
    }
    return true;
  }

  async function handlePdfDownload() {
    try {
      const blob = await generateSongPdf({
        titleAm,
        titleEn,
        lyricsAm,
        lyricsEn: lyricsEn || "",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${titleAm.replace(/[^a-zA-Z0-9\s-]/g, "").trim() || "song"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    }
  }

  // ---------- Check favorite status on mount ----------
  useEffect(() => {
    if (!isLoggedIn || !slug) return;
    fetch("/api/favorites")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setIsFavorited(data.some((s: any) => s.slug === slug));
        }
      })
      .catch(() => {});
  }, [isLoggedIn, slug]);

  // ---------- Favorite handler ----------
  async function handleFavorite() {
    if (!handleAuthRequired("favorite")) return;
    try {
      const res = await fetch(`/api/songs/${slug}/favorite`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setIsFavorited(data.favorited);
      }
    } catch {
      // silently fail
    }
  }

  // ---------- Share handler ----------
  async function handleShare() {
    if (!handleAuthRequired("share")) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: titleAm, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled or clipboard failed
    }
  }

  // ---------- Playlist handlers ----------
  async function handleOpenPlaylist() {
    if (!handleAuthRequired("playlist")) return;
    setShowPlaylistModal(true);
    setLoadingPlaylists(true);
    setPlaylistSuccess(null);
    setShowNewPlaylistInput(false);
    try {
      const res = await fetch("/api/playlists");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPlaylists(Array.isArray(data) ? data : []);
    } catch {
      setPlaylists([]);
    } finally {
      setLoadingPlaylists(false);
    }
  }

  async function handleAddToPlaylist(playlistId: string) {
    setAddingToPlaylist(playlistId);
    setPlaylistSuccess(null);
    try {
      // Get the song's MongoDB _id from the slug
      const songRes = await fetch(`/api/songs/${slug}`);
      if (!songRes.ok) throw new Error("Song not found");
      const song = await songRes.json();
      const songId = song._id;

      const res = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      });
      if (res.ok) {
        setPlaylistSuccess("Added to playlist ✓");
        setTimeout(() => setPlaylistSuccess(null), 3000);
      }
    } catch {
      // silently fail
    } finally {
      setAddingToPlaylist(null);
    }
  }

  async function handleCreatePlaylist() {
    if (!newPlaylistName.trim()) return;
    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPlaylistName.trim() }),
      });
      if (res.ok) {
        const playlist = await res.json();
        setPlaylists((prev) => [...prev, playlist]);
        setNewPlaylistName("");
        setShowNewPlaylistInput(false);
      }
    } catch {
      // silently fail
    }
  }

  // ---------- Shared lyrics column ----------
  function LyricsColumn({
    lines,
    lang,
    title,
  }: {
    lines: string[];
    lang: "am" | "en";
    title: string;
  }) {
    if (lines.length === 0) return null;

    return (
      <div className={lang === "am" ? "font-sans" : "font-serif"}>
        <h2
          className={
            lang === "am"
              ? "mb-4 text-lg font-bold tracking-wide text-gold-light"
              : "mb-4 text-lg font-bold italic tracking-wide text-gold-light/90"
          }
        >
          {title}
        </h2>
        <div className="space-y-4" lang={lang === "am" ? "am" : "en"}>
          {lines.map((line, i) => {
            const isStanzaBreak =
              i > 0 && line.startsWith("[") && line.endsWith("]");
            return (
              <p
                key={i}
                className={
                  isStanzaBreak
                    ? "pt-4 text-sm font-semibold tracking-wider text-gold/70"
                    : lang === "am"
                      ? "leading-[2.2] text-text-primary"
                      : "leading-relaxed text-text-primary/90"
                }
              >
                {isStanzaBreak ? line.slice(1, -1) : line}
              </p>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ---------- Song Header ---------- */}
      <header className="mb-8 text-center">
        <div className="mb-3 text-3xl text-gold" aria-hidden="true">
          ✠
        </div>
        <h1 className="font-sans text-2xl font-bold tracking-wide text-gold sm:text-3xl">
          {titleAm}
        </h1>
        {titleEn && (
          <p className="font-serif mt-1.5 text-base italic text-text-primary/60">
            {titleEn}
          </p>
        )}
        <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </header>

      {/* ---------- Mobile Tabs ---------- */}
      <div className="mb-6 flex rounded-lg border border-gold/20 bg-bg-mid/50 p-1 md:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("am")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ${
            mobileTab === "am"
              ? "bg-gold text-bg-deep shadow-md"
              : "text-text-primary/60 hover:text-gold"
          }`}
        >
          አማርኛ
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("en")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ${
            mobileTab === "en"
              ? "bg-gold text-bg-deep shadow-md"
              : "text-text-primary/60 hover:text-gold"
          }`}
        >
          English
        </button>
      </div>

      {/* ---------- Action Buttons Row ---------- */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleFavorite}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-gold/20 bg-bg-mid/50 px-3.5 py-2 text-xs font-medium transition-all duration-150 hover:border-red-accent/50 hover:text-red-accent ${
            isFavorited ? "text-red-accent" : "text-text-primary/70"
          }`}
          aria-label="Favorite"
        >
          {isFavorited ? (
            <FiHeart size="16" aria-hidden="true" className="fill-current" />
          ) : (
            <FiHeart size="16" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">Favorite</span>
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gold/20 bg-bg-mid/50 px-3.5 py-2 text-xs font-medium text-text-primary/70 transition-all duration-150 hover:border-gold/50 hover:text-gold"
          aria-label="Share"
        >
          <FiShare2 size="16" aria-hidden="true" />
          <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (handleAuthRequired("pdf")) {
              void handlePdfDownload();
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gold/20 bg-bg-mid/50 px-3.5 py-2 text-xs font-medium text-text-primary/70 transition-all duration-150 hover:border-gold/50 hover:text-gold"
          aria-label="Download PDF"
        >
          <FiFileText size="16" aria-hidden="true" />
          <span className="hidden sm:inline">PDF</span>
        </button>
        <button
          type="button"
          onClick={handleOpenPlaylist}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gold/20 bg-bg-mid/50 px-3.5 py-2 text-xs font-medium text-text-primary/70 transition-all duration-150 hover:border-gold/50 hover:text-gold"
          aria-label="Add to playlist"
        >
          <FiPlus size="16" aria-hidden="true" />
          <span className="hidden sm:inline">Playlist</span>
        </button>
      </div>

      {/* ---------- Lyrics Content ---------- */}
      <div
        ref={scrollContainerRef}
        className="scroll-smooth rounded-xl border border-gold/10 bg-bg-mid/30 p-6 shadow-lg shadow-black/20 backdrop-blur-sm sm:p-8"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {/* Desktop: two columns */}
        <div className="hidden gap-8 md:grid md:grid-cols-2">
          {/* Left: Amharic */}
          <div className="border-r border-gold/10 pr-6">
            <LyricsColumn
              lines={amLines}
              lang="am"
              title={titleAm}
            />
          </div>

          {/* Right: English */}
          <div className="pl-2">
            {hasEnglish ? (
              <LyricsColumn
                lines={enLines}
                lang="en"
                title={titleEn || "English"}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="font-serif text-center italic leading-relaxed text-gold/60">
                  <span className="block text-2xl" aria-hidden="true">
                    ✠
                  </span>
                  English translation
                  <br />
                  coming soon
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: tabbed content */}
        <div className="md:hidden">
          {mobileTab === "am" ? (
            <LyricsColumn lines={amLines} lang="am" title={titleAm} />
          ) : hasEnglish ? (
            <LyricsColumn
              lines={enLines}
              lang="en"
              title={titleEn || "English"}
            />
          ) : (
            <div className="flex items-center justify-center py-16">
              <p className="font-serif text-center italic leading-relaxed text-gold/60">
                <span className="block text-2xl" aria-hidden="true">
                  ✠
                </span>
                English translation
                <br />
                coming soon
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Auto-scroll Floating Controls ---------- */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {/* Speed selector dropdown */}
        {showSpeedMenu && (
          <div className="mb-1 flex gap-1 rounded-lg border border-gold/20 bg-bg-mid p-1 shadow-xl shadow-black/40 backdrop-blur-md">
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSpeed(opt.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  speed === opt.value
                    ? "bg-gold text-bg-deep"
                    : "text-text-primary/60 hover:text-gold"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Speed selector toggle + Scroll button */}
        <div className="flex items-center gap-2">
          <button
            ref={speedBtnRef}
            type="button"
            onClick={() => setShowSpeedMenu((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-bg-mid/90 text-xs font-bold text-gold shadow-lg backdrop-blur-sm transition-all duration-150 hover:border-gold/50 hover:bg-bg-mid"
            aria-label="Scroll speed"
          >
            {speed}×
          </button>

          <button
            type="button"
            onClick={handleAutoScrollToggle}
            className={`flex h-14 w-14 items-center justify-center rounded-full shadow-xl backdrop-blur-sm transition-all duration-200 ${
              isScrolling
                ? "bg-gold text-bg-deep shadow-gold/30 ring-2 ring-gold/50"
                : "border border-gold/30 bg-bg-mid/90 text-gold hover:border-gold/60 hover:bg-bg-mid"
            }`}
            aria-label={isScrolling ? "Pause auto-scroll" : "Start auto-scroll"}
          >
            {isScrolling ? (
              <FiPause size="22" aria-hidden="true" />
            ) : (
              <FiPlay size="22" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Scrolling indicator */}
        {isScrolling && (
          <div className="flex items-center gap-1.5 rounded-full border border-gold/20 bg-bg-deep/80 px-3 py-1 text-xs text-gold-light backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            Scrolling
          </div>
        )}
      </div>

      {/* ---------- Playlist Modal ---------- */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-gold/20 bg-bg-deep p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gold">Add to Playlist</h3>
              <button
                type="button"
                onClick={() => setShowPlaylistModal(false)}
                className="text-text-primary/50 hover:text-text-primary transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Loading */}
            {loadingPlaylists && (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              </div>
            )}

            {/* Empty state */}
            {!loadingPlaylists && playlists.length === 0 && (
              <p className="py-6 text-center text-sm text-text-primary/50">
                No playlists yet. Create one below.
              </p>
            )}

            {/* Playlist list */}
            {!loadingPlaylists && playlists.length > 0 && (
              <ul className="mb-4 max-h-60 space-y-1 overflow-y-auto">
                {playlists.map((pl: any) => (
                  <li key={pl._id}>
                    <button
                      type="button"
                      onClick={() => handleAddToPlaylist(pl._id)}
                      disabled={addingToPlaylist === pl._id}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-primary/80 transition-colors hover:bg-gold/10 hover:text-gold disabled:opacity-50"
                    >
                      {addingToPlaylist === pl._id ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                      ) : (
                        <FiPlus size="16" className="text-gold/60" />
                      )}
                      <span>{pl.name}</span>
                      {pl.description && (
                        <span className="ml-auto text-xs text-text-primary/40">
                          {pl.songs?.length || 0} songs
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Create new playlist */}
            {!loadingPlaylists && (
              <div className="border-t border-gold/10 pt-4">
                {showNewPlaylistInput ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void handleCreatePlaylist();
                      }}
                      placeholder="Playlist name..."
                      className="flex-1 rounded-lg border border-gold/20 bg-bg-mid/50 px-3 py-2 text-sm text-text-primary outline-none focus:border-gold/50"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleCreatePlaylist}
                      disabled={!newPlaylistName.trim()}
                      className="rounded-lg bg-gold px-3 py-2 text-sm font-medium text-bg-deep transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      Create
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowNewPlaylistInput(true)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gold/70 transition-colors hover:bg-gold/5 hover:text-gold"
                  >
                    <FiPlus size="16" />
                    Create New Playlist
                  </button>
                )}
              </div>
            )}

            {/* Success feedback */}
            {playlistSuccess && (
              <div className="mt-3 rounded-lg bg-green-500/10 px-3 py-2 text-center text-sm text-green-400">
                {playlistSuccess}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={authAction}
      />
    </div>
  );
}
