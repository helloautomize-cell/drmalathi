import { CalendarCheck } from "lucide-react";
import { cn } from "cn";
import { BookingCta } from "@/components/booking/booking-sheet";
import type { Service } from "@/data/services";

/** In-article booking card rendered for cta blocks. */
export function GuideCtaBlock({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-8 rounded-2xl border border-rose-tint bg-white p-5 shadow-soft",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-tint text-primary">
          <CalendarCheck className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-[19px]/[26px] font-semibold text-ink">
            {service.name}
          </p>
          <p className="mt-1 line-clamp-2 text-base/[26px] text-ink-muted">
            {service.shortDescription}
          </p>
        </div>
      </div>
      <BookingCta
        source="guide-cta"
        service={service.slug}
        label="Book this scan"
        className="mt-4 w-full"
      />
    </div>
  );
}
