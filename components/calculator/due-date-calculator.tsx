"use client";

import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Share2,
} from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { BrandImage } from "@/components/shared/brand-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { services, type Service } from "@/data/services";

const DAY_MS = 86_400_000;
const TERM_DAYS = 280; // 40 weeks
const MAX_GA_DAYS = 294; // 42 weeks

// DRAFT FOR MEDICAL REVIEW: dating formulas below follow standard obstetric
// practice (Naegele's rule, cycle-length adjustment, IVF day-of-transfer
// correction) and must be signed off by the medical team before launch.
function effectiveLmp(
  method: Method,
  lmp: string,
  cycleLength: number,
  conception: string,
  ivfTransfer: string,
  embryoDay: number
): Date | null {
  const day = (value: string) => {
    const d = new Date(`${value}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const shift = (d: Date, days: number) =>
    new Date(d.getTime() + days * DAY_MS);

  if (method === "lmp") {
    const start = day(lmp);
    return start ? shift(start, cycleLength - 28) : null;
  }
  if (method === "conception") {
    const start = day(conception);
    return start ? shift(start, -14) : null;
  }
  const start = day(ivfTransfer);
  return start ? shift(start, -14 - embryoDay) : null;
}

type Method = "lmp" | "conception" | "ivf";

const cycleOptions = Array.from({ length: 15 }, (_, i) => 21 + i);

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const icsDate = (d: Date) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`;

const icsEscape = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");

type TimelineEntry = {
  service: Service;
  start: Date;
  end: Date;
  openEnded: boolean;
  passed: boolean;
  current: boolean;
};

export function DueDateCalculator() {
  const [method, setMethod] = useState<Method>("lmp");
  const [lmp, setLmp] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [conception, setConception] = useState("");
  const [ivfTransfer, setIvfTransfer] = useState("");
  const [embryoDay, setEmbryoDay] = useState("5");

  const result = useMemo(() => {
    const raw =
      method === "lmp" ? lmp : method === "conception" ? conception : ivfTransfer;
    if (!raw) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const entered = new Date(`${raw}T00:00:00`);
    if (Number.isNaN(entered.getTime())) return null;
    if (entered.getTime() > today.getTime()) {
      return { error: "That date cannot be in the future." } as const;
    }

    const start = effectiveLmp(
      method,
      lmp,
      Number(cycleLength),
      conception,
      ivfTransfer,
      Number(embryoDay)
    );
    if (!start) return null;

    const gaDays = Math.floor((today.getTime() - start.getTime()) / DAY_MS);
    if (gaDays > MAX_GA_DAYS) {
      return {
        error:
          "That date is more than 42 weeks ago. Please check the date, or call us if you are unsure.",
      } as const;
    }

    const due = new Date(start.getTime() + TERM_DAYS * DAY_MS);
    const weeks = Math.floor(gaDays / 7);
    const days = gaDays % 7;
    const trimester = weeks < 14 ? 1 : weeks < 28 ? 2 : 3;
    const progress = Math.min(Math.max(gaDays / TERM_DAYS, 0), 1);

    const timeline: TimelineEntry[] = services
      .filter((s) => s.weeks)
      .sort(
        (a, b) =>
          (a.weeks?.start ?? 0) - (b.weeks?.start ?? 0) ||
          (a.weeks?.end ?? 99) - (b.weeks?.end ?? 99)
      )
      .map((service) => {
        const w = service.weeks as { start: number; end?: number };
        const openEnded = w.end === undefined;
        const windowStart = new Date(start.getTime() + w.start * 7 * DAY_MS);
        const windowEnd = openEnded
          ? due
          : new Date(start.getTime() + (w.end as number) * 7 * DAY_MS + 6 * DAY_MS);
        return {
          service,
          start: windowStart,
          end: windowEnd,
          openEnded,
          passed: windowEnd.getTime() < today.getTime(),
          current:
            windowStart.getTime() <= today.getTime() &&
            today.getTime() <= windowEnd.getTime(),
        };
      });

    return { due, weeks, days, trimester, progress, timeline } as const;
  }, [method, lmp, cycleLength, conception, ivfTransfer, embryoDay]);

  const maxDate = new Date().toISOString().slice(0, 10);

  function downloadIcs() {
    if (!result || "error" in result) return;
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//FMC Trichy//Due Date Calculator//EN",
      "CALSCALE:GREGORIAN",
    ];
    const event = (uid: string, summary: string, start: Date, end: Date) => {
      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}@fmctrichy`,
        `DTSTAMP:${icsDate(new Date())}T000000`,
        `DTSTART;VALUE=DATE:${icsDate(start)}`,
        `DTEND;VALUE=DATE:${icsDate(end)}`,
        `SUMMARY:${icsEscape(summary)}`,
        "END:VEVENT"
      );
    };
    event(
      "due-date",
      "Estimated due date",
      result.due,
      new Date(result.due.getTime() + DAY_MS)
    );
    result.timeline.forEach((entry) => {
      event(
        entry.service.slug,
        `${entry.service.name} window`,
        entry.start,
        new Date(entry.end.getTime() + DAY_MS)
      );
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fmc-trichy-scan-dates.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  const shareHref = result && !("error" in result)
    ? `https://wa.me/?text=${encodeURIComponent(
        `My estimated due date is ${formatDate(result.due)}, calculated with the due date calculator at Trichy Fetal Medicine and Fertility Centre.`
      )}`
    : undefined;

  return (
    <div className="rounded-2xl border border-rose-tint bg-white p-6 shadow-card sm:p-8">
      <Tabs value={method} onValueChange={(v) => setMethod(v as Method)}>
        <TabsList className="h-auto w-full flex-wrap">
          <TabsTrigger value="lmp" className="min-h-11 flex-1">
            Last period
          </TabsTrigger>
          <TabsTrigger value="conception" className="min-h-11 flex-1">
            Conception date
          </TabsTrigger>
          <TabsTrigger value="ivf" className="min-h-11 flex-1">
            IVF transfer
          </TabsTrigger>
        </TabsList>

        <div className="mt-5">
          <TabsContent value="lmp" className="space-y-4">
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
            <div className="space-y-1.5">
              <Label htmlFor="cycle">Cycle length</Label>
              <Select
                value={cycleLength}
                onValueChange={(v) => setCycleLength(v ?? "28")}
              >
                <SelectTrigger id="cycle" className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cycleOptions.map((days) => (
                    <SelectItem key={days} value={String(days)}>
                      {days} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="conception" className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="conception">Conception date</Label>
              <Input
                id="conception"
                type="date"
                value={conception}
                max={maxDate}
                onChange={(e) => setConception(e.target.value)}
                className="h-11 bg-white"
              />
              <p className="text-xs text-muted-foreground">
                The date the baby was conceived, if you know it.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="ivf" className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ivf-transfer">Embryo transfer date</Label>
              <Input
                id="ivf-transfer"
                type="date"
                value={ivfTransfer}
                max={maxDate}
                onChange={(e) => setIvfTransfer(e.target.value)}
                className="h-11 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="embryo-day">Embryo age at transfer</Label>
              <Select
                value={embryoDay}
                onValueChange={(v) => setEmbryoDay(v ?? "5")}
              >
                <SelectTrigger id="embryo-day" className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Day 3 embryo</SelectItem>
                  <SelectItem value="5">Day 5 embryo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </div>
      </Tabs>

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
                {formatDate(result.due)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                You are about {result.weeks} weeks and {result.days} days
                along, in trimester {result.trimester}.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
                <span>Pregnancy progress</span>
                <span>{result.weeks} of 40 weeks</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={result.weeks}
                aria-valuemin={0}
                aria-valuemax={40}
                aria-label="Pregnancy progress"
                className="mt-2 h-2.5 overflow-hidden rounded-full bg-rose-tint"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.round(result.progress * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-ink">
                Your scan timeline
              </p>
              <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
                {result.timeline.map((entry) => (
                  <li
                    key={entry.service.slug}
                    className={`px-3 py-2.5 ${
                      entry.passed ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span>
                        <span className="block text-sm font-semibold text-ink">
                          {entry.service.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {entry.openEnded
                            ? `From ${formatDate(entry.start)}`
                            : `${formatDate(entry.start)} to ${formatDate(
                                entry.end
                              )}`}
                        </span>
                      </span>
                      {entry.passed ? (
                        <span className="text-xs font-semibold text-ink-muted">
                          Window passed
                        </span>
                      ) : entry.current ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="rounded-full bg-teal-tint px-2 py-0.5 text-xs font-semibold text-teal">
                            In window now
                          </span>
                          <BookingCta
                            source="calculator"
                            service={entry.service.slug}
                            label="Book this scan"
                            variant="bare"
                            trigger={
                              <button
                                type="button"
                                className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
                              >
                                <CalendarCheck
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                                Book this scan
                              </button>
                            }
                          />
                        </span>
                      ) : (
                        <BookingCta
                          source="calculator"
                          service={entry.service.slug}
                          label="Book this scan"
                          variant="bare"
                          trigger={
                            <button
                              type="button"
                              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
                            >
                              <CalendarCheck
                                className="size-3.5"
                                aria-hidden="true"
                              />
                              Book this scan
                            </button>
                          }
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="flex-1 bg-primary text-white hover:bg-primary-hover"
                onClick={downloadIcs}
              >
                <CalendarPlus aria-hidden="true" />
                Add scan dates to calendar
              </Button>
              {shareHref ? (
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  className="flex-1 border-teal text-teal hover:bg-teal-tint hover:text-teal"
                  render={
                    <a
                      href={shareHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <Share2 aria-hidden="true" />
                  Share on WhatsApp
                </Button>
              ) : null}
            </div>
          </div>
        ) : result && "error" in result ? (
          <p className="rounded-xl bg-blush px-4 py-3 text-sm text-muted-foreground">
            {result.error}
          </p>
        ) : (
          <p className="rounded-xl bg-blush px-4 py-3 text-sm text-muted-foreground">
            Enter a date above to see your estimated due date and a personal
            scan timeline. Nothing you enter is stored or sent anywhere.
          </p>
        )}
      </div>
    </div>
  );
}
