import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { site } from "@/data/site";
import { legal, legalDateLabel } from "@/data/legal";

export const metadata: Metadata = {
  title: "Accessibility Statement for This Website",
  description:
    "How the Trichy Fetal Medicine and Fertility Centre website is designed for accessibility, and how to contact us about access needs.",
  alternates: { canonical: "/accessibility" },
  robots: { index: !legal.accessibility.draftPendingReview },
};

const h2 = "scroll-mt-24 text-xl font-semibold text-ink";

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Accessibility Statement"
        intro={`Last updated: ${legalDateLabel(legal.accessibility.lastUpdated)}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Accessibility" }]}
      />
      <Section>
        <Container className="max-w-3xl">
          <div className="mt-6 space-y-6 text-base text-pretty text-muted-foreground md:mt-0">
            <p>
              {site.name} wants this website to be usable by everyone,
              including people who use screen readers, keyboard navigation, or
              reduced-motion settings. This statement is a draft pending legal
              and client review.
            </p>

            <h2 id="standard" className={h2}>Standard we aim for</h2>
            <p>
              The website is built against WCAG 2.2 level AA: semantic page
              structure, labelled form controls, sufficient colour contrast,
              visible focus states, and respect for reduced-motion preferences.
            </p>

            <h2 id="what-we-do" className={h2}>What is in place</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Content works without JavaScript for reading pages.</li>
              <li>Forms can be completed with a keyboard alone.</li>
              <li>Animations are reduced when the device asks for it.</li>
              <li>Phone and WhatsApp contact is offered alongside every form.</li>
            </ul>

            <h2 id="known-limits" className={h2}>Known limits</h2>
            <p>
              Some PDF documents and older images may not yet have full text
              alternatives. We are reviewing these and will update this page
              as gaps are fixed.
            </p>

            <h2 id="feedback" className={h2}>Feedback</h2>
            <p>
              If something on this website is hard to use, tell us and we will
              try to fix it. Write to{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>{" "}
              or call {site.phones[0].label}.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
