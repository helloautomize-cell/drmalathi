"use client";

import { BookingFormController } from "@/components/forms/booking-form-controller";
import { Phone } from "lucide-react";
import { site } from "@/data/site";

/**
 * /book booking form. The fields, consent, honeypot and submit logic all
 * live in BookingFields/BookingFormController; this wrapper only supplies
 * the QR source and the call link under the button.
 */
export function BookForm({ source }: { source: string }) {
  return (
    <BookingFormController
      source={source}
      layout="page"
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
