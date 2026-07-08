"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface CategoryOption {
  _id: string;
  nameAm: string;
  nameEn?: string;
}

interface ImportResult {
  total: number;
  imported: number;
  errors: { index: number; title?: string; message: string }[];
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load categories on mount
  useState(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const cats = Array.isArray(data) ? data : data?.items ?? [];
        setCategories(cats);
      })
      .catch(() => {
        // Graceful fallback
      })
      .finally(() => setCategoriesLoading(false));
  });

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a PDF file");
      return;
    }
    setFile(selectedFile);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleImport = async () => {
    if (!file || !categoryId) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", categoryId);

      const res = await fetch("/api/songs/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({
          total: 0,
          imported: 0,
          errors: [{ index: 0, message: data.error ?? "Import failed" }],
        });
        return;
      }

      setResult(data);
    } catch (err) {
      setResult({
        total: 0,
        imported: 0,
        errors: [{ index: 0, message: err instanceof Error ? err.message : "Network error" }],
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gold">ማስመጣት ከ PDF</h1>
        <p className="mt-1 text-sm text-text-primary/60">
          Upload a PDF file containing songs to import them into the database
        </p>
      </div>

      <Card className="space-y-6">
        {/* File upload area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={[
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors",
            dragOver
              ? "border-gold bg-gold/5"
              : file
                ? "border-success/50 bg-success/5"
                : "border-gold/30 hover:border-gold/50 hover:bg-gold/5",
          ].join(" ")}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />

          {file ? (
            <div className="space-y-2">
              <div className="text-3xl" aria-hidden="true">📄</div>
              <p className="font-medium text-gold-light">{file.name}</p>
              <p className="text-xs text-text-primary/50">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetForm();
                }}
                className="text-xs text-text-primary/50 underline hover:text-red-accent transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-4xl text-gold/50" aria-hidden="true">📂</div>
              <p className="font-medium text-text-primary/70">
                Drop a PDF here or click to browse
              </p>
              <p className="text-xs text-text-primary/40">
                Only PDF files are supported
              </p>
            </div>
          )}
        </div>

        {/* Category selector */}
        <div className="max-w-xs">
          {categoriesLoading ? (
            <LoadingSpinner variant="small" />
          ) : (
            <Select
              label="Category"
              placeholder="Select a category..."
              options={categories.map((c) => ({
                value: c._id,
                label: c.nameAm + (c.nameEn ? ` (${c.nameEn})` : ""),
              }))}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            />
          )}
        </div>

        {/* Import button */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleImport}
            disabled={!file || !categoryId || loading}
            loading={loading}
          >
            {loading ? "Importing..." : "Import"}
          </Button>

          {loading && (
            <span className="text-sm text-text-primary/50">
              Parsing PDF and saving songs...
            </span>
          )}
        </div>
      </Card>

      {/* Results */}
      {result && (
        <Card className="space-y-4">
          <h2 className="text-lg font-bold text-gold">Import Results</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-bg-accent/50 p-4 text-center">
              <p className="text-2xl font-bold text-gold-light">{result.total}</p>
              <p className="text-xs text-text-primary/60">Total Found</p>
            </div>
            <div className="rounded-lg bg-bg-accent/50 p-4 text-center">
              <p className="text-2xl font-bold text-success">{result.imported}</p>
              <p className="text-xs text-text-primary/60">Imported</p>
            </div>
            <div className="rounded-lg bg-bg-accent/50 p-4 text-center">
              <p className="text-2xl font-bold text-red-accent">
                {result.errors.length}
              </p>
              <p className="text-xs text-text-primary/60">Errors</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-red-accent">Errors</h3>
              <ul className="space-y-1">
                {result.errors.map((err, i) => (
                  <li
                    key={i}
                    className="rounded bg-red-accent/10 px-3 py-2 text-xs text-red-accent/90"
                  >
                    {err.title ? `"${err.title}": ` : ""}
                    {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button variant="secondary" onClick={resetForm}>
            Import Another File
          </Button>
        </Card>
      )}
    </div>
  );
}
