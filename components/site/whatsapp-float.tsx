import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { site } from "@/data/site";

export function WhatsAppFloat() {
  return (
    <a
      href={site.whatsapp.messageHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp at ${site.whatsapp.label}`}
      className="fixed right-6 bottom-6 z-40 hidden size-14 items-center justify-center rounded-full bg-teal text-white shadow-card transition-transform hover:scale-105 md:flex"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
