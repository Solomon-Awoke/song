'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SongForm from '../../../_components/SongForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface SongData {
  _id: string;
  titleAm: string;
  titleEn?: string;
  lyricsAm: string;
  lyricsEn?: string;
  category: { _id: string; nameAm: string; nameEn?: string };
  slug: string;
  tags: string[];
  author?: string;
  biblicalRefs: string[];
  isApproved: boolean;
}

export default function EditSongPage() {
  const params = useParams();
  const slug = params.id as string;

  const [song, setSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSong() {
      setLoading(true);
      try {
        const res = await fetch(`/api/songs/${slug}`);
        if (!res.ok) throw new Error('Song not found');
        const data = await res.json();
        setSong(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load song');
      } finally {
        setLoading(false);
      }
    }
    loadSong();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner variant="medium" />;
  }

  if (error || !song) {
    return (
      <div className="rounded-xl border border-red-accent/30 bg-red-accent/10 px-6 py-12 text-center">
        <p className="text-red-accent">{error || 'Song not found'}</p>
      </div>
    );
  }

  const initialData = {
    titleAm: song.titleAm,
    titleEn: song.titleEn ?? '',
    lyricsAm: song.lyricsAm,
    lyricsEn: song.lyricsEn ?? '',
    category: song.category?._id ?? '',
    tags: song.tags?.join(', ') ?? '',
    author: song.author ?? '',
    biblicalRefs: song.biblicalRefs?.join(', ') ?? '',
    isApproved: song.isApproved,
    slug: song.slug,
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Edit Song</h2>
        <p className="mt-1 text-sm text-text-primary/50">
          Editing: {song.titleAm}
        </p>
      </div>

      <div className="max-w-3xl rounded-xl border border-gold/10 bg-bg-mid p-6">
        <SongForm initialData={initialData} mode="edit" />
      </div>
    </div>
  );
}
