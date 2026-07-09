"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { Suspense } from "react";

function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validate()) return;

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
          <p className="mt-1 text-sm text-text-primary/60">
            Welcome back to Ethiopian Spiritual Songs
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-accent/10 px-4 py-3 text-sm text-red-accent">
            {error}
          </div>
        )}

        {/* Success message for Google registration */}
        {searchParams.get("registered") === "google" && (
          <div className="mb-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
            ✅ Account created with Google! You can now sign in.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              {t("email")}
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                required
                className={`w-full rounded-lg border bg-bg-deep py-2.5 pl-10 pr-4 text-text-primary placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.email
                    ? "border-red-accent focus:border-red-accent focus:ring-red-accent"
                    : "border-gold/20 focus:border-gold focus:ring-gold"
                }`}
                placeholder="user@example.com"
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-accent">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              {t("password")}
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
                }}
                required
                className={`w-full rounded-lg border bg-bg-deep py-2.5 pl-10 pr-10 text-text-primary placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.password
                    ? "border-red-accent focus:border-red-accent focus:ring-red-accent"
                    : "border-gold/20 focus:border-gold focus:ring-gold"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60 transition-colors hover:text-gold"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-accent">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gold/40 bg-bg-deep text-gold focus:ring-gold/40"
              />
              <span className="text-sm text-text-primary/70">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-gold transition-colors hover:text-gold-light"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 font-semibold text-bg-deep transition-colors hover:bg-gold-mid disabled:cursor-not-allowed disabled:opacity-50"
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
