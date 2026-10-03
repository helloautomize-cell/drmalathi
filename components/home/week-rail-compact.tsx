import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { WeekChip } from "@/components/home/week-chip";
import type { Service } from "@/data/services";

const SHORT_LABELS: Record<string, string> = {
  "viability-scan": "Viability",
  nipt: "NIPT",
  "downs-screening-oscar": "OSCAR",
  "first-trimester-anomaly-scan": "FTAS",
  "anomaly-scan": "Anomaly",
  "fetal-echo": "Fetal echo",
  "growth-scan-doppler": "Growth + Doppler",
};

const RANGE_START = 6;
const RANGE_END = 36;
const pct = (week: number) =>
  Math.min(100, Math.max(0, ((week - RANGE_START) / (RANGE_END - RANGE_START)) * 100));
const spanPct = (weeks: number) =>
  Math.min(100, (weeks / (RANGE_END - RANGE_START)) * 100);

/** Compact vertical week rail for mobile: name, mini window bar, chip. */
export function WeekRailCompact({ items }: { items: Service[] }) {
  return (
    <nav aria-label="Scan timing by pregnancy week" className="mb-6 md:hidden">
      <ul className="divide-y divide-rose-tint rounded-2xl border border-rose-tint bg-white px-4 shadow-soft">
        {items.map((service) => {
          const blood = service.kind === "blood-test";
          const start = service.weeks?.start ?? RANGE_START;
          const end = service.weeks?.end ?? RANGE_END;
          return (
            <li key={service.slug}>
              <Link
                href={`#home-service-${service.slug}`}
                className="flex min-h-14 items-center gap-3 py-3 focus-visible:bg-blush"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base/[26px] font-semibold text-ink">
                    {SHORT_LABELS[service.slug] ?? service.name}
                  </span>
                  <span
                    className="relative mt-1 block h-1.5 w-24 overflow-hidden rounded-full bg-plum/10"
                    aria-hidden="true"
                  >
                    <span
                      className={`absolute inset-y-0 rounded-full ${blood ? "bg-teal" : "bg-primary"}`}
                      style={{
                        left: `${pct(start)}%`,
                        width: `${Math.max(8, spanPct(end - start))}%`,
                      }}
                    />
                  </span>
                </span>
                {service.weeks ? <WeekChip weeks={service.weeks} /> : null}
                <ChevronRight
                  className="size-4 shrink-0 text-ink-muted"
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
