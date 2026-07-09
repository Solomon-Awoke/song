"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { FiMail, FiArrowLeft } from "react-icons/fi";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(
        "If an account with that email exists, a reset link has been sent."
      );
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
          <h1 className="text-2xl font-bold text-gold">Forgot Password</h1>
          <p className="mt-2 text-sm text-text-primary/60">
            Enter your email and we&apos;ll send you a reset link
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
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gold/20 bg-bg-deep py-2.5 pl-10 pr-4 text-text-primary placeholder-gray-500 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 font-semibold text-bg-deep transition-colors hover:bg-gold-mid disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg-deep border-t-transparent" />
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        {/* Back to login */}
        <p className="mt-6 text-center text-sm text-text-primary">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 font-medium text-gold transition-colors hover:text-gold-light"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
