"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

// The sheet + booking form (base-ui form controls) load on first
// interaction only; nothing form-related reaches the shared layout chunk.
const BookingSheetContent = dynamic(
  () => import("@/components/booking/booking-sheet-content"),
  { ssr: false }
);

/**
 * Single booking entry point. Every CTA on the site opens the booking sheet
 * with `source` (lead attribution) and optional `service`/`doctor` prefilled.
 *
 * Usage:
 *   <BookingCta source="hero" label="Book a consultation" />
 *   <BookingCta source="service-page" service="anomaly-scan" label="Book this scan" />
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
  variant?: "primary" | "light" | "outline-teal" | "outline-white" | "bare";
  size?: "default" | "sm" | "lg";
  className?: string;
  /** Custom clickable element; renders instead of the default button. */
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [preload, setPreload] = useState(false);

  const buttonClass = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    light: "bg-white text-plum hover:bg-rose-tint",
    "outline-teal": "border-teal text-teal hover:bg-teal-tint hover:text-teal",
    "outline-white":
      "border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white",
    bare: "",
  }[variant];

  return (
    <>
      {trigger ? (
        <span
          className="contents"
          data-ga="appointment"
          onPointerEnter={() => setPreload(true)}
          onFocus={() => setPreload(true)}
          onClick={() => {
            setPreload(true);
            setOpen(true);
          }}
        >
          {trigger}
        </span>
      ) : (
        <Button
          size={size}
          nativeButton={true}
          data-ga="appointment"
          className={`max-md:min-h-12 max-md:w-full max-md:rounded-full ${buttonClass} ${className ?? ""}`}
          onPointerEnter={() => setPreload(true)}
          onFocus={() => setPreload(true)}
          onClick={() => {
            setPreload(true);
            setOpen(true);
          }}
        >
          {icon ? <CalendarCheck aria-hidden="true" /> : null}
          {label ?? "Book appointment"}
        </Button>
      )}
      {preload ? (
        <BookingSheetContent
          open={open}
          onOpenChange={setOpen}
          source={source}
          service={service}
          doctor={doctor}
        />
      ) : null}
    </>
  );
}
