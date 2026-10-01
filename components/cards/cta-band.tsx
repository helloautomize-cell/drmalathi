import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandImage } from "@/components/shared/brand-image";
import { Container } from "@/components/shared/container";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { site } from "@/data/site";

export function CTABand({
  title = "Book your appointment",
  subtitle = "Call us, message us on WhatsApp, or send a request and our team will call you back to schedule your visit.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <Container>
      <div className="relative overflow-hidden rounded-3xl bg-plum shadow-card">
        <div
          className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-accent-soft/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="grid lg:grid-cols-[1.2fr_1fr]">
          <div className="relative px-6 py-12 text-center md:px-12 md:py-16 lg:text-left">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-white/80">{subtitle}</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center">
              <Button
                size="lg"
                nativeButton={false}
                className="bg-white text-plum hover:bg-rose-tint"
                render={<a href={site.phones[0].href} />}
              >
                <Phone aria-hidden="true" />
                Call {site.phones[0].label}
              </Button>
              <Button
                size="lg"
                nativeButton={false}
                className="bg-teal text-white hover:bg-teal/85"
                render={
                  <a
                    href={site.whatsapp.messageHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <WhatsAppIcon aria-hidden="true" />
                WhatsApp Us
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/70">
              {site.hours} |{" "}
              <Link href="/contact" className="underline underline-offset-4 hover:text-white">
                Book online instead
              </Link>
            </p>
          </div>
          <div
            className="relative min-h-56 lg:min-h-0"
            aria-hidden="true"
          >
            <BrandImage
              slug="family-bw-newborn"
              variant="bleed"
              fill
              decorative
              reveal={false}
              sizes="(min-width: 1024px) 40vw, 100vw"
              imgClassName="[mask-image:linear-gradient(to_bottom,transparent_0%,black_45%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_40%)]"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
