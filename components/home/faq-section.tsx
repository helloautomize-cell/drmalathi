import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
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
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className={index >= 5 ? "max-md:hidden" : undefined}
            >
              <AccordionTrigger className="text-base font-semibold text-ink hover:no-underline max-md:min-h-14 max-md:py-3">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base/[26px] text-muted-foreground md:text-sm [&_a]:text-primary">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-6 md:hidden">
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            className="min-h-12 w-full rounded-full bg-white"
            render={<Link href="/faq" />}
          >
            See all questions
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
        <p className="mt-8 hidden text-center text-sm text-muted-foreground md:block">
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
