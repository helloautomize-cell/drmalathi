"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";

export type ChipNavItem = { id: string; label: string };

/**
 * Sticky in-page section nav for long mobile pages. Sits under the 60px
 * header, highlights the section currently in view, and anchor-links to it.
 */
export function ChipNav({ items }: { items: ChipNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[60px] z-30 -mx-4 overflow-x-auto border-b border-rose-tint bg-white/95 px-4 py-2 backdrop-blur [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active === item.id ? "true" : undefined}
            className={cn(
              "min-h-11 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
              active === item.id
                ? "border-plum bg-plum text-white"
                : "border-rose-tint bg-white text-ink"
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
