"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import { buildSongIndex, searchSongs, type SearchableSong } from "@/lib/search";

interface UseSearchReturn {
  query: string;
  results: SearchableSong[];
  isSearching: boolean;
  hasSearched: boolean;
  setQuery: (query: string) => void;
  clearSearch: () => void;
}

export function useSearch(songs: SearchableSong[]): UseSearchReturn {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchableSong[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fuse = useMemo(() => buildSongIndex(songs), [songs]);

  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      try {
        const searchResults = searchSongs(fuse, searchQuery);
        setResults(searchResults);
        setHasSearched(true);
      } catch (e) {
        console.error("Search error:", e);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [fuse]
  );

  const handleSetQuery = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      setHasSearched(false);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (!newQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      debounceRef.current = setTimeout(() => {
        performSearch(newQuery);
      }, 300);
    },
    [performSearch]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    query,
    results,
    isSearching,
    hasSearched,
    setQuery: handleSetQuery,
    clearSearch,
  };
}
