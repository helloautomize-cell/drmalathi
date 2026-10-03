"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ServiceCard } from "@/components/cards/service-card";
import { MobileIconTile } from "@/components/cards/mobile-cards";
import { WeekChip } from "@/components/home/week-chip";
import { WeekRail, type RailItem } from "@/components/home/week-rail";
import { WeekRailCompact } from "@/components/home/week-rail-compact";
import { SectionHeader } from "@/components/shared/section-header";
import {
  serviceCategories,
  services,
  servicesByCategory,
  SHOW_DRAFT_WEEK_WINDOWS,
  type ServiceCategoryId,
} from "@/data/services";

const SHORT_LABELS: Record<string, string> = {
  "viability-scan": "Viability",
  nipt: "NIPT",
  "downs-screening-oscar": "OSCAR",
  "first-trimester-anomaly-scan": "Early anomaly",
  "anomaly-scan": "Anomaly",
  "fetal-echo": "Fetal echo",
  "growth-scan-doppler": "Growth + Doppler",
};

const timedServices = services
  .filter((service) => service.weeks)
  .sort(
    (a, b) =>
      (a.weeks?.start ?? 0) - (b.weeks?.start ?? 0) ||
      (a.weeks?.end ?? 99) - (b.weeks?.end ?? 99)
  );

const railItems: RailItem[] = timedServices.map((service) => ({
  slug: service.slug,
  name: service.name,
  shortLabel: SHORT_LABELS[service.slug] ?? service.name,
  kind: service.kind,
  weeks: service.weeks as RailItem["weeks"],
}));

type Filter = "all" | ServiceCategoryId;

const chips: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...serviceCategories.map((c) => ({ id: c.id, label: c.label })),
];

export function ServiceBrowser() {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleCategories = serviceCategories.filter(
    (category) => filter === "all" || filter === category.id
  );

  return (
    <>
      {SHOW_DRAFT_WEEK_WINDOWS ? (
        <>
          {/* Mobile: compact vertical rail linking to each row. */}
          <WeekRailCompact items={timedServices} />
          {/* Desktop: horizontal week rail, unchanged. */}
          <div className="hidden md:block">
            <WeekRail items={railItems} anchorPrefix="service" />
          </div>
        </>
      ) : null}

      {/* Filter chips: sticky under the header below md, inline at md+. */}
      <div
        role="group"
        aria-label="Filter services by type"
        className="mb-6 flex gap-2 max-md:sticky max-md:top-[60px] max-md:z-30 max-md:-mx-4 max-md:overflow-x-auto max-md:border-b max-md:border-rose-tint max-md:bg-white/95 max-md:px-4 max-md:py-2 max-md:backdrop-blur max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:mb-10 md:flex-wrap"
      >
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            aria-pressed={filter === chip.id}
            onClick={() => setFilter(chip.id)}
            className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
              filter === chip.id
                ? "border-primary bg-primary text-white"
                : "border-rose-tint bg-white text-ink hover:bg-blush"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Mobile: ListRows grouped by category. */}
      <div className="space-y-6 md:hidden">
        {visibleCategories.map((category) => (
          <section key={category.id} aria-label={category.label}>
            <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              {category.label}
            </p>
            <div className="divide-y divide-rose-tint rounded-2xl border border-rose-tint bg-white px-3 shadow-soft">
              {servicesByCategory(category.id).map((service) => (
                <Link
                  key={service.slug}
                  id={`service-${service.slug}`}
                  href={`/services/${service.slug}`}
                  className="flex min-h-14 scroll-mt-24 items-center gap-3 py-3 focus-visible:bg-blush"
                >
                  <MobileIconTile
                    icon={service.icon}
                    tone={service.kind === "blood-test" ? "blood" : "scan"}
                  />
                  <span className="min-w-0 flex-1 text-base/[26px] font-semibold text-ink">
                    {service.name}
                  </span>
                  {service.weeks ? (
                    <WeekChip weeks={service.weeks} />
                  ) : (
                    <span className="shrink-0 text-[13px]/[20px] text-ink-muted">
                      As advised
                    </span>
                  )}
                  <ChevronRight
                    className="size-4 shrink-0 text-ink-muted"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Desktop: card grid grouped by category, unchanged. */}
      <div className="hidden space-y-14 md:block">
        {serviceCategories.map((category) => (
          <section
            key={category.id}
            aria-label={category.label}
            hidden={filter !== "all" && filter !== category.id}
          >
            <SectionHeader
              align="left"
              title={category.label}
              subtitle={category.blurb}
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {servicesByCategory(category.id).map((service) => (
                <div
                  key={service.slug}
                  id={`service-${service.slug}`}
                  className="h-full scroll-mt-24"
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
