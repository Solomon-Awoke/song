"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearch } from "@/hooks/useSearch";
import SongCard from "@/components/song/SongCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { SearchableSong } from "@/lib/search";

interface SearchClientProps {
  songs: SearchableSong[];
}

export default function SearchClient({ songs }: SearchClientProps) {
  const { query, results, isSearching, hasSearched, setQuery, clearSearch } =
    useSearch(songs);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Reset highlighted index when results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [results]);

  // Scroll highlighted card into view
  useEffect(() => {
    if (highlightedIndex < 0 || !resultsRef.current) return;
    const cards = resultsRef.current.querySelectorAll<HTMLElement>("[data-index]");
    const target = cards[highlightedIndex];
    if (target) {
      target.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < results.length) {
            const slug = results[highlightedIndex].slug;
            window.location.href = `/songs/${slug}`;
          }
          break;
        case "Escape":
          e.preventDefault();
          clearSearch();
          inputRef.current?.blur();
          break;
      }
    },
    [results, highlightedIndex, clearSearch],
  );

  const showResults = hasSearched && results.length > 0;
  const showEmpty = hasSearched && results.length === 0 && !isSearching;
  const showIdle = !hasSearched && !isSearching && query.length === 0;

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="መዝሙር ፈልግ..."
          className="w-full rounded-lg border border-gold/30 bg-bg-mid p-4 pr-12 text-lg text-text-primary placeholder:text-text-primary/40 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
          aria-label="Search songs"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Clear button */}
        {query.length > 0 && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-text-primary/40 transition-colors hover:text-text-primary/80"
            aria-label="Clear search"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isSearching && (
        <div className="flex items-center justify-center gap-2 py-4 text-text-primary/50">
          <LoadingSpinner variant="small" />
          <span className="text-sm">Searching...</span>
        </div>
      )}

      {/* Results count */}
      {showResults && (
        <p className="text-sm text-text-primary/50">
          {results.length} {results.length === 1 ? "result" : "results"} found
        </p>
      )}

      {/* Results list */}
      {showResults && (
        <div ref={resultsRef} className="space-y-3" role="listbox" aria-label="Search results">
          {results.map((song, index) => (
            <div
              key={song._id}
              data-index={index}
              role="option"
              aria-selected={highlightedIndex === index}
            >
              <SongCard
                song={song}
                highlighted={highlightedIndex === index}
                onHover={() => setHighlightedIndex(index)}
                highlightedQuery={query}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4 text-text-primary/20"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p className="mb-1 text-lg font-medium text-text-primary/60">
            ምንም ውጤት አልተገኘም
          </p>
          <p className="text-sm text-text-primary/40">
            No results found
          </p>
          <p className="mt-4 text-xs text-text-primary/30">
            Try searching by song title, lyrics, or keywords
          </p>
        </div>
      )}

      {/* Idle state — no search yet */}
      {showIdle && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4 text-text-primary/20"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p className="text-sm text-text-primary/40">
            Type to search {songs.length > 0 ? `${songs.length} songs` : "songs"}
          </p>
        </div>
      )}
    </div>
  );
}
