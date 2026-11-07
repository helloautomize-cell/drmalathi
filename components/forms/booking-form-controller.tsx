"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Phone } from "lucide-react";
import { cn } from "cn";
import { sendGAEvent } from "@/lib/gtag";
import { getSlots, submitBooking } from "@/lib/booking-action";
import { ContactFallbackPanel } from "@/components/forms/contact-fallback-panel";
import {
  BookingFields,
  BookingSuccessCard,
  emptyBookingValues,
  type AvailabilityState,
  type BookingErrors,
  type BookingLayout,
  type BookingValues,
} from "@/components/forms/booking-fields";
import { buttonVariants } from "@/components/ui/button";
import { bookingSchema, istDateString } from "@/lib/booking-schema";
import { site } from "@/data/site";
import type { DayView } from "@/lib/google-sheets";

/**
 * State and submission for the shared booking form. All booking surfaces
 * render BookingFields; this is the single place that loads availability,
 * validates with the shared zod schema, calls submitBooking and swaps in
 * the success card or one of the calm failure panels.
 */
export function BookingFormController({
  source,
  layout,
  initialVisitType = "",
  initialReason = "",
  trailing,
  afterSubmit,
  onDone,
}: {
  /** Where the request came from; sent with the lead for context. */
  source: string;
  layout: BookingLayout;
  /** Prefilled values (BookingCta maps the service slug onto these). */
  initialVisitType?: string;
  initialReason?: string;
  trailing?: ReactNode;
  afterSubmit?: ReactNode;
  onDone?: () => void;
}) {
  const idPrefix = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [startedAt] = useState(() => new Date().toISOString());
  const [success, setSuccess] = useState<{
    bookingId?: string;
    mobile?: string;
    date?: string;
    slotLabel?: string;
    visitType?: string;
    reason?: string;
  } | null>(null);
  const [panel, setPanel] = useState<"duplicate" | "limit" | "failed" | null>(
    null
  );
  const [values, setValues] = useState<BookingValues>({
    ...emptyBookingValues,
    visitType: initialVisitType,
    reason: initialReason,
  });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const slotRegionRef = useRef<HTMLFieldSetElement>(null);

  const [availability, setAvailability] = useState<AvailabilityState>({
    today: "",
    lastDate: "",
    days: {},
    loading: true,
    offline: false,
  });

  // Merge an availability answer into the day map, or flip to offline.
  function applyAvailability(res: Awaited<ReturnType<typeof getSlots>>) {
    if (!res.ok) {
      setAvailability((a) => ({ ...a, loading: false, offline: true }));
      return;
    }
    setAvailability((a) => {
      const merged: Record<string, DayView> = { ...a.days };
      for (const d of res.dates) merged[d.date] = d;
      return {
        today: res.today || a.today,
        lastDate: res.lastDate || a.lastDate,
        days: merged,
        loading: false,
        offline: false,
      };
    });
  }

  // Fetch `days` days starting at `from` and merge into the day map.
  async function loadDays(from: string, days: number) {
    setAvailability((a) => ({ ...a, loading: true }));
    applyAvailability(await getSlots(from, days));
  }

  // First paint: the next fourteen days. The Sheet decides what is open.
  // State only moves inside .then, never synchronously in the effect body.
  useEffect(() => {
    let cancelled = false;
    getSlots(istDateString(), 14).then((res) => {
      if (!cancelled) applyAvailability(res);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // A date outside the cached strip (picked through More dates) gets its
  // own one day fetch; a cached day just needs the map, not a refetch.
  function onPickDate(date: string) {
    if (!availability.days[date]) void loadDays(date, 1);
  }

  function setField<K extends keyof BookingValues>(
    key: K,
    value: BookingValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
    if (key === "slotStart" || key === "date") setSlotError(null);
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
      // Move focus to the first invalid field.
      const first = [
        "visitType",
        "reason",
        "date",
        "slotStart",
        "name",
        "mobile",
        "notes",
        "consent",
      ].find((k) => next[k as keyof BookingValues]);
      if (first === "date" || first === "slotStart") {
        slotRegionRef.current?.focus();
      } else if (first === "visitType") {
        form
          .querySelector<HTMLElement>(`input[name="${idPrefix}-visitType"]`)
          ?.focus();
      } else if (first) {
        form.querySelector<HTMLElement>(`#${idPrefix}-${first}`)?.focus();
      }
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      // Build from the live form so the honeypot value survives whatever a
      // bot typed into it.
      const formData = new FormData(form);
      formData.set("name", parsed.data.name);
      formData.set("mobile", parsed.data.mobile);
      formData.set("visitType", parsed.data.visitType);
      formData.set("reason", parsed.data.reason);
      formData.set("date", parsed.data.date);
      formData.set("slotStart", parsed.data.slotStart);
      formData.set("notes", parsed.data.notes);
      formData.set("source", source);
      formData.set("consent", values.consent ? "on" : "");
      formData.set("startedAt", startedAt);

      const result = await submitBooking(formData);
      if (result.ok) {
        // Only a real booking fires the analytics event; honeypot and
        // too-fast silent accepts come back with no bookingId.
        if (result.bookingId) {
          try {
            sendGAEvent("event", "appointment_submit", {
              form_name: "appointment_form",
              page_path: window.location.pathname,
            });
          } catch {
            // analytics must never break the success flow
          }
        }
        setValues({ ...emptyBookingValues });
        setSuccess({
          bookingId: result.bookingId,
          mobile: result.mobile,
          date: result.date,
          slotLabel: result.slotLabel,
          visitType: result.visitType,
          reason: result.reason,
        });
      } else if (result.reason === "slot_unavailable") {
        // Keep every field, clear only the slot, reload that day and point
        // the person at the fresh times.
        setValues((v) => ({ ...v, slotStart: "" }));
        if (parsed.data.date) void loadDays(parsed.data.date, 1);
        setSlotError("Sorry, that time just filled up. Please pick another time.");
        slotRegionRef.current?.focus();
      } else if (result.reason === "duplicate") {
        setPanel("duplicate");
      } else if (result.reason === "limit") {
        setPanel("limit");
      } else {
        setPanel("failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (panel === "failed") {
    return (
      <ContactFallbackPanel message="We could not submit your request online right now." />
    );
  }

  if (panel === "duplicate" || panel === "limit") {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-tint bg-blush p-6"
      >
        <p className="text-base font-semibold text-ink">
          {panel === "duplicate"
            ? "You already have a request for that day. We will call you soon, or call us."
            : "You have sent several requests today. Please call us and we will help."}
        </p>
        <a
          href={site.phones[0].href}
          className={cn(
            buttonVariants({ size: "default" }),
            "mt-4 bg-primary text-white hover:bg-primary-hover"
          )}
        >
          <Phone aria-hidden="true" />
          Call {site.phones[0].label}
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <BookingSuccessCard
        bookingId={success.bookingId}
        mobile={success.mobile}
        date={success.date}
        slotLabel={success.slotLabel}
        visitType={success.visitType}
        reason={success.reason}
        onBookAnother={() => {
          setSuccess(null);
          void loadDays(istDateString(), 14);
        }}
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
      availability={availability}
      slotError={slotError}
      slotRegionRef={slotRegionRef}
      setField={setField}
      onPickDate={onPickDate}
      onSubmit={onSubmit}
      trailing={trailing}
      afterSubmit={afterSubmit}
    />
  );
}
