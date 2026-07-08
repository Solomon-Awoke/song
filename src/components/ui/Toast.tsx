"use client";

import { type ReactNode, useEffect, useState, useCallback } from "react";

interface ToastData {
  id: string;
  message: string;
  type?: "success" | "info";
}

interface ToastProviderProps {
  children: (props: { showToast: (message: string, type?: "success" | "info") => void }) => ReactNode;
}

let toastListener: ((data: ToastData) => void) | null = null;

/**
 * Imperative show function — call from anywhere without hook constraints.
 * Only works when a ToastProvider is mounted.
 */
export function showToast(message: string, type?: "success" | "info") {
  toastListener?.({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, message, type });
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState(false);

  const handleShow = useCallback((data: ToastData) => {
    setToast(data);
    setVisible(true);
    // Auto-dismiss after 3s
    setTimeout(() => {
      setVisible(false);
      // Clear toast after animation
      setTimeout(() => setToast(null), 300);
    }, 3000);
  }, []);

  // Register/unregister the imperative listener
  useEffect(() => {
    toastListener = handleShow;
    return () => {
      toastListener = null;
    };
  }, [handleShow]);

  return (
    <>
      {children({ showToast: (message, type) => handleShow({ id: `${Date.now()}`, message, type }) })}

      {/* Toast portal — rendered at the end of the provider tree */}
      {toast && (
        <div
          className={[
            "fixed bottom-6 right-6 z-[100] max-w-sm",
            "transition-all duration-300 ease-out",
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          ].join(" ")}
          role="status"
          aria-live="polite"
        >
          <div
            className={[
              "flex items-center gap-3 rounded-lg border px-5 py-3 shadow-xl shadow-black/30",
              "backdrop-blur-md",
              toast.type === "info"
                ? "border-gold/30 bg-bg-mid/95 text-gold-light"
                : "border-gold/40 bg-bg-mid/95 text-gold-light",
            ].join(" ")}
          >
            {/* Icon */}
            <span className="flex-shrink-0" aria-hidden="true">
              {toast.type === "info" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </span>

            {/* Message */}
            <p className="text-sm font-medium">{toast.message}</p>

            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                setVisible(false);
                setTimeout(() => setToast(null), 300);
              }}
              className="ml-auto flex-shrink-0 rounded-full p-1 text-text-primary/50 transition-colors hover:text-gold"
              aria-label="Dismiss"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
