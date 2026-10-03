import type { Metadata } from "next";
import { CTABand } from "@/components/cards/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqBrowser } from "@/components/faq/faq-browser";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { faqs } from "@/data/faqs";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about fetal medicine scans, NIPT, anomaly scans, preparation, and appointments at our Trichy centre.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "FAQ", href: "/faq" },
        ])}
      />
      <PageHero
        eyebrow="FAQ"
        title="Questions families ask us"
        intro="Plain-language answers about our scans, NIPT, preparation, and appointments. If you have a question that is not covered, call us."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <Section>
        <Container className="max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold text-ink max-md:hidden">
            Scans, tests, and appointments
          </h2>
          <FaqBrowser />
          <p className="mt-8 rounded-2xl bg-blush p-5 text-xs leading-relaxed text-muted-foreground">
            These answers are general guidance and are not a substitute for
            medical advice about your specific pregnancy. In keeping with the
            PCPNDT Act, 1994, we do not perform or disclose sex determination.
          </p>
        </Container>
      </Section>
      <Section surface="blush" className="pt-0 md:bg-white">
        <CTABand />
      </Section>
    </>
  );
}
