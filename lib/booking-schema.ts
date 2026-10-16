import { z } from "zod";

/**
 * Shared booking schema for the QR booking page (/book) and the website
 * booking forms. Client forms use it for inline errors; the server action
 * parses again before anything reaches the Sheet.
 */

// Time slot options shown in the /book select. The clinic can reorder or
// extend this one list; stored values outside it fall back to NOT_GIVEN.
export const PREFERRED_TIMES = ["Morning", "Evening"] as const;

// src values allowed on /book?src= (QR locations plus the on-site QR card).
// Anything else -> "unknown".
export const QR_SOURCES = ["reception", "scan-room", "opd", "website"] as const;
export type QrSource = (typeof QR_SOURCES)[number];
export function qrSourceOrUnknown(value: string | undefined): string {
  return QR_SOURCES.includes(value as QrSource) ? (value as string) : "unknown";
}

// Stored values used when a field was not asked on the submitting form.
export const NOT_GIVEN = "Not given";
export const UNSURE_SERVICE = "Not sure, please advise";
export const NO_PREFERENCE = "No preference";
export const CONSENT_VERSION = "v1";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** YYYY-MM-DD for a moment, in Asia/Kolkata. */
export function istDateString(now: Date = new Date()): string {
  return new Date(now.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** "YYYY-MM-DD HH:mm" in Asia/Kolkata, matching the Sheet's Submitted at column. */
export function istStamp(now: Date = new Date()): string {
  return new Date(now.getTime() + IST_OFFSET_MS)
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");
}

export function addDays(ymd: string, days: number): string {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** true when value is a real calendar date from tomorrow to today+60, IST. */
export function isPreferredDateValid(
  value: string,
  today: string = istDateString()
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) {
    return false;
  }
  return value > today && value <= addDays(today, 60);
}

/**
 * Normalise an Indian mobile to 10 digits: strip spaces/dashes/brackets,
 * a +91 (or bare 91) country code and leading zeros. Anything that is not a
 * 10-digit Indian mobile is returned cleaned but unmodified, so
 * international numbers typed on the website forms still survive.
 */
export function normalizeMobile(raw: string): string {
  let v = raw.trim().replace(/[\s\-()]/g, "");
  if (v.startsWith("+91")) v = v.slice(3);
  while (v.startsWith("0")) v = v.slice(1);
  if (v.startsWith("91") && v.length === 12) v = v.slice(2);
  return v;
}

const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const INTL_PHONE = /^\+?[0-9]{10,15}$/;

export const mobileSchema = z
  .string()
  .transform(normalizeMobile)
  .pipe(
    z.union([
      z.string().regex(INDIAN_MOBILE, "Enter a valid 10 digit mobile number"),
      z.string().regex(INTL_PHONE, "Enter a valid phone number"),
    ])
  );

const preferredDateSchema = z.union([
  z.string().refine((v) => isPreferredDateValid(v), {
    message: "Choose a date between tomorrow and 60 days ahead",
  }),
  z.literal(NOT_GIVEN),
]);

const preferredTimeSchema = z.union([
  z.enum(PREFERRED_TIMES),
  // "Afternoon" is still accepted so the older website forms stay truthful.
  z.literal("Afternoon"),
  z.literal(NOT_GIVEN),
]);

export const bookingSchema = z.object({
  name: z.string().trim().min(2).max(60),
  mobile: mobileSchema,
  service: z.string().trim().min(1).max(120),
  doctor: z.string().trim().min(1).max(120),
  preferredDate: preferredDateSchema,
  preferredTime: preferredTimeSchema,
  notes: z.string().trim().max(300).default(""),
  consent: z.literal(true),
  source: z.string().trim().min(1).max(40),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingData = z.output<typeof bookingSchema>;

export type BookingField = keyof BookingData;

/** Show only the ends of a number: "9876543210" -> "98XXXXXX10". */
export function maskMobile(mobile: string): string {
  return mobile.length > 4
    ? `${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`
    : mobile;
}
