"use client";

import { useState, type ReactNode } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import { BookingForm } from "@/components/forms/booking-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

/**
 * Single booking entry point. Every CTA on the site opens this sheet with
 * `source` (lead attribution) and optional `service`/`doctor` prefilled.
 *
 * Usage:
 *   <BookingCta source="hero" label="Book a consultation" />
 *   <BookingCta source="service-page" service="anomaly-scan" label="Book this scan" />
 *   <BookingCta source="nav" trigger={<custom element />} />
 */
export function BookingCta({
  source,
  service,
  doctor,
  label,
  icon = true,
  variant = "primary",
  size = "lg",
  className,
  trigger,
}: {
  source: string;
  service?: string;
  doctor?: string;
  label?: string;
  icon?: boolean;
  /** "primary" = solid rose, "light" = white on dark bands, "bare" = unstyled trigger. */
  variant?: "primary" | "light" | "outline-teal" | "bare";
  size?: "default" | "sm" | "lg";
  className?: string;
  /** Custom trigger element instead of the standard Button. */
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const buttonClass = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    light: "bg-white text-plum hover:bg-rose-tint",
    "outline-teal": "border-teal text-teal hover:bg-teal-tint hover:text-teal",
    bare: "",
  }[variant];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? (
        <SheetTrigger render={trigger as never} />
      ) : (
        <SheetTrigger
          render={
            <Button
              size={size}
              nativeButton={true}
              className={`${buttonClass} ${className ?? ""}`}
            />
          }
        >
          {icon ? <CalendarCheck aria-hidden="true" /> : null}
          {label ?? "Book an appointment"}
        </SheetTrigger>
      )}
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 pt-6 pb-4">
          <SheetTitle className="text-xl font-semibold text-ink">
            Book an appointment
          </SheetTitle>
          <SheetDescription>
            Leave your details and our team will call you back to schedule your
            visit.
          </SheetDescription>
        </SheetHeader>
        <div className="px-6 py-5">
          <BookingForm
            source={source}
            service={service}
            doctor={doctor}
            onDone={() => setOpen(false)}
          />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Prefer to call?{" "}
            <a
              href={site.phones[0].href}
              className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              {site.phones[0].label}
            </a>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
