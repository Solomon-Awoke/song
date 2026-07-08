import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { SearchableSong } from "@/lib/search";

interface SongCardProps {
  song: SearchableSong;
  highlighted?: boolean;
  onHover?: () => void;
  highlightedQuery?: string;
}

/**
 * Highlights matching query text within a string, returning React nodes.
 * Matched segments wrapped in <mark> with gold styling.
 */
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-gold/30 text-gold">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default function SongCard({
  song,
  highlighted = false,
  onHover,
  highlightedQuery = "",
}: SongCardProps) {
  const lyricsPreview = (song.lyricsAm || song.lyricsEn || "").slice(0, 120);
  const categoryName = song.category
    ? (song.category.nameAm || song.category.nameEn || "")
    : "";

  return (
    <Link
      href={`/songs/${song.slug}`}
      className="block"
      onMouseEnter={onHover}
    >
      <Card
        variant="song-card"
        className={[
          "p-4 sm:p-5",
          highlighted ? "border-gold-light ring-1 ring-gold/30" : "",
        ].join(" ")}
      >
        <div className="flex flex-col gap-2">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold leading-tight text-gold">
              {highlightedQuery
                ? highlightText(song.titleAm, highlightedQuery)
                : song.titleAm}
            </h3>
            {song.titleEn && (
              <span className="hidden shrink-0 text-right text-xs italic text-text-primary/50 sm:block">
                {highlightedQuery
                  ? highlightText(song.titleEn, highlightedQuery)
                  : song.titleEn}
              </span>
            )}
          </div>

          {/* Category badge */}
          {categoryName && (
            <span className="w-fit rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold-mid">
              {categoryName}
            </span>
          )}

          {/* Lyrics preview */}
          {lyricsPreview && (
            <p className="line-clamp-2 text-sm leading-relaxed text-text-primary/70">
              {highlightedQuery
                ? highlightText(lyricsPreview, highlightedQuery)
                : lyricsPreview}
              {(song.lyricsAm || song.lyricsEn || "").length > 120 && (
                <span className="text-gold/60">…</span>
              )}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
