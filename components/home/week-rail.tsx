"use client";

import { useState, type Dispatch, type MouseEvent, type SetStateAction } from "react";
import { WeekChip } from "@/components/home/week-chip";
import type { ServiceKind, WeekWindow } from "@/data/services";

export type RailItem = {
  slug: string;
  name: string;
  shortLabel: string;
  kind: ServiceKind;
  weeks: WeekWindow;
};

const RANGE_START = 6;
const RANGE_END = 36;
const pct = (week: number) =>
  ((week - RANGE_START) / (RANGE_END - RANGE_START)) * 100;
const spanPct = (weeks: number) => (weeks / (RANGE_END - RANGE_START)) * 100;
const WEEK_TICKS = [6, 12, 18, 24, 30, 36];
const TRIMESTERS = [
  { label: "Trimester 1", start: 6, end: 13 },
  { label: "Trimester 2", start: 14, end: 27 },
  { label: "Trimester 3", start: 28, end: 36 },
];
const LANE_TOP: Record<string, number> = {
  "viability-scan": 54,
  "downs-screening-oscar": 54,
  "anomaly-scan": 54,
  "growth-scan-doppler": 54,
  "first-trimester-anomaly-scan": 102,
  "fetal-echo": 102,
  nipt: 150,
};

function scrollToCard(prefix: string, slug: string) {
  const card = document.getElementById(`${prefix}-${slug}`);
  if (!card) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  history.replaceState(null, "", `#${prefix}-${slug}`);
}

export function WeekRail({
  items,
  activeSlug,
  setActiveSlug,
  anchorPrefix = "home-service",
}: {
  items: RailItem[];
  /** Optional controlled active state; falls back to internal state. */
  activeSlug?: string | null;
  setActiveSlug?: Dispatch<SetStateAction<string | null>>;
  /** Id prefix of the card each bar scrolls to, e.g. "service" -> #service-slug. */
  anchorPrefix?: string;
}) {
  const [internalActive, setInternalActive] = useState<string | null>(null);
  const active = activeSlug !== undefined ? activeSlug : internalActive;
  const setActive = setActiveSlug ?? setInternalActive;

  const onBarClick = (slug: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActive(slug);
    scrollToCard(anchorPrefix, slug);
  };

  return (
    <div className="mb-10 rounded-2xl border border-rose-tint bg-white p-4 shadow-soft sm:p-6">
      <div className="overflow-x-auto pb-2">
        <div
          className="relative h-[224px] min-w-[760px]"
          role="group"
          aria-label="Scan timing by pregnancy week, weeks 6 to 36"
        >
          {TRIMESTERS.map((trimester) => (
            <span
              key={trimester.label}
              aria-hidden="true"
              className="absolute top-0 text-xs font-semibold text-ink-muted"
              style={{
                left: `${pct(trimester.start)}%`,
                width: `${spanPct(trimester.end - trimester.start)}%`,
                textAlign: "center",
              }}
            >
              {trimester.label}
            </span>
          ))}

          {[14, 28].map((week) => (
            <span
              key={week}
              aria-hidden="true"
              className="absolute top-7 bottom-9 w-px bg-border"
              style={{ left: `${pct(week)}%` }}
            />
          ))}

          {items.map((item) => {
            const isBloodTest = item.kind === "blood-test";
            const isOpenEnded = item.weeks.end === undefined;
            const isActive = active === item.slug;
            const laneTop = LANE_TOP[item.slug] ?? 54;
            const width = spanPct(
              (item.weeks.end ?? RANGE_END) - item.weeks.start
            );

            return (
              <a
                key={item.slug}
                href={`#${anchorPrefix}-${item.slug}`}
                aria-label={`${item.name}, ${
                  item.weeks.end
                    ? `${item.weeks.start} to ${item.weeks.end} weeks`
                    : `From ${item.weeks.start} weeks`
                }`}
                onClick={onBarClick(item.slug)}
                onMouseEnter={() => setActive(item.slug)}
                onMouseLeave={(event) => {
                  if (document.activeElement !== event.currentTarget) {
                    setActive(null);
                  }
                }}
                onFocus={() => setActive(item.slug)}
                onBlur={() => setActive(null)}
                className={`group absolute flex min-h-11 items-center rounded-full border px-3 text-xs font-semibold whitespace-nowrap transition-shadow focus-visible:outline-none ${
                  isBloodTest
                    ? "border-teal/20 bg-teal-tint text-teal"
                    : "border-primary/15 bg-rose-tint text-plum"
                } ${isActive ? "ring-2 ring-primary ring-offset-2" : ""}`}
                style={{
                  left: `${pct(item.weeks.start)}%`,
                  width: `${width}%`,
                  top: laneTop,
                  ...(isOpenEnded
                    ? {
                        background:
                          "linear-gradient(90deg, var(--color-teal-tint) 0%, var(--color-teal-tint) 68%, rgb(230 244 243 / 0.16) 94%, transparent 100%)",
                      }
                    : {}),
                }}
              >
                <span className="relative z-10 truncate">{item.shortLabel}</span>
                {isOpenEnded ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-[6px] border-l-[9px] border-y-transparent border-l-teal"
                  />
                ) : null}
                <span className="pointer-events-none absolute top-[-3rem] left-1/2 z-20 hidden -translate-x-1/2 group-hover:inline-flex group-focus-visible:inline-flex">
                  <WeekChip weeks={item.weeks} />
                </span>
              </a>
            );
          })}

          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-[202px] h-px bg-ink-muted/40"
          />
          {WEEK_TICKS.map((week) => (
            <span
              key={week}
              aria-hidden="true"
              className="absolute top-[194px] -translate-x-1/2 text-xs font-semibold text-ink-muted"
              style={{ left: `${pct(week)}%` }}
            >
              <span className="mx-auto mb-1 block h-2 w-px bg-ink-muted/50" />
              {week}w
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-ink-muted">
        <span className="inline-flex min-h-11 items-center gap-2">
          <span className="size-3 rounded-full bg-rose-tint ring-1 ring-primary/20" />
          Scan
        </span>
        <span className="inline-flex min-h-11 items-center gap-2">
          <span className="size-3 rounded-full bg-teal-tint ring-1 ring-teal/20" />
          Blood test
        </span>
      </div>
      <p className="text-xs text-ink-muted">
        Weeks are a general guide. Your doctor will advise what is right for you.
      </p>
    </div>
  );
}
