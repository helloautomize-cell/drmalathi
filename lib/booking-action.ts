"use server";

import {
  processBookingSubmission,
  sendLeadEmail,
  type RawBookingInput,
} from "@/lib/booking-pipeline";
import { site } from "@/data/site";

const FALLBACK_MESSAGE = `We could not submit your request online right now. Please call us on ${site.phones[0].label} or reach us on WhatsApp.`;
const OK_MESSAGE =
  "Thank you. We have received your request and will call you back shortly.";

/**
 * Server action used by /book and every existing booking form on the site.
 * Pipeline order: honeypot, minimum fill time, schema validation, Sheet
 * abuse limits, then append. Failures return a generic result so the UI can
 * show the calm Call/WhatsApp fallback without revealing which check failed.
 * The built-in Next.js Origin check on server actions stays untouched.
 */
export async function submitBooking(formData: FormData): Promise<{
  ok: boolean;
  message: string;
  deliveryFailed?: boolean;
  bookingId?: string;
  mobile?: string;
}> {
  const raw: RawBookingInput = {
    name: String(formData.get("name") ?? ""),
    mobile: String(formData.get("mobile") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    service: String(formData.get("service") ?? ""),
    doctor: String(formData.get("doctor") ?? ""),
    preferredDate: String(formData.get("preferredDate") ?? ""),
    preferredTime: String(formData.get("preferredTime") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    consent: formData.get("consent") !== null,
    website: String(formData.get("website") ?? ""),
    company_url: String(formData.get("company_url") ?? ""),
    startedAt: String(formData.get("startedAt") ?? ""),
    source: String(formData.get("source") ?? "unknown"),
  };

  const result = await processBookingSubmission(raw);
  if (!result.ok) {
    return { ok: false, message: FALLBACK_MESSAGE, deliveryFailed: true };
  }

  // Optional email copy of a saved booking; the Sheet row is the record, so
  // an email failure never turns a saved booking into an error for the user.
  if (result.appended && result.data && process.env.RESEND_API_KEY) {
    const d = result.data;
    await sendLeadEmail(
      `Appointment request: ${d.name}`,
      [
        `Name: ${d.name}`,
        `Phone: ${d.mobile}`,
        `Preferred doctor: ${d.doctor}`,
        `Service: ${d.service}`,
        `Preferred date: ${d.preferredDate}`,
        `Preferred time: ${d.preferredTime}`,
        `Source: ${d.source}`,
        `Booking ID: ${result.bookingId}`,
      ],
      "booking"
    );
  }

  return {
    ok: true,
    message: OK_MESSAGE,
    bookingId: result.bookingId,
    mobile: result.mobile,
  };
}
