import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { site } from "@/data/site";
import { legal, legalDateLabel } from "@/data/legal";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description:
    "Medical disclaimer for the Trichy Fetal Medicine and Fertility Centre website: educational information, not personal medical advice, and our PCPNDT position.",
  alternates: { canonical: "/medical-disclaimer" },
  robots: { index: !legal.medicalDisclaimer.draftPendingReview },
};

const h2 = "scroll-mt-24 text-xl font-semibold text-ink";

export default function MedicalDisclaimerPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Medical Disclaimer"
        intro={`Last updated: ${legalDateLabel(legal.medicalDisclaimer.lastUpdated)}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Medical Disclaimer" }]}
      />
      <Section>
        <Container className="max-w-3xl space-y-8">
          {legal.medicalDisclaimer.draftPendingReview ? (
            <p className="rounded-xl border border-rose-tint bg-blush p-4 text-sm text-muted-foreground">
              This page is a draft pending legal and client review.
            </p>
          ) : null}

          <section id="educational-information">
            <h2 className={h2}>Educational information only</h2>
            <div className="mt-3 space-y-3 text-base/[26px] text-muted-foreground">
              <p>
                The content on this website, including service pages, patient
                guides and frequently asked questions, is provided by{" "}
                {site.name} for general education. It is not medical advice,
                diagnosis or treatment, and it is not a substitute for a
                consultation with a qualified doctor who knows your history.
              </p>
              <p>
                Every pregnancy is different. Decisions about your care should
                be made with your own obstetrician or specialist after a proper
                evaluation.
              </p>
            </div>
          </section>

          <section id="no-doctor-patient-relationship">
            <h2 className={h2}>No doctor and patient relationship</h2>
            <p className="mt-3 text-base/[26px] text-muted-foreground">
              Reading this website or contacting us through it does not create
              a doctor and patient relationship. If you have a medical emergency,
              severe pain, heavy bleeding or reduced fetal movements, contact
              your obstetrician or the nearest hospital immediately rather than
              waiting for a reply from this website.
            </p>
          </section>

          <section id="accuracy">
            <h2 className={h2}>Accuracy of medical content</h2>
            <p className="mt-3 text-base/[26px] text-muted-foreground">
              Medical knowledge changes over time. Our guides are reviewed by
              our clinical team before publication and carry a review date, but
              we cannot warrant that every page is complete, current or free of
              error. Where a page cites a source, that source remains the
              reference of record.
            </p>
          </section>

          <section id="pcpndt">
            <h2 className={h2}>PCPNDT Act</h2>
            <p className="mt-3 text-base/[26px] text-muted-foreground">
              In keeping with the Pre-Conception and Pre-Natal Diagnostic
              Techniques (PCPNDT) Act, 1994, determination or disclosure of the
              sex of the fetus is a criminal offence in India and is not
              performed or supported at this centre under any circumstances.
              Nothing on this website should be read as offering or implying
              sex determination.
            </p>
          </section>

          <section id="contact">
            <h2 className={h2}>Questions</h2>
            <p className="mt-3 text-base/[26px] text-muted-foreground">
              For questions about this disclaimer or our content, call us on{" "}
              {site.phones.map((p) => p.label).join(" or ")} or email{" "}
              {site.email}.
            </p>
          </section>
        </Container>
      </Section>
    </>
  );
}
