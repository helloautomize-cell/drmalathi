"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "cn";

export function MobileCarousel({
  items,
  label,
  className,
  itemClassName,
}: {
  items: ReactNode[];
  label: string;
  className?: string;
  itemClassName?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function updateActive() {
    const rail = railRef.current;
    if (!rail) return;
    const children = Array.from(rail.children) as HTMLElement[];
    const nearest = children.reduce(
      (best, child, index) => {
        const distance = Math.abs(child.offsetLeft - rail.scrollLeft - 16);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY }
    );
    setActive(nearest.index);
  }

  return (
    <div
      className={cn(
        "mobile-carousel-shell min-w-0 max-w-full overflow-hidden md:overflow-visible",
        className
      )}
    >
      <div
        ref={railRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={updateActive}
        className="mobile-carousel grid snap-x snap-mandatory auto-cols-[85%] grid-flow-col items-stretch gap-3 overflow-x-auto pb-2 scroll-px-4 md:contents md:overflow-visible md:pb-0"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn("h-full snap-start [&>*]:h-full", itemClassName)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
        {items.map((_, index) => (
          <span
            key={index}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              index === active ? "bg-primary" : "bg-rose-tint"
            )}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Card {active + 1} of {items.length}
      </p>
    </div>
  );
}
