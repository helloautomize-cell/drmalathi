"use client";

import { useState } from "react";
import { ServiceCard } from "@/components/cards/service-card";
import { WeekRail, type RailItem } from "@/components/home/week-rail";
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

const railItems: RailItem[] = services
  .filter((service) => service.weeks)
  .sort(
    (a, b) =>
      (a.weeks?.start ?? 0) - (b.weeks?.start ?? 0) ||
      (a.weeks?.end ?? 99) - (b.weeks?.end ?? 99)
  )
  .map((service) => ({
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

  return (
    <>
      {SHOW_DRAFT_WEEK_WINDOWS ? (
        <WeekRail items={railItems} anchorPrefix="service" />
      ) : null}

      <div
        role="group"
        aria-label="Filter services by type"
        className="mb-10 flex flex-wrap gap-2"
      >
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            aria-pressed={filter === chip.id}
            onClick={() => setFilter(chip.id)}
            className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              filter === chip.id
                ? "border-primary bg-primary text-white"
                : "border-rose-tint bg-white text-ink hover:bg-blush"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="space-y-14">
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
