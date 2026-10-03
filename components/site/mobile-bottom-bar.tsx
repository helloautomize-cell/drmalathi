import { CalendarCheck, Phone } from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { site } from "@/data/site";

const cellClass =
  "flex h-16 flex-col items-center justify-center gap-0.5 text-[13px]/[20px] font-semibold";

export function MobileBottomBar() {
  return (
    <nav
      aria-label="Quick contact"
      data-mobile-bottom-bar
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgb(61_15_42/0.10)] md:hidden"
    >
      <a href={site.phones[0].href} className={`${cellClass} text-ink hover:bg-muted`}>
        <Phone className="size-5" aria-hidden="true" />
        Call
      </a>
      <a
        href={site.whatsapp.messageHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cellClass} text-ink hover:bg-muted`}
      >
        <WhatsAppIcon className="size-5" aria-hidden="true" />
        WhatsApp
      </a>
      <BookingCta
        source="mobile-bar"
        variant="bare"
        trigger={
          <button
            type="button"
            className={`${cellClass} w-full bg-primary font-bold text-white`}
          >
            <CalendarCheck className="size-5" aria-hidden="true" />
            Book
          </button>
        }
      />
    </nav>
  );
}
