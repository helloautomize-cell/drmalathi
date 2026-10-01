import type { Metadata } from "next";
import { CTABand } from "@/components/cards/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
      <PageHeader
        eyebrow="FAQ"
        title="Questions families ask us"
        subtitle="Plain-language answers about our scans, NIPT, preparation, and appointments. If you have a question that is not covered, call us."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <Section>
        <Container className="max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold text-ink">
            Scans, tests, and appointments
          </h2>
          <Accordion>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-ink">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-8 rounded-2xl bg-blush p-5 text-xs leading-relaxed text-muted-foreground">
            These answers are general guidance and are not a substitute for
            medical advice about your specific pregnancy. In keeping with the
            PCPNDT Act, 1994, we do not perform or disclose sex determination.
          </p>
        </Container>
      </Section>
      <Section className="pt-0">
        <CTABand />
      </Section>
    </>
  );
}
