"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";

type TocItem = { id: string; text: string };

/** Sticky "In this guide" sidebar with scrollspy, desktop only. */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="In this guide" className="sticky top-24">
      <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
        In this guide
      </p>
      <ul className="mt-3 space-y-1 border-l-2 border-rose-tint">
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
