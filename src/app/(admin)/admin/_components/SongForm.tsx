'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { InputField, Textarea, Select } from '@/components/ui/Input';

interface CategoryOption {
  _id: string;
  nameAm: string;
  nameEn?: string;
}

interface SongFormData {
  titleAm: string;
  titleEn: string;
  lyricsAm: string;
  lyricsEn: string;
  category: string;
  tags: string;
  author: string;
  biblicalRefs: string;
  isApproved: boolean;
}

interface SongFormProps {
  initialData?: Partial<SongFormData> & { slug?: string };
  mode: 'create' | 'edit';
}

export default function SongForm({ initialData, mode }: SongFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState<SongFormData>({
    titleAm: initialData?.titleAm ?? '',
    titleEn: initialData?.titleEn ?? '',
    lyricsAm: initialData?.lyricsAm ?? '',
    lyricsEn: initialData?.lyricsEn ?? '',
    category: initialData?.category ?? '',
    tags: initialData?.tags ?? '',
    author: initialData?.author ?? '',
    biblicalRefs: initialData?.biblicalRefs ?? '',
    isApproved: initialData?.isApproved ?? true,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to load categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setFetchingCategories(false);
      }
    }
    loadCategories();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body: Record<string, unknown> = {
        titleAm: form.titleAm,
        titleEn: form.titleEn || undefined,
        lyricsAm: form.lyricsAm,
        lyricsEn: form.lyricsEn || undefined,
        category: form.category,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        author: form.author || undefined,
        biblicalRefs: form.biblicalRefs
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
        isApproved: form.isApproved,
      };

      const url =
        mode === 'edit' && initialData?.slug
          ? `/api/songs/${initialData.slug}`
          : '/api/songs';

      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errData.error || `Failed to ${mode} song`);
      }

      router.push('/admin/songs');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (fetchingCategories) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-accent/30 bg-red-accent/10 px-4 py-3 text-sm text-red-accent">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <InputField
          label="Amharic Title *"
          name="titleAm"
          value={form.titleAm}
          onChange={handleChange}
          required
          placeholder="የመዝሙሩ ርዕስ"
        />
        <InputField
          label="English Title"
          name="titleEn"
          value={form.titleEn}
          onChange={handleChange}
          placeholder="Song title in English"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Select
          label="Category *"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          placeholder="Select a category"
          options={categories.map((cat) => ({
            value: cat._id,
            label: cat.nameEn ? `${cat.nameAm} (${cat.nameEn})` : cat.nameAm,
          }))}
        />
        <InputField
          label="Author"
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="ደራሲ / Author"
        />
      </div>

      <Textarea
        label="Amharic Lyrics *"
        name="lyricsAm"
        value={form.lyricsAm}
        onChange={handleChange}
        required
        rows={10}
        placeholder="የመዝሙሩ ግጥም..."
        className="min-h-[200px]"
      />

      <Textarea
        label="English Lyrics"
        name="lyricsEn"
        value={form.lyricsEn}
        onChange={handleChange}
        rows={6}
        placeholder="English translation (optional)"
        className="min-h-[150px]"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <InputField
          label="Tags"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="e.g. ጾም, በዓል, ልደት (comma separated)"
        />
        <InputField
          label="Biblical References"
          name="biblicalRefs"
          value={form.biblicalRefs}
          onChange={handleChange}
          placeholder="e.g. መዝ 23:1, ዮሐ 3:16 (comma separated)"
        />
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-gold/10 bg-bg-accent/50 px-4 py-3">
        <input
          type="checkbox"
          name="isApproved"
          checked={form.isApproved}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gold/30 bg-bg-accent text-gold accent-gold focus:ring-gold/40"
        />
        <div>
          <span className="text-sm font-medium text-text-primary">Approved</span>
          <p className="text-xs text-text-primary/40">
            Approved songs are visible to all users on the public site
          </p>
        </div>
      </label>

      <div className="flex items-center gap-3 border-t border-gold/10 pt-6">
        <Button type="submit" loading={loading} variant="primary" size="lg">
          {mode === 'create' ? 'Create Song' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.push('/admin/songs')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
