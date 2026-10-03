"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Phone } from "lucide-react";
import { requestAppointment } from "@/app/actions/appointment";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { site } from "@/data/site";
import {
  type LeadField,
  phoneInputPattern,
  validateLead,
} from "@/lib/lead-validation";

const doctorSlugs = doctors.map((d) => d.slug);
const serviceSlugs = services.map((s) => s.slug);

const preferredTimes = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

export function QuickConsultForm() {
  const [submitted, setSubmitted] = useState(false);
  const [startedAt] = useState(() => new Date().toISOString());
  const [values, setValues] = useState({
    name: "",
    phone: "",
    doctor: "any",
    service: "any",
    preferredTime: "any",
    consent: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<LeadField, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key as LeadField] ? { ...e, [key]: undefined } : e));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = validateLead(values, { doctorSlugs, serviceSlugs });
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const { toast } = await import("sonner");
      const formData = new FormData(event.currentTarget);
      formData.set("doctor", parsed.data.doctor);
      formData.set("service", parsed.data.service);
      formData.set("preferredTime", parsed.data.preferredTime);
      formData.set("source", "contact-page");
      formData.set("consent", values.consent ? "on" : "");
      formData.set("startedAt", startedAt);

      const result = await requestAppointment(formData);
      if (result.ok) {
        setSubmitted(true);
        setValues({
          name: "",
          phone: "",
          doctor: "any",
          service: "any",
          preferredTime: "any",
          consent: false,
        });
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl bg-blush p-6">
        <p className="flex items-center gap-2 text-lg font-semibold text-ink">
          <CheckCircle2 className="size-5 text-teal" aria-hidden="true" />
          Request received
        </p>
        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Our team will call you back on the number you shared.</li>
          <li>We will confirm a convenient time and doctor for your visit.</li>
          <li>Keep your phone nearby during opening hours.</li>
        </ul>
        <p className="mt-4 text-sm font-semibold text-ink">
          Need us sooner? Reach us directly:
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button
            nativeButton={false}
            className="bg-primary text-white hover:bg-primary-hover"
            render={<a href={site.phones[0].href} />}
          >
            <Phone aria-hidden="true" />
            Call {site.phones[0].label}
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            className="border-teal text-teal hover:bg-teal-tint hover:text-teal"
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
          name="company_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="qc-name">Your name</Label>
        <Input
          id="qc-name"
          name="name"
          placeholder="Full name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          aria-invalid={!!errors.name}
        />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="qc-phone">Phone number</Label>
        <Input
          id="qc-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="+91"
          autoComplete="tel"
          required
          pattern={phoneInputPattern}
          value={values.phone}
          onChange={(e) => setField("phone", e.target.value)}
          aria-invalid={!!errors.phone}
        />
        {errors.phone ? (
          <p className="text-sm text-destructive">{errors.phone}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="qc-service">Service (optional)</Label>
        <Select
          value={values.service}
          onValueChange={(v) => setField("service", v ?? "any")}
        >
          <SelectTrigger id="qc-service" className="w-full bg-white">
            <SelectValue>
              {(value: string) =>
                value === "any" || !value
                  ? "Not sure yet"
                  : (services.find((s) => s.slug === value)?.name ??
                    "Not sure yet")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Not sure yet</SelectItem>
            {services.map((s) => (
              <SelectItem key={s.slug} value={s.slug}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="qc-doctor">Preferred doctor</Label>
        <Select
          value={values.doctor}
          onValueChange={(v) => setField("doctor", v ?? "any")}
        >
          <SelectTrigger id="qc-doctor" className="w-full bg-white">
            <SelectValue>
              {(value: string) =>
                value === "any" || !value
                  ? "Any doctor"
                  : (doctors.find((d) => d.slug === value)?.name ??
                    "Any doctor")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any doctor</SelectItem>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.slug} value={doctor.slug}>
                {doctor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="qc-time">Preferred time of day</Label>
        <Select
          value={values.preferredTime}
          onValueChange={(v) => setField("preferredTime", v ?? "any")}
        >
          <SelectTrigger id="qc-time" className="w-full bg-white">
            <SelectValue>
              {(value: string) =>
                preferredTimes.find((t) => t.value === value)?.label ??
                "No preference"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">No preference</SelectItem>
            {preferredTimes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox
          checked={values.consent}
          onCheckedChange={(checked) =>
            setField("consent", checked === true)
          }
          required
          aria-invalid={!!errors.consent}
          aria-labelledby="qc-consent-label"
          className="mt-0.5 shrink-0"
        />
        <p className="text-sm leading-snug text-muted-foreground">
          <span id="qc-consent-label">
            I consent to the centre contacting me about my enquiry.
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
        {isSubmitting ? "Sending..." : "Book appointment"}
      </Button>
    </form>
  );
}
