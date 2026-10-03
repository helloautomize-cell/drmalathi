import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

/**
 * Shown when a lead form cannot be delivered (email env vars missing or the
 * provider rejected the send). Replaces the success flow so the person can
 * still reach the clinic directly and the enquiry is never lost silently.
 */
export function ContactFallbackPanel({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-tint bg-blush p-6"
    >
      <p className="text-base font-semibold text-ink">{message}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Reach us directly and our team will help you right away.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          nativeButton={false}
          className="bg-primary text-white hover:bg-primary-hover"
          render={<a href={site.phones[0].href} />}
        >
          <Phone aria-hidden="true" />
          Call {site.phones[0].label}
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          className="border-teal text-teal hover:bg-teal-tint hover:text-teal"
          render={
            <a
              href={site.whatsapp.messageHref}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <WhatsAppIcon aria-hidden="true" />
          WhatsApp us
        </Button>
      </div>
    </div>
  );
}
