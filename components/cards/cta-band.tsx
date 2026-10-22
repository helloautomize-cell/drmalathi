import { Phone } from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { BookingQrCard } from "@/components/booking-qr-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { site } from "@/data/site";

export function CTABand({
  title = "Book your appointment",
  subtitle = "Call us, message us on WhatsApp, or send a request and our team will call you back to schedule your visit.",
  variant = "default",
}: {
  title?: string;
  subtitle?: string;
  /** "international" routes both actions to the international patient line. */
  variant?: "default" | "international";
}) {
  const phone =
    variant === "international" ? site.internationalPhone : site.phones[0];
  const whatsapp =
    variant === "international"
      ? site.whatsappInternational
      : site.whatsapp;
  // The CTA photo slot is empty: family-bw-newborn is parked (watermark/
  // licence unresolved) and is not rendered or loaded anywhere.
  return (
    <Container>
      <div className="relative overflow-hidden rounded-3xl bg-plum shadow-card">
        <div
          className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-accent-soft/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="grid lg:grid-cols-[1.2fr_1fr]">
          <div className="relative p-5 text-center md:px-12 md:py-16 lg:text-left">
            <h2 className="text-[26px]/[32px] font-semibold text-balance text-white md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-pretty text-white/80">{subtitle}</p>
            {/* Below md: three full-width actions stacked. */}
            <div className="mt-6 flex flex-col gap-3 md:hidden">
              <BookingCta
                source="cta-band"
                label="Book appointment"
                variant="light"
                icon={false}
              />
              <Button
                size="lg"
                nativeButton={false}
                className="min-h-12 w-full rounded-full border-white/60 bg-transparent text-white hover:bg-white/10"
                render={<a href={phone.href} />}
              >
                <Phone aria-hidden="true" />
                Call {phone.label}
              </Button>
              <Button
                size="lg"
                nativeButton={false}
                className="min-h-12 w-full rounded-full bg-teal text-white hover:bg-teal/85"
                render={
                  <a
                    href={whatsapp.messageHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <WhatsAppIcon aria-hidden="true" />
                WhatsApp us
              </Button>
            </div>
            {/* md and up: one row; wraps on narrower widths. */}
            <div className="mt-8 hidden flex-wrap items-center justify-center gap-3 md:flex lg:justify-start">
              <BookingCta
                source="cta-band"
                label="Book appointment"
                variant="light"
                icon={false}
              />
              <Button
                size="lg"
                nativeButton={false}
                className="border-white/60 bg-transparent text-white hover:bg-white/10"
                render={<a href={phone.href} />}
              >
                <Phone aria-hidden="true" />
                Call {phone.label}
              </Button>
              <Button
                size="lg"
                nativeButton={false}
                className="bg-teal text-white hover:bg-teal/85"
                render={
                  <a
                    href={whatsapp.messageHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <WhatsAppIcon aria-hidden="true" />
                WhatsApp us
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/70">{site.hours}</p>
          </div>
          {/* Right column on lg+: the website booking QR card. */}
          <div className="relative hidden items-center justify-center p-8 lg:flex">
            <BookingQrCard variant="band" className="relative" />
          </div>
        </div>
      </div>
    </Container>
  );
}
