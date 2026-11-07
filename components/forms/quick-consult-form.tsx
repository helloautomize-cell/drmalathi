"use client";

import { BookingFormController } from "@/components/forms/booking-form-controller";

/**
 * /contact callback form. Renders the same shared booking form as /book and
 * the appointment sheet with only a different source value.
 */
export function QuickConsultForm() {
  return <BookingFormController source="contact-page" layout="page" />;
}
