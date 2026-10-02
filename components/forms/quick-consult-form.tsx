"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Phone } from "lucide-react";
import { z } from "zod";
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

const consultSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,15}$/, "Please enter a valid phone number."),
  doctor: z.string(),
  service: z.string(),
  preferredTime: z.string(),
  consent: z.literal(true, {
    error: "Please accept so we can contact you.",
  }),
  company_url: z.string().optional(),
});

type ConsultValues = z.infer<typeof consultSchema>;

const preferredTimes = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

export function QuickConsultForm() {
  const [submitted, setSubmitted] = useState(false);
  const [startedAt] = useState(() => new Date().toISOString());
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultValues>({
    resolver: zodResolver(consultSchema),
    defaultValues: {
      name: "",
      phone: "",
      doctor: "any",
      service: "any",
      preferredTime: "any",
      company_url: "",
    },
  });

  async function onSubmit(values: ConsultValues) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("phone", values.phone);
    formData.set("doctor", values.doctor || "any");
    formData.set("service", values.service || "any");
    formData.set("preferredTime", values.preferredTime || "any");
    formData.set("source", "contact-page");
    formData.set("consent", values.consent ? "on" : "");
    formData.set("company_url", values.company_url ?? "");
    formData.set("startedAt", startedAt);

    const result = await requestAppointment(formData);
    if (result.ok) {
      setSubmitted(true);
      reset();
    } else {
      toast.error(result.message);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Honeypot field: off-screen so bots fill it but real users and
          assistive tech never reach it. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company_url")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="qc-name">Your name</Label>
        <Input
          id="qc-name"
          placeholder="Full name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="qc-phone">Phone number</Label>
        <Input
          id="qc-phone"
          type="tel"
          placeholder="+91"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="qc-service">Service (optional)</Label>
        <Controller
          control={control}
          name="service"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
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
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="qc-doctor">Preferred doctor</Label>
        <Controller
          control={control}
          name="doctor"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
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
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="qc-time">Preferred time of day</Label>
        <Controller
          control={control}
          name="preferredTime"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
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
          )}
        />
      </div>

      <div className="flex items-start gap-2.5">
        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <Checkbox
              checked={field.value === true}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              aria-invalid={!!errors.consent}
              aria-labelledby="qc-consent-label"
              className="mt-0.5 shrink-0"
            />
          )}
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
        <p className="text-sm text-destructive">{errors.consent.message}</p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-primary text-white hover:bg-primary-hover"
      >
        {isSubmitting ? "Sending..." : "Request a callback"}
      </Button>
    </form>
  );
}
