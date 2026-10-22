"use client";

import { BookingFormController } from "@/components/forms/booking-form-controller";
import type { BookingOption } from "@/components/forms/booking-fields";
import { addDays, istDateString } from "@/lib/booking-schema";

/**
 * /contact callback form. Renders the same shared booking form as /book and
 * the appointment sheet with only a different source value.
 */
export function QuickConsultForm({
  doctorOptions,
  serviceOptions,
}: {
  doctorOptions: BookingOption[];
  serviceOptions: BookingOption[];
}) {
  const today = istDateString();
  return (
    <BookingFormController
      source="contact-page"
      layout="page"
      serviceOptions={serviceOptions}
      doctorOptions={doctorOptions}
      minDate={addDays(today, 1)}
      maxDate={addDays(today, 60)}
    />
  );
}
