"use client";

import { useEffect, useRef } from "react";

/**
 * 2px reading progress line pinned under the 60px sticky header on mobile.
 * Uses a ref to avoid re-rendering on every scroll event.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="fixed top-[60px] right-0 left-0 z-40 h-0.5 bg-rose-tint md:hidden"
      aria-hidden="true"
    >
      <div ref={barRef} className="h-full bg-primary transition-[width] duration-75" />
    </div>
  );
}
