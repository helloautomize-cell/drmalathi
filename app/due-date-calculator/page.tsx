import type { Metadata } from "next";
import { DueDateCalculator } from "@/components/calculator/due-date-calculator";
import { JsonLd } from "@/components/seo/json-ld";
import { BrandImage } from "@/components/shared/brand-image";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Due Date Calculator",
  description:
    "Work out your estimated due date and see which pregnancy scans are usually due at your stage. Free tool from Trichy Fetal Medicine and Fertility Centre.",
  alternates: { canonical: "/due-date-calculator" },
};

export default function DueDateCalculatorPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Due Date Calculator", href: "/due-date-calculator" },
        ])}
      />
      <PageHeader
        eyebrow="Free tool"
        title="Due date calculator"
        subtitle="Enter the first day of your last period to see your estimated due date and the scans usually offered at your stage."
        crumbs={[{ label: "Home", href: "/" }, { label: "Due Date Calculator" }]}
      />
      <Section>
        <Container className="grid max-w-4xl items-start gap-8 lg:grid-cols-[1fr_15rem]">
          <div className="max-w-2xl">
            <DueDateCalculator />
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              This estimate is a general guide only. Your doctor will confirm
              your dates and the right schedule for you. This page is
              educational and is not a substitute for medical advice.
            </p>
          </div>
          <BrandImage
            slug="pregnancy-test-stork"
            variant="arch"
            sizes="(min-width: 1024px) 240px, 50vw"
            className="mx-auto hidden w-full max-w-60 shadow-soft lg:block"
          />
        </Container>
      </Section>
    </>
  );
}
