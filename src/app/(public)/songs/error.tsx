"use client";

export default function SongsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <div
        className="ethiopian-cross mb-4 text-4xl text-gold/40"
        aria-hidden="true"
      />

      <h2 className="mb-3 text-2xl font-bold text-gold">
        ስህተት ተከስቷል
      </h2>

      <p className="mb-2 font-serif text-lg italic text-text-primary/60">
        Something went wrong
      </p>

      <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-text-primary/40">
        Failed to load songs. This might be a temporary issue — please try
        again.
      </p>

      <button
        onClick={reset}
        className={[
          "inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-bg-mid",
          "px-6 py-2.5 text-sm font-medium text-gold",
          "transition-all duration-150 hover:bg-gold/10 hover:border-gold/50",
        ].join(" ")}
      >
        Try again
      </button>
    </div>
  );
}
