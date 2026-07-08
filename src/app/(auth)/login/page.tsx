"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Suspense } from "react";

function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/my";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("loginError"));
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError(t("loginError"));
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
          <h1 className="text-2xl font-bold text-gold">{t("login")}</h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-accent/10 px-4 py-3 text-sm text-red-accent">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full rounded-lg border border-gold/20 bg-bg-deep px-4 py-2.5 text-text-primary placeholder-gray-500 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold px-4 py-2.5 font-semibold text-bg-deep transition-colors hover:bg-gold-mid disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg-deep border-t-transparent" />
                {t("login")}
              </span>
            ) : (
              t("login")
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gold/20" />
          <span className="text-xs text-gold/60">OR</span>
          <div className="h-px flex-1 bg-gold/20" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gold/20 bg-bg-deep px-4 py-2.5 text-text-primary transition-colors hover:bg-bg-accent"
        >
          <FcGoogle className="h-5 w-5" />
          {t("signInWithGoogle")}
        </button>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-text-primary">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="font-semibold text-gold transition-colors hover:text-gold-light"
          >
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
