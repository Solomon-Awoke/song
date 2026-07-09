"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from "react-icons/fi";
import PasswordStrength from "@/components/ui/PasswordStrength";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function validate(): boolean {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validate()) return;

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
          <p className="mt-1 text-sm text-text-primary/60">
            Create your account to save favorites and playlists
          </p>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              {t("name")}
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                className={`w-full rounded-lg border bg-bg-deep py-2.5 pl-10 pr-4 text-text-primary placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.name
                    ? "border-red-accent focus:border-red-accent focus:ring-red-accent"
                    : "border-gold/20 focus:border-gold focus:ring-gold"
                }`}
                placeholder="Your name"
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-accent">{fieldErrors.name}</p>
            )}
          </div>

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
                minLength={6}
                className={`w-full rounded-lg border bg-bg-deep py-2.5 pl-10 pr-10 text-text-primary placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.password
                    ? "border-red-accent focus:border-red-accent focus:ring-red-accent"
                    : "border-gold/20 focus:border-gold focus:ring-gold"
                }`}
                placeholder="•••••••• (min 6 characters)"
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
            <PasswordStrength password={password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" />
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }
                }}
                required
                className={`w-full rounded-lg border bg-bg-deep py-2.5 pl-10 pr-10 text-text-primary placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.confirmPassword
                    ? "border-red-accent focus:border-red-accent focus:ring-red-accent"
                    : "border-gold/20 focus:border-gold focus:ring-gold"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60 transition-colors hover:text-gold"
                tabIndex={-1}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-accent">
                {fieldErrors.confirmPassword}
              </p>
            )}
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
                {t("register")}
              </span>
            ) : (
              t("register")
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gold/20" />
          <span className="text-xs text-gold/60">OR</span>
          <div className="h-px flex-1 bg-gold/20" />
        </div>

        {/* Google sign-up */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/login?registered=google" })}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gold/20 bg-bg-deep px-4 py-2.5 text-text-primary transition-colors hover:bg-bg-accent"
        >
          <FcGoogle className="h-5 w-5" />
          {t("signInWithGoogle")}
        </button>

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
