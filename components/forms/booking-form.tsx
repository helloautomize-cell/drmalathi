"use client";

import { type ReactNode } from "react";
import { BookingFormController } from "@/components/forms/booking-form-controller";
import type { BookingLayout } from "@/components/forms/booking-fields";
import { reasonsFor, TEST_OPTIONS } from "@/data/booking-options";
import { services } from "@/data/services";

/**
 * Booking form for the sheet and the international-patients card. All field
 * markup and submission live in BookingFields/BookingFormController; this
 * adapter only maps the service slug BookingCta callers pass onto a visit
 * type and reason prefill.
 */
export function BookingForm({
  source,
  service,
  layout = "page",
  trailing,
  onDone,
}: {
  /** Where the request came from; sent with the lead for context. */
  source: string;
  /** Service slug to preselect (BookingCta passes slugs). */
  service?: string;
  layout?: BookingLayout;
  /** Sheet only: divider + tiles at the end of the scrolling area. */
  trailing?: ReactNode;
  onDone?: () => void;
}) {
  const prefill = prefillFromService(service);
  return (
    <BookingFormController
      source={source}
      layout={layout}
      initialVisitType={prefill.visitType ?? ""}
      initialReason={prefill.reason ?? ""}
      trailing={trailing}
      onDone={onDone}
    />
  );
}

/**
 * A scan or blood test becomes "Test only" with the test prefilled; a
 * clinic becomes "New consultation" with it as the reason. Anything else
 * gets no prefill rather than a wrong one.
 */
function prefillFromService(slug?: string): {
  visitType?: string;
  reason?: string;
} {
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  if (TEST_OPTIONS.some((t) => t.name === s.name)) {
    return { visitType: "Test only", reason: s.name };
  }
  if (reasonsFor("New consultation").includes(s.name)) {
    return { visitType: "New consultation", reason: s.name };
  }
  return {};
}
