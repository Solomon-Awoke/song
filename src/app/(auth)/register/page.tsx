"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess(t("registerSuccess"));
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-gold/20 bg-bg-mid p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-2 text-4xl">✠</div>
          <h1 className="text-2xl font-bold text-gold">{t("register")}</h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-accent/10 px-4 py-3 text-sm text-red-accent">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              {t("name")}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gold/20 bg-bg-deep px-4 py-2.5 text-text-primary placeholder-gray-500 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gold/20 bg-bg-deep px-4 py-2.5 text-text-primary placeholder-gray-500 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-gold/20 bg-bg-deep px-4 py-2.5 text-text-primary placeholder-gray-500 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="•••••••• (min 6 characters)"
            />
            <p className="mt-1 text-xs text-gold/60">
              Password must be at least 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold px-4 py-2.5 font-semibold text-bg-deep transition-colors hover:bg-gold-mid disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg-deep border-t-transparent" />
                {t("register")}
              </span>
            ) : (
              t("register")
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-text-primary">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="font-semibold text-gold transition-colors hover:text-gold-light"
          >
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
