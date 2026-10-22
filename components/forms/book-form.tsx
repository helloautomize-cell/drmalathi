"use client";

import { BookingFormController } from "@/components/forms/booking-form-controller";
import type { BookingOption } from "@/components/forms/booking-fields";
import { Phone } from "lucide-react";
import { site } from "@/data/site";

export type BookOption = BookingOption;

/**
 * /book booking form. The fields, consent, honeypot and submit logic all
 * live in BookingFields/BookingFormController; this wrapper only supplies
 * the QR source, the shared option lists and the call link under the button.
 */
export function BookForm({
  source,
  serviceOptions,
  doctorOptions,
  minDate,
  maxDate,
}: {
  /** Validated on the page: one of the QR locations or "unknown". */
  source: string;
  serviceOptions: BookingOption[];
  doctorOptions: BookingOption[];
  /** YYYY-MM-DD bounds for the date input (tomorrow to +60 days, IST). */
  minDate: string;
  maxDate: string;
}) {
  return (
    <BookingFormController
      source={source}
      layout="page"
      serviceOptions={serviceOptions}
      doctorOptions={doctorOptions}
      minDate={minDate}
      maxDate={maxDate}
      afterSubmit={
        <p className="text-center text-sm text-muted-foreground">
          Prefer to call?{" "}
          <a
            href={site.phones[0].href}
            className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            {site.phones[0].label}
          </a>
        </p>
      }
    />
  );
}
