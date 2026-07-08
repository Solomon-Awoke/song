'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface Category {
  _id: string;
  nameAm: string;
  nameEn?: string;
  slug: string;
  order: number;
  icon?: string;
}

interface CategoryFormData {
  nameAm: string;
  nameEn: string;
  slug: string;
  order: number;
  icon: string;
}

const emptyForm: CategoryFormData = {
  nameAm: '',
  nameEn: '',
  slug: '',
  order: 0,
  icon: '',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function openAddModal() {
    setEditingCategory(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  }

  function openEditModal(cat: Category) {
    setEditingCategory(cat);
    setForm({
      nameAm: cat.nameAm,
      nameEn: cat.nameEn ?? '',
      slug: cat.slug,
      order: cat.order,
      icon: cat.icon ?? '',
    });
    setError('');
    setModalOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value,
    }));

    // Auto-generate slug from Amharic name when creating
    if (name === 'nameAm' && !editingCategory) {
      setForm((prev) => ({
        ...prev,
        nameAm: value,
        slug: value
          .replace(/[^a-zA-Z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .toLowerCase()
          .trim() || '',
      }));
    }
  }

  async function handleSave() {
    setError('');
    setSaving(true);

    try {
      const body: Record<string, unknown> = {
        nameAm: form.nameAm,
        nameEn: form.nameEn || undefined,
        slug: form.slug,
        order: form.order,
        icon: form.icon || undefined,
      };

      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errData.error || 'Failed to save category');
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/categories/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete category');
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Categories</h2>
          <p className="mt-1 text-sm text-text-primary/50">
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} total
          </p>
        </div>
        <Button onClick={openAddModal} variant="primary">
          <FiPlus className="h-4 w-4" aria-hidden="true" />
          Add Category
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <LoadingSpinner variant="medium" />
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-gold/10 bg-bg-mid p-12 text-center">
          <p className="text-text-primary/50">
            No categories yet. Create your first category!
          </p>
          <Button onClick={openAddModal} variant="secondary" className="mt-4">
            Add Category
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gold/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gold/10 bg-bg-mid/80">
                <th className="px-4 py-3 font-medium text-text-primary/60">Order</th>
                <th className="px-4 py-3 font-medium text-text-primary/60">Amharic</th>
                <th className="px-4 py-3 font-medium text-text-primary/60">English</th>
                <th className="px-4 py-3 font-medium text-text-primary/60">Slug</th>
                <th className="px-4 py-3 font-medium text-text-primary/60">Icon</th>
                <th className="px-4 py-3 font-medium text-text-primary/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="transition-colors hover:bg-gold/[0.02]"
                >
                  <td className="px-4 py-3 text-text-primary/40">{cat.order}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {cat.nameAm}
                  </td>
                  <td className="px-4 py-3 text-text-primary/60">
                    {cat.nameEn || '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-primary/40">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3 text-text-primary/40">
                    {cat.icon || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-primary/50 transition-colors hover:text-gold hover:bg-gold/10"
                      >
                        <FiEdit2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(cat)}
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
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-accent/30 bg-red-accent/10 px-4 py-3 text-sm text-red-accent">
              {error}
            </div>
          )}

          <InputField
            label="Amharic Name *"
            name="nameAm"
            value={form.nameAm}
            onChange={handleChange}
            required
            placeholder="የምድብ ስም"
          />
          <InputField
            label="English Name"
            name="nameEn"
            value={form.nameEn}
            onChange={handleChange}
            placeholder="Category name in English"
          />
          <InputField
            label="Slug *"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            placeholder="category-slug"
            className="font-mono text-xs"
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Order"
              name="order"
              type="number"
              value={String(form.order)}
              onChange={handleChange}
              placeholder="0"
            />
            <InputField
              label="Icon (emoji or class)"
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="e.g. ✠"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" loading={saving} onClick={handleSave}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Category"
      >
        <p className="text-sm text-text-primary/70">
          Are you sure you want to delete{' '}
          <strong className="text-text-primary">
            {deleteTarget?.nameAm}
          </strong>
          ? Songs in this category may become unassigned.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
