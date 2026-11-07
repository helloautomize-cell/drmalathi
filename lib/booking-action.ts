"use server";

import { randomInt } from "node:crypto";
import {
  addDays,
  bookingSchema,
  istDateString,
  QR_SOURCES,
  CONSENT_VERSION,
} from "@/lib/booking-schema";
import {
  bookSlot,
  getAvailability,
  sheetsConfigured,
  type AvailabilityResult,
  type BookResult,
  type DayView,
} from "@/lib/google-sheets";
import {
  slotLabel,
  standardSlotStarts,
  STANDARD_SLOT_CAPACITY,
  STANDARD_SLOT_DAYS,
} from "@/data/booking-options";

const MIN_SUBMIT_MS = 3000;
const MAX_AVAILABILITY_DAYS = 14;

/**
 * Server actions behind every booking surface: /book, the appointment
 * sheet and the callback forms. Validation runs here again with the shared
 * zod schema; slot checks and abuse limits live in the Apps Script under a
 * lock so two tabs can never take the last place in a slot. The built-in
 * Next.js Origin check on server actions stays untouched.
 */

export type SlotsResult = AvailabilityResult | { ok: false; offline: true };

/**
 * Availability for `days` days starting at `from` (YYYY-MM-DD). Returns
 * { ok: false, offline: true } when the Sheet cannot be reached so the
 * form can show the calm call-us notice instead of dead slot buttons.
 */
export async function getSlots(from: string, days: number): Promise<SlotsResult> {
  const n = Math.max(1, Math.min(MAX_AVAILABILITY_DAYS, Math.floor(days) || 1));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) return { ok: false, offline: true };
  if (!sheetsConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      return devAvailability(from, n);
    }
    return { ok: false, offline: true };
  }
  try {
    const res = await getAvailability(from, n);
    return res.ok ? res : { ok: false, offline: true };
  } catch {
    return { ok: false, offline: true };
  }
}

export type SubmitResult =
  | {
      ok: true;
      /** Present only when a row was actually written; silent accepts
          (honeypot, too fast) come back ok with no bookingId. */
      bookingId?: string;
      mobile?: string;
      date?: string;
      slotLabel?: string;
      visitType?: string;
      reason?: string;
    }
  | {
      ok: false;
      reason: "slot_unavailable" | "duplicate" | "limit" | "failed";
    };

export async function submitBooking(formData: FormData): Promise<SubmitResult> {
  // 1. Honeypot: silently accept so bots do not retry or adapt.
  if (formData.get("website_url2")) {
    return { ok: true };
  }

  // 2. Minimum fill time: under three seconds is treated like the honeypot.
  const startedAt = String(formData.get("startedAt") ?? "");
  const started = Date.parse(startedAt);
  if (!startedAt || Number.isNaN(started) || Date.now() - started < MIN_SUBMIT_MS) {
    return { ok: true };
  }

  // 3. Normalise + validate with the shared schema.
  const parsed = bookingSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    mobile: String(formData.get("mobile") ?? ""),
    visitType: String(formData.get("visitType") ?? ""),
    reason: String(formData.get("reason") ?? ""),
    date: String(formData.get("date") ?? ""),
    slotStart: String(formData.get("slotStart") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
    source: mapSource(String(formData.get("source") ?? "unknown")),
  });
  if (!parsed.success) {
    return { ok: false, reason: "failed" };
  }
  const data = parsed.data;

  const id = bookingId();

  if (!sheetsConfigured()) {
    // Local/dev convenience only; production without env fails closed.
    if (process.env.NODE_ENV !== "production") {
      const endHour = Number(data.slotStart.slice(0, 2)) + 1;
      const end = `${String(endHour).padStart(2, "0")}:${data.slotStart.slice(3)}`;
      return {
        ok: true,
        bookingId: "bk_dev0000",
        mobile: data.mobile,
        date: data.date,
        slotLabel: slotLabel(data.slotStart, end),
        visitType: data.visitType,
        reason: data.reason,
      };
    }
    return { ok: false, reason: "failed" };
  }

  // 4. Hand the booking to the Apps Script, which checks the slot under a
  //    lock and writes the row. Codes map to the form's calm messages.
  let result: BookResult;
  try {
    result = await bookSlot({
      id,
      source: data.source,
      name: data.name,
      mobile: data.mobile,
      visitType: data.visitType,
      reason: data.reason,
      date: data.date,
      slotStart: data.slotStart,
      notes: data.notes,
      consent: CONSENT_VERSION,
    });
  } catch {
    return { ok: false, reason: "failed" };
  }

  if (result.ok) {
    return {
      ok: true,
      bookingId: id,
      mobile: data.mobile,
      date: data.date,
      slotLabel: result.slot,
      visitType: data.visitType,
      reason: data.reason,
    };
  }
  if (result.code === "slot_full" || result.code === "slot_closed") {
    return { ok: false, reason: "slot_unavailable" };
  }
  if (result.code === "duplicate") {
    return { ok: false, reason: "duplicate" };
  }
  if (result.code === "limit") {
    return { ok: false, reason: "limit" };
  }
  return { ok: false, reason: "failed" };
}

/**
 * Sources are code-defined, never trusted from the URL: the QR locations
 * pass through as-is and every website form source is namespaced with the
 * `website-` prefix so Sheet rows can tell QR scans from site traffic.
 */
function mapSource(raw: string): string {
  const v = raw.trim().toLowerCase().slice(0, 40);
  // The on-site QR card submits src=website; store it as website-qr so its
  // rows are distinguishable from the typed website form sources.
  if (v === "website") return "website-qr";
  if ((QR_SOURCES as readonly string[]).includes(v)) return v;
  if (!v || v === "unknown") return "unknown";
  return v.startsWith("website-") ? v : `website-${v}`;
}

function bookingId(): string {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  let id = "bk_";
  for (let i = 0; i < 8; i++) id += alphabet[randomInt(36)];
  return id;
}

/**
 * Development fallback when the Sheets env is not configured: every
 * standard weekday slot shows open with full capacity so the whole flow
 * can be exercised locally. Never used in production.
 */
function devAvailability(from: string, days: number): AvailabilityResult {
  const today = istDateString();
  const lastDate = addDays(today, 30);
  const starts = standardSlotStarts();
  const dates: DayView[] = [];
  for (let i = 0; i < days; i++) {
    const date = addDays(from, i);
    if (date < today || date > lastDate) continue;
    const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      new Date(`${date}T00:00:00Z`).getUTCDay()
    ];
    if (!(STANDARD_SLOT_DAYS as readonly string[]).includes(dow)) {
      dates.push({ date, closed: true, reason: "Clinic closed", slots: [] });
      continue;
    }
    dates.push({
      date,
      closed: false,
      reason: "",
      slots: starts.map((start) => {
        const endHour = Number(start.slice(0, 2)) + 1;
        const end = `${String(endHour).padStart(2, "0")}:${start.slice(3)}`;
        return {
          start,
          end,
          label: slotLabel(start, end),
          capacity: STANDARD_SLOT_CAPACITY,
          left: STANDARD_SLOT_CAPACITY,
          open: true,
        };
      }),
    });
  }
  return { ok: true, today, lastDate, dates };
}
