"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { WeekChip } from "@/components/home/week-chip";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Label } from "@/components/ui/label";
import { scanStages } from "@/data/scan-schedule";
import { services } from "@/data/services";
import { site } from "@/data/site";

export function ScanFinder() {
  const [stageId, setStageId] = useState("");
  const stage = scanStages.find((s) => s.id === stageId);
  const whatsappText = encodeURIComponent(
    stage
      ? `Hello, I am ${stage.label.toLowerCase()} into my pregnancy and would like to book a scan.`
      : "Hello, I would like to book a scan."
  );

  return (
    <div className="rounded-3xl bg-white p-5 text-ink shadow-card md:rounded-2xl sm:p-6">
      <h2 className="text-[19px]/[26px] font-semibold text-ink md:text-xl">
        Which scan do I need?
      </h2>
      <p className="mt-1 hidden text-sm text-muted-foreground md:block">
        Choose your stage to see the scans usually offered at that time.
      </p>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="scan-stage">How far along are you?</Label>
        <div className="relative">
          <select
            id="scan-stage"
            value={stageId}
            onChange={(e) => {
              const id = e.target.value;
              setStageId(id);
              try {
                sessionStorage.setItem("fmc-scan-stage", id);
              } catch {
                // storage unavailable; rail simply won't reflect the stage
              }
              window.dispatchEvent(
                new CustomEvent("fmc:scan-stage", { detail: id })
              );
            }}
            className="h-12 w-full appearance-none rounded-lg border border-input bg-white py-2 pr-10 pl-3 text-base text-ink transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:h-11 md:text-sm"
          >
            <option value="" disabled>
              Select your stage
            </option>
            {scanStages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} ({s.hint})
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>

      <p className="mt-3 text-sm/[20px] text-ink-muted md:hidden">
        Not sure of your dates?{" "}
        <a
          href={site.phones[0].href}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Call us
        </a>{" "}
        and we will guide you.
      </p>

      <div aria-live="polite" className="mt-4">
        {stage ? (
          <>
            {/* Mobile: compact ListRows with WeekChip + chevron. */}
            <ul className="divide-y divide-rose-tint rounded-2xl border border-rose-tint md:hidden">
              {stage.scans.map(({ slug, when }) => {
                const service = services.find((s) => s.slug === slug);
                if (!service) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/services/${slug}`}
                      className="flex min-h-14 items-center gap-3 px-4 py-3 focus-visible:bg-blush"
                    >
                      <span className="min-w-0 flex-1 text-base/[26px] font-semibold text-ink">
                        {service.name}
                      </span>
                      {service.weeks ? (
                        <WeekChip weeks={service.weeks} />
                      ) : (
                        <span className="text-[13px]/[20px] text-ink-muted">
                          {when}
                        </span>
                      )}
                      <ChevronRight
                        className="size-4 shrink-0 text-ink-muted"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* Desktop: icon rows, unchanged. */}
            <ul className="hidden divide-y divide-border rounded-xl border border-border md:block">
              {stage.scans.map(({ slug, when }) => {
                const service = services.find((s) => s.slug === slug);
                if (!service) return null;
                const Icon = service.icon;
                return (
                  <li key={slug}>
                    <Link
                      href={`/services/${slug}`}
                      className="group flex items-center gap-3 px-3 py-2.5 hover:bg-blush focus-visible:bg-blush"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-tint text-primary">
                        <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink">
                          {service.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {when}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {stage.note}
            </p>
          </>
        ) : (
          <p className="hidden rounded-xl bg-blush px-3 py-2.5 text-xs text-muted-foreground md:block">
            Not sure of your dates? Call us and our team will guide you.
          </p>
        )}
      </div>

      {/* Mobile: one primary action whose label follows the selection. */}
      <div className="mt-4 md:hidden">
        <BookingCta
          source="scan-finder"
          service={stage?.scans[0]?.slug}
          label={stage ? "Book this scan" : "Book appointment"}
          size="lg"
          className="w-full"
        />
      </div>
      <div className="mt-4 hidden gap-2 sm:grid-cols-2 md:grid">
        <BookingCta
          source="scan-finder"
          service={stage?.scans[0]?.slug}
          label="Book appointment"
          size="lg"
          className="w-full"
        />
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          className="border-teal text-teal hover:bg-teal-tint hover:text-teal"
          render={
            <a
              href={`${site.whatsapp.href}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <WhatsAppIcon aria-hidden="true" />
          WhatsApp us
        </Button>
      </div>
      <p className="mt-3 text-xs leading-snug text-muted-foreground md:text-[11px]">
        Timing is a general guide. Your obstetrician will advise what is right
        for you.
      </p>
    </div>
  );
}
