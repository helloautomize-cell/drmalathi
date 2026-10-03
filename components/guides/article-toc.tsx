"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

type TocItem = { id: string; text: string };

/** Sticky "In this guide" sidebar with scrollspy, desktop only. */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;

    // Last heading above the fold line wins, in both scroll directions.
    // At the bottom of the page the final section stays active.
    const update = () => {
      const line = window.scrollY + 128;
      let current: string | null = null;
      for (const h of headings) {
        const top = h.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = h.id;
        else break;
      }
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = headings[headings.length - 1].id;
      }
      setActive(current);
    };

    update();
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items]);

  // Keep the highlighted item inside the scrollable list's visible area.
  useEffect(() => {
    if (!active) return;
    listRef.current
      ?.querySelector(`a[href="#${CSS.escape(active)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="In this guide" className="sticky top-24">
      <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
        In this guide
      </p>
      <ul
        ref={listRef}
        className="mt-3 max-h-[calc(100dvh-11rem)] space-y-1 overflow-y-auto border-l-2 border-rose-tint"
      >
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-0.5 block border-l-2 py-1.5 pl-4 text-sm/[20px] transition-colors",
                active === item.id
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-ink-muted hover:text-ink"
              )}
              aria-current={active === item.id ? "location" : undefined}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Collapsible TOC shown under the cover on mobile, closed by default. */
export function MobileToc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <details className="group mt-6 rounded-2xl border border-rose-tint bg-white lg:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
        In this guide
        <span
          aria-hidden="true"
          className="text-primary transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <nav aria-label="In this guide" className="border-t border-rose-tint px-4 py-3">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block py-3 text-base/[26px] text-ink"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
