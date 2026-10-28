import { BookingCta } from "@/components/booking/booking-sheet";
import {
  formatWeekWindow,
  SHOW_DRAFT_WEEK_WINDOWS,
  type Service,
} from "@/data/services";

/**
 * Slim booking bar pinned just above the 64px mobile bottom bar on service
 * pages. Carries the shared `data-mobile-bottom-bar` attribute so it hides
 * automatically while the menu, a sheet or a dialog is open.
 */
export function ServiceBookingBar({ service }: { service: Service }) {
  return (
    <>
      {/* Flow spacer so the fixed bar never covers page content. */}
      <div aria-hidden="true" className="h-16 md:hidden" />
      <div
        data-mobile-bottom-bar
        data-ga-location="sticky"
        className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 border-t border-rose-tint bg-white px-4 py-2 shadow-[0_-4px_20px_rgb(61_15_42/0.10)] md:hidden"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-tint text-primary">
            <service.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink">
              {service.name}
            </span>
            {SHOW_DRAFT_WEEK_WINDOWS && service.weeks ? (
              <span className="block text-xs text-ink-muted">
                {formatWeekWindow(service.weeks)}
              </span>
            ) : null}
          </span>
          <BookingCta
            source="service-page-mobile"
            service={service.slug}
            variant="bare"
            trigger={
              <button
                type="button"
                className="min-h-11 rounded-full bg-primary px-5 text-sm font-bold whitespace-nowrap text-white"
              >
                Book this scan
              </button>
            }
          />
        </div>
      </div>
    </>
  );
}
