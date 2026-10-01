import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faqs";

export function FaqSection() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <SectionHeader
          eyebrow="Questions"
          title="Frequently asked questions"
          subtitle="Answers about our scans, tests, and how to prepare for your visit."
        />
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-base font-semibold text-ink hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground [&_a]:text-primary">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Still have a question?{" "}
          <Link href="/contact" className="link font-semibold">
            Contact us
          </Link>{" "}
          or{" "}
          <Link href="/faq" className="link font-semibold">
            read all FAQs
          </Link>
          .
        </p>
      </Container>
    </Section>
  );
}
