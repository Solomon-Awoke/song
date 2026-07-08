"use client";

import { useRef, useCallback, useState, useEffect } from "react";

interface UseAutoScrollReturn {
  isScrolling: boolean;
  speed: number;
  startScroll: () => void;
  stopScroll: () => void;
  setSpeed: (speed: number) => void;
}

export function useAutoScroll(
  containerRef: React.RefObject<HTMLDivElement | null>
): UseAutoScrollReturn {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsScrolling(false);
  }, []);

  const startScroll = useCallback(() => {
    if (!containerRef.current) return;
    setIsScrolling(true);

    intervalRef.current = setInterval(() => {
      if (!containerRef.current) {
        stopScroll();
        return;
      }

      const el = containerRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;

      if (el.scrollTop >= maxScroll - 5) {
        stopScroll();
        return;
      }

      el.scrollTop += speed;
    }, 30);
  }, [containerRef, speed, stopScroll]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { isScrolling, speed, startScroll, stopScroll, setSpeed };
}
