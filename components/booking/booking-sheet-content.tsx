"use client";

import { Phone } from "lucide-react";
import { BookingQr } from "@/components/booking-qr";
import { BookingForm } from "@/components/forms/booking-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { site } from "@/data/site";

/** Sheet contents for BookingCta; chunk loads only after first interaction. */
export default function BookingSheetContent({
  open,
  onOpenChange,
  source,
  service,
  doctor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: string;
  service?: string;
  doctor?: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto sm:max-w-md lg:max-w-2xl"
      >
        <SheetHeader className="border-b border-border px-5 pt-3 pb-4 md:px-6 md:pt-6">
          <SheetTitle className="text-xl font-semibold text-ink">
            Book appointment
          </SheetTitle>
          <SheetDescription>
            Leave your details and our team will call you back to schedule your
            visit.
          </SheetDescription>
        </SheetHeader>
        <div className="px-5 py-5 md:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_190px] lg:gap-6">
          <div>
            <BookingForm
              source={source}
              service={service}
              doctor={doctor}
              stickySubmit
              onDone={() => onOpenChange(false)}
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
          {/* Desktop only: a phone cannot scan its own screen, and on small
              viewports the sheet stays a single column. */}
          <BookingQr
            heading="Prefer your phone?"
            subline="Scan to continue there"
            link={false}
            className="hidden lg:block"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
