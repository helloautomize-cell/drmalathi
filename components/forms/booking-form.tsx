"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { requestAppointment } from "@/app/actions/appointment";
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

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,15}$/, "Please enter a valid phone number."),
  doctor: z.string(),
  service: z.string(),
  consent: z.literal(true, {
    error: "Please accept so we can contact you.",
  }),
  company_url: z.string().optional(),
});

type BookingValues = z.infer<typeof bookingSchema>;

export function BookingForm({
  source,
  service = "any",
  doctor = "any",
  onDone,
}: {
  /** Where the request came from; sent with the lead for context. */
  source: string;
  service?: string;
  doctor?: string;
  onDone?: () => void;
}) {
  const [startedAt] = useState(() => new Date().toISOString());
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      doctor,
      service,
      company_url: "",
    },
  });

  async function onSubmit(values: BookingValues) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("phone", values.phone);
    formData.set("doctor", values.doctor || "any");
    formData.set("service", values.service || "any");
    formData.set("source", source);
    formData.set("consent", values.consent ? "on" : "");
    formData.set("company_url", values.company_url ?? "");
    formData.set("startedAt", startedAt);

    const result = await requestAppointment(formData);
    if (result.ok) {
      toast.success(result.message);
      reset();
      onDone?.();
    } else {
      toast.error(result.message);
    }
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
        <Label htmlFor="bf-name">Your name</Label>
        <Input
          id="bf-name"
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
        <Label htmlFor="bf-phone">Phone number</Label>
        <Input
          id="bf-phone"
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
        <Label htmlFor="bf-service">What do you need?</Label>
        <Controller
          control={control}
          name="service"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="bf-service" className="w-full bg-white">
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
        <Label htmlFor="bf-doctor">Preferred doctor</Label>
        <Controller
          control={control}
          name="doctor"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="bf-doctor" className="w-full bg-white">
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
                {doctors.map((d) => (
                  <SelectItem key={d.slug} value={d.slug}>
                    {d.name}
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
              aria-labelledby="bf-consent-label"
              className="mt-0.5 shrink-0"
            />
          )}
        />
        <p className="text-sm leading-snug text-muted-foreground">
          <span id="bf-consent-label">
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
