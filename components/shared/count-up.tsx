"use client";

import { useEffect, useRef } from "react";

type CountUpProps = {
  end: number;
  suffix?: string;
  duration?: number;
};

export function CountUp({ end, suffix = "", duration = 1200 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = `${Math.round(end * eased)}${suffix}`;
          if (p < 1) requestAnimationFrame(tick);
        };
        el.textContent = `0${suffix}`;
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, suffix, duration]);

  return <span ref={ref}>{`${end}${suffix}`}</span>;
}
