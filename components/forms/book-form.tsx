"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { submitBooking } from "@/lib/booking-action";
import { ContactFallbackPanel } from "@/components/forms/contact-fallback-panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { site } from "@/data/site";
import {
  bookingSchema,
  maskMobile,
  PREFERRED_TIMES,
} from "@/lib/booking-schema";

export type BookOption = { value: string; label: string };

type BookValues = {
  name: string;
  mobile: string;
  service: string;
  doctor: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  consent: boolean;
};

/**
 * QR booking form on /book. Same primitives, consent pattern, fallback panel
 * and disabled-while-pending submit as the website booking forms; the shared
 * zod schema runs here for inline errors and again in the server action.
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
  serviceOptions: BookOption[];
  doctorOptions: BookOption[];
  /** YYYY-MM-DD bounds for the date input (tomorrow to +60 days, IST). */
  minDate: string;
  maxDate: string;
}) {
  const [startedAt] = useState(() => new Date().toISOString());
  const [success, setSuccess] = useState<{
    bookingId?: string;
    mobile?: string;
  } | null>(null);
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [values, setValues] = useState<BookValues>({
    name: "",
    mobile: "",
    service: "",
    doctor: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
    consent: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookValues, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof BookValues>(
    key: K,
    value: BookValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = bookingSchema.safeParse({ ...values, source });
    if (!parsed.success) {
      const next: Partial<Record<keyof BookValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && key in values && !next[key as keyof BookValues]) {
          next[key as keyof BookValues] = issue.message;
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
        setSuccess({ bookingId: result.bookingId, mobile: result.mobile });
      } else {
        toast.error(result.message);
        setFailedMessage(result.message);
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
      <div className="py-5 text-center" role="status">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-teal-tint text-teal">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-ink">
          Request received
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          Thank you. Your request is received. Our team will call you on{" "}
          {success.mobile ? maskMobile(success.mobile) : "your number"} to
          confirm your appointment time.
        </p>
        {success.bookingId ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Booking ID:{" "}
            <span className="font-mono font-semibold text-ink">
              {success.bookingId}
            </span>
          </p>
        ) : null}
        <p className="mt-4 text-sm font-semibold text-ink">
          Anything urgent? Reach us directly:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Button nativeButton={false} render={<a href={site.phones[0].href} />}>
            <Phone aria-hidden="true" />
            Call {site.phones[0].label}
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <a
                href={site.whatsapp.messageHref}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <WhatsAppIcon aria-hidden="true" />
            WhatsApp us
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {/* Honeypot field: off-screen so bots fill it but real users and
          assistive tech never reach it. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bk-name">Your name</Label>
        <Input
          id="bk-name"
          name="name"
          placeholder="Full name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={60}
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          aria-invalid={!!errors.name}
        />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bk-mobile">Mobile number</Label>
        <Input
          id="bk-mobile"
          name="mobile"
          type="tel"
          inputMode="tel"
          placeholder="10 digit mobile"
          autoComplete="tel-national"
          required
          value={values.mobile}
          onChange={(e) => setField("mobile", e.target.value)}
          aria-invalid={!!errors.mobile}
        />
        {errors.mobile ? (
          <p className="text-sm text-destructive">{errors.mobile}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bk-service">What do you need?</Label>
        <Select
          value={values.service}
          onValueChange={(v) => setField("service", v ?? "")}
        >
          <SelectTrigger
            id="bk-service"
            className="w-full bg-white"
            aria-invalid={!!errors.service}
          >
            <SelectValue>
              {(value: string) =>
                serviceOptions.find((o) => o.value === value)?.label ??
                "Choose a service"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {serviceOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.service ? (
          <p className="text-sm text-destructive">{errors.service}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bk-doctor">Preferred doctor</Label>
        <Select
          value={values.doctor}
          onValueChange={(v) => setField("doctor", v ?? "")}
        >
          <SelectTrigger
            id="bk-doctor"
            className="w-full bg-white"
            aria-invalid={!!errors.doctor}
          >
            <SelectValue>
              {(value: string) =>
                doctorOptions.find((o) => o.value === value)?.label ??
                "Choose a doctor"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {doctorOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.doctor ? (
          <p className="text-sm text-destructive">{errors.doctor}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="bk-date">Preferred day</Label>
          <Input
            id="bk-date"
            name="preferredDate"
            type="date"
            required
            min={minDate}
            max={maxDate}
            value={values.preferredDate}
            onChange={(e) => setField("preferredDate", e.target.value)}
            aria-invalid={!!errors.preferredDate}
          />
          {errors.preferredDate ? (
            <p className="text-sm text-destructive">{errors.preferredDate}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bk-time">Preferred time</Label>
          <Select
            value={values.preferredTime}
            onValueChange={(v) => setField("preferredTime", v ?? "")}
          >
            <SelectTrigger
              id="bk-time"
              className="w-full bg-white"
              aria-invalid={!!errors.preferredTime}
            >
              <SelectValue>
                {(value: string) => value || "Choose a time"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PREFERRED_TIMES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.preferredTime ? (
            <p className="text-sm text-destructive">{errors.preferredTime}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bk-notes">Anything else? (optional)</Label>
        <Textarea
          id="bk-notes"
          name="notes"
          rows={3}
          maxLength={300}
          value={values.notes}
          onChange={(e) => setField("notes", e.target.value)}
          aria-invalid={!!errors.notes}
          aria-describedby="bk-notes-help"
        />
        <p id="bk-notes-help" className="text-sm text-muted-foreground">
          Please do not share medical reports or health details here.
        </p>
        {errors.notes ? (
          <p className="text-sm text-destructive">{errors.notes}</p>
        ) : null}
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox
          checked={values.consent}
          onCheckedChange={(checked) =>
            setField("consent", checked === true)
          }
          required
          aria-invalid={!!errors.consent}
          aria-labelledby="bk-consent-label"
          className="mt-0.5 shrink-0"
        />
        <p className="text-sm leading-snug text-muted-foreground">
          <span id="bk-consent-label">
            I agree that Trichy Fetal Medicine and Fertility Centre may store
            these details to contact me about my appointment.
          </span>{" "}
          <Link href="/privacy" className="link whitespace-nowrap">
            Privacy Policy
          </Link>
        </p>
      </div>
      {errors.consent ? (
        <p className="text-sm text-destructive">{errors.consent}</p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-primary text-white hover:bg-primary-hover"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          "Request appointment"
        )}
      </Button>
    </form>
  );
}
