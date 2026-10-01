import type { Metadata } from "next";
import { Clock, Globe2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { QuickConsultForm } from "@/components/forms/quick-consult-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact and Appointments",
  description:
    "Book an appointment at Trichy Fetal Medicine and Fertility Centre, Thillai Nagar, Trichy. Call, WhatsApp, or request a callback. International line available.",
  alternates: { canonical: "/contact" },
};

const contactRows = [
  {
    icon: MapPin,
    label: "Address",
    value: site.address.lines.join(" "),
    href: site.address.mapsUrl,
    external: true,
  },
  ...site.phones.map((p) => ({
    icon: Phone,
    label: "Phone",
    value: p.label,
    href: p.href,
    external: false,
  })),
  {
    icon: Globe2,
    label: "International appointments",
    value: site.internationalPhone.label,
    href: site.internationalPhone.href,
    external: false,
  },
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    external: false,
  },
  {
    icon: Clock,
    label: "Timings",
    value: site.hours,
    href: undefined,
    external: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ])}
      />
      <PageHeader
        eyebrow="Contact"
        title="Book your appointment"
        subtitle="Call us, message us on WhatsApp, or send a request and our team will call you back to fix a convenient time."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <ul className="space-y-4">
              {contactRows.map((row, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-tint text-primary">
                    <row.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{row.label}</p>
                    {row.href ? (
                      <a
                        href={row.href}
                        {...(row.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="link text-muted-foreground"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{row.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button
                size="lg"
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
                <MessageCircle aria-hidden="true" />
                Message us on WhatsApp ({site.whatsapp.label})
              </Button>
            </div>

            <div className="mt-8 rounded-2xl border border-rose-tint bg-blush p-5">
              <p className="text-sm font-semibold text-ink">Find us</p>
              {/* TODO: replace the search link with the official embedded Google
                  Maps listing once the client confirms it. */}
              <a
                href={site.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link mt-1 inline-block text-sm text-muted-foreground"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-rose-tint bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-semibold text-ink">
              Request a callback
            </h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              Share your details and we will call you back to fix a convenient
              time.
            </p>
            <QuickConsultForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
