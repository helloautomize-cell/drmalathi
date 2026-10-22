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
        className="w-full gap-0 overflow-y-auto sm:max-w-[480px]!"
      >
        <SheetHeader className="shrink-0 border-b border-border px-5 pt-3 pb-4 md:px-6 md:pt-6">
          <SheetTitle className="text-xl font-semibold text-ink">
            Book appointment
          </SheetTitle>
          <SheetDescription>
            Leave your details and our team will call you back to schedule your
            visit.
          </SheetDescription>
        </SheetHeader>
        <BookingForm
          source={source}
          service={service}
          doctor={doctor}
          layout="sheet"
          onDone={() => onOpenChange(false)}
          trailing={
            <>
              <div
                className="flex items-center gap-3 text-xs text-muted-foreground"
                aria-hidden="true"
              >
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <a
                  href={site.phones[0].href}
                  className="flex h-24 items-center gap-3 rounded-2xl border border-rose-tint bg-white p-4 shadow-soft transition-colors hover:border-primary/40"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal">
                    <Phone className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">
                      Prefer to call?
                    </span>
                    <span className="mt-0.5 block whitespace-nowrap text-sm font-semibold text-primary">
                      {site.phones[0].label}
                    </span>
                  </span>
                </a>
                {/* Desktop and tablet only: a phone cannot scan its own
                    screen, so on mobile the call tile spans the row. */}
                <div className="hidden h-24 items-center rounded-2xl border border-rose-tint bg-white p-4 shadow-soft md:flex">
                  <BookingQr
                    variant="tile"
                    heading="Prefer your phone?"
                    subline="Scan to book there"
                    link={false}
                  />
                </div>
              </div>
            </>
          }
        />
      </SheetContent>
    </Sheet>
  );
}
