import { randomInt } from "node:crypto";
import { Resend } from "resend";
import {
  bookingSchema,
  NOT_GIVEN,
  NO_PREFERENCE,
  PREFERRED_TIMES,
  QR_SOURCES,
  UNSURE_SERVICE,
} from "@/lib/booking-schema";
import {
  appendRow,
  buildRow,
  evaluateLimits,
  readRecentRows,
  sheetsConfigured,
} from "@/lib/google-sheets";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

/**
 * Shared submission pipeline for booking leads. The /book server action and
 * the existing website form action both run through this, so every booking
 * lands in the same Sheet row format with the same anti-spam checks.
 *
 * Never logs form values outside development. Returns generic results so a
 * caller cannot tell which check rejected a request.
 */

const MIN_SUBMIT_MS = 3000;

export type RawBookingInput = {
  name?: string;
  /** /book sends `mobile`; the older website forms send `phone`. */
  mobile?: string;
  phone?: string;
  service?: string;
  doctor?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  consent?: string | boolean;
  /** honeypot: `website` on /book, `company_url` on the older forms. */
  website?: string;
  company_url?: string;
  startedAt?: string;
  source?: string;
};

export type BookingResult = {
  ok: boolean;
  bookingId?: string;
  mobile?: string;
  /** True only when a row was actually appended to the Sheet. Silent
      accepts (honeypot, too fast, duplicate) return ok without it. */
  appended?: boolean;
  /** Validated values, for the optional Resend copy of a saved booking. */
  data?: {
    name: string;
    mobile: string;
    service: string;
    doctor: string;
    preferredDate: string;
    preferredTime: string;
    source: string;
  };
};

const serviceNames = new Set(services.map((s) => s.name));
const doctorNames = new Set(doctors.map((d) => d.name));

function mapService(raw: string): string {
  const v = raw.trim();
  if (!v || v === "any") return UNSURE_SERVICE;
  const bySlug = services.find((s) => s.slug === v);
  return bySlug ? bySlug.name : v;
}

function mapDoctor(raw: string): string {
  const v = raw.trim();
  if (!v || v === "any") return NO_PREFERENCE;
  const bySlug = doctors.find((d) => d.slug === v);
  return bySlug ? bySlug.name : v;
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

function mapTime(raw: string): string {
  const v = raw.trim().toLowerCase();
  if (!v || v === "any") return NOT_GIVEN;
  for (const t of PREFERRED_TIMES) {
    if (t.toLowerCase() === v) return t;
  }
  return v === "afternoon" ? "Afternoon" : NOT_GIVEN;
}

function bookingId(): string {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  let id = "bk_";
  for (let i = 0; i < 8; i++) id += alphabet[randomInt(36)];
  return id;
}

function devLog(check: string, extra?: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[booking] ${check}`, extra ?? "");
  }
}

export async function processBookingSubmission(
  raw: RawBookingInput
): Promise<BookingResult> {
  // 1. Honeypot: silently accept so bots do not retry or adapt.
  if (raw.website || raw.company_url) {
    devLog("honeypot hit, silently accepted");
    return { ok: true };
  }

  // 2. Minimum fill time.
  const started = Date.parse(raw.startedAt ?? "");
  if (
    !raw.startedAt ||
    Number.isNaN(started) ||
    Date.now() - started < MIN_SUBMIT_MS
  ) {
    devLog("submitted too fast, silently accepted");
    return { ok: true };
  }

  // 3. Normalise + validate.
  const parsed = bookingSchema.safeParse({
    name: raw.name,
    mobile: raw.mobile ?? raw.phone ?? "",
    service: mapService(raw.service ?? ""),
    doctor: mapDoctor(raw.doctor ?? ""),
    preferredDate: raw.preferredDate?.trim() || NOT_GIVEN,
    preferredTime: mapTime(raw.preferredTime ?? ""),
    notes: raw.notes ?? "",
    consent: raw.consent === "on" || raw.consent === true,
    source: mapSource(raw.source ?? "unknown"),
  });
  if (!parsed.success) {
    devLog("schema validation failed", parsed.error.issues.map((i) => i.path));
    return { ok: false };
  }
  const data = parsed.data;
  if (!serviceNames.has(data.service) && data.service !== UNSURE_SERVICE) {
    devLog("unknown service value");
    return { ok: false };
  }
  if (!doctorNames.has(data.doctor) && data.doctor !== NO_PREFERENCE) {
    devLog("unknown doctor value");
    return { ok: false };
  }

  if (!sheetsConfigured()) {
    // Local/dev convenience: behave like the old no-Resend passthrough.
    if (process.env.NODE_ENV !== "production") {
      devLog("sheets env not set; dev passthrough", { source: data.source });
      return { ok: true, bookingId: "bk_dev0000", mobile: data.mobile, data };
    }
    return { ok: false };
  }

  // 5. Sheet based limits on the last 300 rows. If the read fails we still
  //    try to append so a real booking is never lost to a check outage.
  try {
    const rows = await readRecentRows();
    const verdict = evaluateLimits(rows, {
      mobile: data.mobile,
      service: data.service,
      preferredDate: data.preferredDate,
    });
    if (verdict === "daily-limit" || verdict === "rate-limit") {
      devLog(`limit reached: ${verdict}`);
      return { ok: false };
    }
    if (verdict === "duplicate") {
      devLog("duplicate within 24h, silently accepted");
      return { ok: true };
    }
  } catch {
    devLog("limit read failed, continuing to append");
  }

  const id = bookingId();
  const row = buildRow({
    bookingId: id,
    source: data.source,
    name: data.name,
    mobile: data.mobile,
    service: data.service,
    doctor: data.doctor,
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
    notes: data.notes,
  });

  try {
    await appendRow(row);
  } catch {
    devLog("sheet append failed");
    return { ok: false };
  }
  devLog("appended", row);
  return {
    ok: true,
    bookingId: id,
    mobile: data.mobile,
    appended: true,
    data,
  };
}

/**
 * Optional Resend copy of a saved booking, kept from the original lead
 * flow. The Sheet is the destination of record; email is best effort.
 * Never logs lead values outside development.
 */
export async function sendLeadEmail(
  subject: string,
  lines: string[],
  tag: string
): Promise<boolean> {
  const missing = ["RESEND_API_KEY", "LEADS_EMAIL_TO", "LEADS_EMAIL_FROM"].filter(
    (key) => !process.env[key]
  );
  if (missing.length > 0) {
    devLog(`[${tag}] lead email skipped, missing env: ${missing.join(", ")}`);
    return false;
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY as string);
    const { error } = await resend.emails.send({
      from: process.env.LEADS_EMAIL_FROM as string,
      to: process.env.LEADS_EMAIL_TO as string,
      subject,
      text: lines.join("\n"),
    });
    if (error) {
      console.error(
        `[${tag}] resend rejected lead: ${JSON.stringify(error)}` +
          (process.env.NODE_ENV !== "production"
            ? `. Lead: ${lines.join(" | ")}`
            : "")
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error(
      `[${tag}] lead send threw: ${String(err)}` +
        (process.env.NODE_ENV !== "production"
          ? `. Lead: ${lines.join(" | ")}`
          : "")
    );
    return false;
  }
}
