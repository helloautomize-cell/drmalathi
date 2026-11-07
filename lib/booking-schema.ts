import { z } from "zod";
import { reasonsFor, VISIT_TYPE_VALUES } from "@/data/booking-options";

/**
 * Shared booking schema for the /book page, the appointment sheet and the
 * website callback form. Client forms use it for inline errors; the server
 * action parses again before anything reaches the Sheet.
 *
 * Helpers at the bottom (IST dates, mobile normalisation, masking) are also
 * imported by the training application flow, which validates against its
 * own schema.
 */

// src values allowed on /book?src= (QR locations plus the on-site QR card).
// Anything else -> "unknown".
export const QR_SOURCES = ["reception", "scan-room", "opd", "website"] as const;
export type QrSource = (typeof QR_SOURCES)[number];
export function qrSourceOrUnknown(value: string | undefined): string {
  return QR_SOURCES.includes(value as QrSource) ? (value as string) : "unknown";
}

export const CONSENT_VERSION = "v1";
export const BOOKING_WINDOW_DAYS = 30;

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

/** true when value is a real calendar date from today to today+window, IST. */
export function isBookingDateValid(
  value: string,
  today: string = istDateString(),
  windowDays: number = BOOKING_WINDOW_DAYS
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) {
    return false;
  }
  return value >= today && value <= addDays(today, windowDays);
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

const dateSchema = z.string().refine((v) => isBookingDateValid(v), {
  message: "Choose a date within the next 30 days",
});

const slotStartSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Choose a time slot");

export const bookingSchema = z
  .object({
    name: z.string().trim().min(2).max(60),
    mobile: mobileSchema,
    visitType: z.enum(VISIT_TYPE_VALUES),
    reason: z.string().trim().min(1, "Choose a reason").max(120),
    date: dateSchema,
    slotStart: slotStartSchema,
    notes: z.string().trim().max(300).default(""),
    consent: z.literal(true),
    source: z.string().trim().min(1).max(40),
  })
  .refine((data) => reasonsFor(data.visitType).includes(data.reason), {
    message: "Choose a reason that fits the visit type",
    path: ["reason"],
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
