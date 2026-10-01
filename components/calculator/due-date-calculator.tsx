"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, CalendarCheck } from "lucide-react";
import { BrandImage } from "@/components/shared/brand-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scanStages } from "@/data/scan-schedule";
import { services } from "@/data/services";

const DAY_MS = 86_400_000;

export function DueDateCalculator() {
  const [lmp, setLmp] = useState("");

  const result = useMemo(() => {
    if (!lmp) return null;
    const start = new Date(`${lmp}T00:00:00`);
    if (Number.isNaN(start.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.floor((today.getTime() - start.getTime()) / DAY_MS);
    if (days < 0 || days > 320) return { error: true as const };
    const weeks = Math.floor(days / 7);
    const extraDays = days % 7;
    const due = new Date(start.getTime() + 280 * DAY_MS);
    const stage = scanStages.find(
      (s) => s.weeks && weeks >= s.weeks[0] && weeks <= s.weeks[1]
    );
    return {
      due: due.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      weeks,
      extraDays,
      stage,
    };
  }, [lmp]);

  const maxDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="rounded-2xl border border-rose-tint bg-white p-6 shadow-card sm:p-8">
      <div className="space-y-1.5">
        <Label htmlFor="lmp">First day of your last period</Label>
        <Input
          id="lmp"
          type="date"
          value={lmp}
          max={maxDate}
          onChange={(e) => setLmp(e.target.value)}
          className="h-11 bg-white"
        />
      </div>

      <div aria-live="polite" className="mt-6">
        {result && !("error" in result) ? (
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-xl bg-rose-tint p-5 pr-28">
              <BrandImage
                slug="baby-overhead"
                variant="circle"
                decorative
                reveal={false}
                sizes="88px"
                className="absolute top-1/2 right-4 w-22 -translate-y-1/2 shadow-soft"
              />
              <p className="flex items-center gap-2 text-sm font-semibold text-plum">
                <CalendarDays className="size-4" aria-hidden="true" />
                Estimated due date
              </p>
              <p className="mt-1 text-2xl font-semibold text-ink">
                {result.due}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                You are about {result.weeks} weeks and {result.extraDays} days
                along.
              </p>
            </div>

            {result.stage ? (
              <div>
                <p className="text-sm font-semibold text-ink">
                  Scans usually due around now ({result.stage.label})
                </p>
                <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
                  {result.stage.scans.map(({ slug, when }) => {
                    const service = services.find((s) => s.slug === slug);
                    if (!service) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/services/${slug}`}
                          className="group flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-blush"
                        >
                          <span>
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
                <p className="mt-3 text-xs text-muted-foreground">
                  {result.stage.note}
                </p>
              </div>
            ) : null}

            <Button
              size="lg"
              nativeButton={false}
              className="w-full bg-primary text-white hover:bg-primary-hover"
              render={<Link href="/contact" />}
            >
              <CalendarCheck aria-hidden="true" />
              Book an appointment
            </Button>
          </div>
        ) : result && "error" in result ? (
          <p className="rounded-xl bg-blush px-4 py-3 text-sm text-muted-foreground">
            Please enter a date within the last 10 months.
          </p>
        ) : (
          <p className="rounded-xl bg-blush px-4 py-3 text-sm text-muted-foreground">
            Enter your last period date to see your estimated due date and the
            scans usually due around now.
          </p>
        )}
      </div>
    </div>
  );
}
