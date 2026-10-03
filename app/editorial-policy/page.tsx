import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { site } from "@/data/site";
import { legal, legalDateLabel } from "@/data/legal";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "How medical content on the Trichy Fetal Medicine and Fertility Centre website is written, reviewed and kept up to date.",
  alternates: { canonical: "/editorial-policy" },
  robots: { index: !legal.editorialPolicy.draftPendingReview },
};

const h2 = "scroll-mt-24 text-xl font-semibold text-ink";

export default function EditorialPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Editorial Policy"
        intro={`Last updated: ${legalDateLabel(legal.editorialPolicy.lastUpdated)}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Editorial Policy" }]}
      />
      <Section>
        <Container className="max-w-3xl">
          <div className="mt-6 space-y-6 text-base text-pretty text-muted-foreground md:mt-0">
            <p>
              This page explains how the medical information on this website is
              produced. This is a draft pending legal and client review.
            </p>

            <h2 id="who-writes" className={h2}>Who writes our content</h2>
            <p>
              Medical content on this website is written for {site.name} by its
              clinical team. Service pages and patient guides describe what
              happens at this centre; they are not a substitute for a personal
              consultation.
            </p>

            <h2 id="review" className={h2}>Review before publication</h2>
            <p>
              A guide or medical page is published only after a doctor on the
              team has reviewed it. Pages under review are not shown to the
              public. Reviewed pages carry a review note naming the reviewer
              and the review date.
            </p>

            <h2 id="sources" className={h2}>Sources</h2>
            <p>
              Content follows accepted obstetric and fetal medicine practice
              and, where relevant, guidance from professional bodies such as
              ISUOG and the Fetal Medicine Foundation. Indian law, including
              the PCPNDT Act, 1994, governs what may be described or offered.
            </p>

            <h2 id="claims" className={h2}>Claims and comparisons</h2>
            <p>
              This website does not publish success rates, outcome statistics,
              or comparative claims that the centre cannot document. Any claim
              of a first or a distinction is made only where the centre holds
              supporting records.
            </p>

            <h2 id="updates" className={h2}>Updates and corrections</h2>
            <p>
              Pages are dated when the content last changed. If a correction is
              needed, the page is updated and the date revised. To flag an
              error, write to{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
