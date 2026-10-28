"use client";

import { type FormEvent, type ReactNode, useId, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { submitBooking } from "@/lib/booking-action";
import { ContactFallbackPanel } from "@/components/forms/contact-fallback-panel";
import {
  BookingFields,
  BookingSuccessCard,
  emptyBookingValues,
  type BookingErrors,
  type BookingLayout,
  type BookingOption,
  type BookingValues,
} from "@/components/forms/booking-fields";
import { bookingSchema } from "@/lib/booking-schema";

/**
 * State and submission for the shared booking form. All booking surfaces
 * render BookingFields; this is the single place that validates with the
 * shared zod schema, calls submitBooking and swaps in the success card.
 */
export function BookingFormController({
  source,
  layout,
  serviceOptions,
  doctorOptions,
  minDate,
  maxDate,
  initialService = "",
  initialDoctor = "",
  trailing,
  afterSubmit,
  onDone,
}: {
  /** Where the request came from; sent with the lead for context. */
  source: string;
  layout: BookingLayout;
  serviceOptions: BookingOption[];
  doctorOptions: BookingOption[];
  /** YYYY-MM-DD bounds for the date input (tomorrow to +60 days, IST). */
  minDate: string;
  maxDate: string;
  /** Prefilled option values (service and doctor display names). */
  initialService?: string;
  initialDoctor?: string;
  trailing?: ReactNode;
  afterSubmit?: ReactNode;
  onDone?: () => void;
}) {
  const idPrefix = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [startedAt] = useState(() => new Date().toISOString());
  const [success, setSuccess] = useState<{
    bookingId?: string;
    mobile?: string;
  } | null>(null);
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [values, setValues] = useState<BookingValues>({
    ...emptyBookingValues,
    service: initialService,
    doctor: initialDoctor,
  });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof BookingValues>(
    key: K,
    value: BookingValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Capture the form now: currentTarget is null after the synthetic event
    // finishes, which is past the dynamic imports below.
    const form = event.currentTarget;
    const parsed = bookingSchema.safeParse({ ...values, source });
    if (!parsed.success) {
      const next: BookingErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          typeof key === "string" &&
          key in values &&
          !next[key as keyof BookingValues]
        ) {
          next[key as keyof BookingValues] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const { toast } = await import("sonner");
      // Build from the live form so the honeypot value survives whatever a
      // bot typed into it.
      const formData = new FormData(form);
      formData.set("mobile", parsed.data.mobile);
      formData.set("service", parsed.data.service);
      formData.set("doctor", parsed.data.doctor);
      formData.set("preferredDate", parsed.data.preferredDate);
      formData.set("preferredTime", parsed.data.preferredTime);
      formData.set("notes", parsed.data.notes);
      formData.set("source", source);
      formData.set("consent", values.consent ? "on" : "");
      formData.set("startedAt", startedAt);

      const result = await submitBooking(formData);
      if (result.ok) {
        try {
          sendGAEvent("event", "appointment_submit", {
            form_name: "appointment_form",
            page_path: window.location.pathname,
          });
        } catch {
          // analytics must never break the success flow
        }
        setValues({ ...emptyBookingValues });
        setSuccess({ bookingId: result.bookingId, mobile: result.mobile });
      } else if (result.deliveryFailed) {
        setFailedMessage(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (failedMessage) {
    return <ContactFallbackPanel message={failedMessage} />;
  }

  if (success) {
    return (
      <BookingSuccessCard
        bookingId={success.bookingId}
        mobile={success.mobile}
        onDone={onDone}
      />
    );
  }

  return (
    <BookingFields
      layout={layout}
      interactive
      idPrefix={idPrefix}
      values={values}
      errors={errors}
      isSubmitting={isSubmitting}
      serviceOptions={serviceOptions}
      doctorOptions={doctorOptions}
      minDate={minDate}
      maxDate={maxDate}
      setField={setField}
      onSubmit={onSubmit}
      trailing={trailing}
      afterSubmit={afterSubmit}
    />
  );
}
