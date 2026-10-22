"use client";

import { type ReactNode } from "react";
import { BookingFormController } from "@/components/forms/booking-form-controller";
import {
  bookingOptionLists,
  type BookingLayout,
} from "@/components/forms/booking-fields";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { addDays, istDateString } from "@/lib/booking-schema";

/**
 * Booking form for the sheet and the international-patients card. All field
 * markup and submission live in BookingFields/BookingFormController; this
 * adapter resolves the shared option lists and the slug prefills that
 * BookingCta callers pass in.
 */
export function BookingForm({
  source,
  service,
  doctor,
  layout = "page",
  trailing,
  onDone,
}: {
  /** Where the request came from; sent with the lead for context. */
  source: string;
  /** Service slug to preselect (BookingCta passes slugs). */
  service?: string;
  /** Doctor slug to preselect. */
  doctor?: string;
  layout?: BookingLayout;
  /** Sheet only: divider + tiles at the end of the scrolling area. */
  trailing?: ReactNode;
  onDone?: () => void;
}) {
  const { serviceOptions, doctorOptions } = bookingOptionLists();
  const today = istDateString();
  return (
    <BookingFormController
      source={source}
      layout={layout}
      serviceOptions={serviceOptions}
      doctorOptions={doctorOptions}
      minDate={addDays(today, 1)}
      maxDate={addDays(today, 60)}
      initialService={
        service ? (services.find((s) => s.slug === service)?.name ?? "") : ""
      }
      initialDoctor={
        doctor ? (doctors.find((d) => d.slug === doctor)?.name ?? "") : ""
      }
      trailing={trailing}
      onDone={onDone}
    />
  );
}
