import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { site } from "@/data/site";

const items = [
  {
    label: "Call",
    href: site.phones[0].href,
    icon: Phone,
    external: false,
  },
  {
    label: "WhatsApp",
    href: site.whatsapp.messageHref,
    icon: WhatsAppIcon,
    external: true,
  },
  {
    label: "Book",
    href: "/contact",
    icon: CalendarCheck,
    external: false,
    primary: true,
  },
];

export function MobileBottomBar() {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgb(61_15_42/0.10)] md:hidden"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const className = item.primary
          ? "flex min-h-14 flex-col items-center justify-center gap-0.5 bg-primary text-xs font-bold text-white"
          : "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold text-ink hover:bg-muted";

        return item.external ? (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            <Icon className="size-5" aria-hidden="true" />
            {item.label}
          </a>
        ) : item.href.startsWith("/") ? (
          <Link key={item.label} href={item.href} className={className}>
            <Icon className="size-5" aria-hidden="true" />
            {item.label}
          </Link>
        ) : (
          <a key={item.label} href={item.href} className={className}>
            <Icon className="size-5" aria-hidden="true" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
