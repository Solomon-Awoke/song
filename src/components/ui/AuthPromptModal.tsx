"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: "favorite" | "playlist" | "share" | "pdf" | "general";
}

const ACTION_MESSAGES: Record<
  AuthPromptModalProps["action"],
  { emoji: string; message: string }
> = {
  favorite: { emoji: "❤️", message: "Sign in to save songs to your favorites" },
  playlist: { emoji: "📋", message: "Sign in to create and manage playlists" },
  share: { emoji: "🔗", message: "Sign in to share songs with friends" },
  pdf: { emoji: "📄", message: "Sign in to download PDFs" },
  general: { emoji: "🔐", message: "Sign in to access this feature" },
};

export default function AuthPromptModal({
  isOpen,
  onClose,
  action,
}: AuthPromptModalProps) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  const { emoji, message } = ACTION_MESSAGES[action];

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
        });
      });
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!visible) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "transition-opacity duration-200 ease-out",
        animate ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      {/* Modal Panel */}
      <div
        className={[
          "relative z-10 w-full max-w-md overflow-hidden rounded-2xl",
          "border border-gold/20 bg-gradient-to-b from-bg-mid to-bg-deep",
          "shadow-2xl shadow-black/50",
          "transition-all duration-200 ease-out",
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Authentication required"
      >
        {/* Decorative top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className={[
            "absolute right-4 top-4 z-10 flex items-center justify-center rounded-full p-1.5",
            "text-text-primary/40 hover:text-gold hover:bg-gold/10",
            "transition-colors duration-150",
          ].join(" ")}
          aria-label="Close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
          {/* Ethiopian Cross */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-2xl text-gold">
            ✠
          </div>

          {/* Emoji + Message */}
          <p className="mb-2 text-3xl" aria-hidden="true">
            {emoji}
          </p>
          <p className="mb-8 font-sans text-lg font-semibold leading-relaxed text-text-primary">
            {message}
          </p>

          {/* Sign In Button */}
          <Link
            href="/login"
            className={[
              "w-full rounded-lg bg-gold px-5 py-3 text-center text-sm font-bold uppercase tracking-wider",
              "text-bg-deep transition-all duration-150",
              "hover:bg-gold-mid active:scale-[0.98]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
            ].join(" ")}
          >
            Sign In
          </Link>

          {/* Register Button */}
          <Link
            href="/register"
            className={[
              "mt-3 w-full rounded-lg border border-gold/40 px-5 py-3 text-center text-sm font-medium uppercase tracking-wider",
              "text-gold transition-all duration-150",
              "hover:bg-gold/10 hover:border-gold/60 active:scale-[0.98]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
            ].join(" ")}
          >
            Register
          </Link>

          {/* Maybe Later */}
          <button
            type="button"
            onClick={onClose}
            className={[
              "mt-5 text-xs font-medium tracking-wide",
              "text-text-primary/40 transition-colors duration-150",
              "hover:text-text-primary/70",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
            ].join(" ")}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
