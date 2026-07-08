'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface CategoryInfo {
  _id: string;
  nameAm: string;
  nameEn?: string;
  slug: string;
}

interface SongItem {
  _id: string;
  titleAm: string;
  titleEn?: string;
  slug: string;
  category: CategoryInfo;
  isApproved: boolean;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SongsResponse {
  items: SongItem[];
  pagination: PaginationInfo;
}

export default function AdminSongsPage() {
  const router = useRouter();
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<SongItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        includeUnapproved: 'true',
        page: String(page),
        limit: '20',
      });
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/songs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch songs');
      const data: SongsResponse = await res.json();
      setSongs(data.items ?? []);
      setPagination(data.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch (err) {
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/songs/${deleteTarget.slug}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete song');
      setDeleteTarget(null);
      fetchSongs();
    } catch (err) {
      console.error('Error deleting song:', err);
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Debounced search
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Songs</h2>
          <p className="mt-1 text-sm text-text-primary/50">
            {pagination.total} song{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/admin/songs/new">
          <Button variant="primary">
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            Add New Song
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <SearchInput
          name="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search songs..."
        />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner variant="medium" />
      ) : songs.length === 0 ? (
        <div className="rounded-xl border border-gold/10 bg-bg-mid p-12 text-center">
          <p className="text-text-primary/50">
            {search.trim()
              ? 'No songs match your search'
              : 'No songs yet. Create your first song!'}
          </p>
          {!search.trim() && (
            <Link
              href="/admin/songs/new"
              className="mt-4 inline-block text-sm font-medium text-gold hover:text-gold-light"
            >
              Add New Song →
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gold/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gold/10 bg-bg-mid/80">
                  <th className="px-4 py-3 font-medium text-text-primary/60">Title</th>
                  <th className="px-4 py-3 font-medium text-text-primary/60">Category</th>
                  <th className="px-4 py-3 font-medium text-text-primary/60">Status</th>
                  <th className="px-4 py-3 font-medium text-text-primary/60">Date</th>
                  <th className="px-4 py-3 font-medium text-text-primary/60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {songs.map((song) => (
                  <tr
                    key={song._id}
                    className="transition-colors hover:bg-gold/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-text-primary">
                          {song.titleAm}
                        </p>
                        {song.titleEn && (
                          <p className="text-xs text-text-primary/40">
                            {song.titleEn}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-primary/60">
                      {song.category?.nameAm ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                          song.isApproved
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning',
                        ].join(' ')}
                      >
                        {song.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-primary/40">
                      {formatDate(song.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/songs/${song.slug}/edit`}
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-primary/50 transition-colors hover:text-gold hover:bg-gold/10"
                        >
                          <FiEdit2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(song)}
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-primary/50 transition-colors hover:text-red-accent hover:bg-red-accent/10"
                        >
                          <FiTrash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={[
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  page <= 1
                    ? 'cursor-not-allowed text-text-primary/30'
                    : 'text-text-primary hover:text-gold hover:bg-gold/5',
                ].join(' ')}
              >
                ← Previous
              </button>
              <span className="text-sm text-text-primary/50">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className={[
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  page >= pagination.totalPages
                    ? 'cursor-not-allowed text-text-primary/30'
                    : 'text-text-primary hover:text-gold hover:bg-gold/5',
                ].join(' ')}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Song"
      >
        <p className="text-sm text-text-primary/70">
          Are you sure you want to delete{' '}
          <strong className="text-text-primary">
            {deleteTarget?.titleAm}
          </strong>
          ? This action cannot be undone.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
