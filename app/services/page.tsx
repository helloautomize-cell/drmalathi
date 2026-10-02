import type { Metadata } from "next";
import { CTABand } from "@/components/cards/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceBrowser } from "@/components/services/service-browser";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Services and Scans",
  description:
    "All scans and services at our Trichy fetal medicine centre: viability scan, OSCAR screening, anomaly scan, NIPT, fetal echo, neurosonogram, growth scans and specialty clinics.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ])}
      />
      <PageHeader
        eyebrow="Our services"
        title="Scans, diagnostics and specialty clinics"
        subtitle="Every service below is performed or supervised by a fetal medicine specialist, with findings explained to you in plain language."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <Section>
        <Container>
          <ServiceBrowser />
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <p className="mx-auto mb-10 max-w-3xl rounded-2xl border border-rose-tint bg-blush p-5 text-sm text-muted-foreground">
            In keeping with the PCPNDT Act, 1994, none of our scans or services
            involve determination or disclosure of the sex of the fetus. This is
            a criminal offence in India and is never performed at this centre.
          </p>
          <CTABand
            title="Not sure which scan you need?"
            subtitle="Call us and our team will guide you to the right appointment, or book online and we will call you back."
          />
        </Container>
      </Section>
    </>
  );
}
