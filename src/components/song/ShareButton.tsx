"use client";

import { useState, useCallback } from "react";
import { FiShare2, FiCheck, FiFacebook, FiTwitter } from "react-icons/fi";
import { showToast } from "@/components/ui/Toast";

interface ShareButtonProps {
  url: string;
  titleAm: string;
  titleEn?: string;
}

export default function ShareButton({ url, titleAm, titleEn }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const shareText = `${titleAm}${titleEn ? ` — ${titleEn}` : ""} — የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን መንፈሳዊ መዝሙራት`;
  const encodedText = encodeURIComponent(shareText);

  const handleWebShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: titleAm,
          text: shareText,
          url,
        });
        return;
      } catch (err: unknown) {
        // User cancelled or the API failed — fall through to fallback
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    // Fallback: copy URL
    await handleCopyLink();
  }, [url, titleAm, shareText]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("Link copied!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      showToast("Link copied!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const handleFacebookShare = useCallback(() => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      "_blank",
      "noopener,noreferrer,width=600,height=500",
    );
    setShowMenu(false);
  }, [encodedUrl, encodedText]);

  const handleTwitterShare = useCallback(() => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400",
    );
    setShowMenu(false);
  }, [encodedUrl, encodedText]);

  return (
    <div className="relative inline-flex">
      {/* Main share button */}
      <button
        type="button"
        onClick={() => {
          if (showMenu) {
            setShowMenu(false);
          } else {
            // On mobile, try Web Share API directly first
            if (typeof navigator.share === "function") {
              handleWebShare();
            } else {
              setShowMenu(true);
            }
          }
        }}
        className={[
          "inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium",
          "transition-all duration-150",
          copied
            ? "border-success/50 bg-success/10 text-success"
            : "border-gold/20 bg-bg-mid/50 text-text-primary/70 hover:border-gold/50 hover:text-gold",
        ].join(" ")}
        aria-label={copied ? "Link copied" : "Share"}
        aria-expanded={showMenu}
      >
        {copied ? (
          <FiCheck size="16" aria-hidden="true" />
        ) : (
          <FiShare2 size="16" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
      </button>

      {/* Dropdown menu (desktop fallback) */}
      {showMenu && (
        <>
          {/* Backdrop to close menu */}
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setShowMenu(false)}
            aria-label="Close share menu"
          />

          <div className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-gold/20 bg-bg-mid shadow-xl shadow-black/30 backdrop-blur-md">
            {/* Copy link */}
            <button
              type="button"
              onClick={() => {
                handleCopyLink();
                setShowMenu(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text-primary/80 transition-colors hover:bg-gold/10 hover:text-gold"
            >
              <FiShare2 size="16" className="text-gold/70" aria-hidden="true" />
              Copy Link
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={handleFacebookShare}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text-primary/80 transition-colors hover:bg-gold/10 hover:text-gold"
            >
              <FiFacebook size="16" className="text-gold/70" aria-hidden="true" />
              Facebook
            </button>

            {/* Twitter / X */}
            <button
              type="button"
              onClick={handleTwitterShare}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text-primary/80 transition-colors hover:bg-gold/10 hover:text-gold"
            >
              <FiTwitter size="16" className="text-gold/70" aria-hidden="true" />
              Twitter / X
            </button>
          </div>
        </>
      )}
    </div>
  );
}
