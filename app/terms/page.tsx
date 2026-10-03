import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { OnThisPage } from "@/components/shared/on-this-page";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing the use of the Trichy Fetal Medicine and Fertility Centre website.",
  alternates: { canonical: "/terms" },
};

const toc = [
  { id: "educational-content", label: "Educational content" },
  { id: "appointments", label: "Appointments" },
  { id: "no-sex-determination", label: "No sex determination" },
  { id: "intellectual-property", label: "Intellectual property" },
  { id: "accuracy", label: "Accuracy" },
  { id: "contact", label: "Contact" },
];

const h2 = "scroll-mt-24 text-xl font-semibold text-ink";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        intro={`Last updated: ${new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
      />
      <Section>
        <Container className="max-w-3xl">
          <OnThisPage items={toc} />
          <div className="mt-6 space-y-6 text-base text-pretty text-muted-foreground md:mt-0">
            <p>
              By using this website you accept these terms. This is a draft
              pending legal and client review.
            </p>

            <h2 id="educational-content" className={h2}>Educational content</h2>
            <p>
              The content on this website is provided for general education. It
              is not a substitute for professional medical advice, diagnosis, or
              treatment, and it does not create a doctor-patient relationship.
              Always seek the advice of a qualified doctor about your specific
              situation.
            </p>

            <h2 id="appointments" className={h2}>Appointments</h2>
            <p>
              Submitting a request through this website does not confirm an
              appointment. Our team will contact you to confirm a time. In an
              emergency, do not use this website; call the centre on{" "}
              {site.phones[0].label} or go to the nearest hospital.
            </p>

            <h2 id="no-sex-determination" className={h2}>No sex determination</h2>
            <p>
              In full compliance with the PCPNDT Act, 1994, this centre does not
              perform or support the determination or disclosure of the sex of
              the fetus, which is a criminal offence in India. Do not contact us
              with such requests.
            </p>

            <h2 id="intellectual-property" className={h2}>Intellectual property</h2>
            <p>
              Text, images, and other content on this website belong to {site.name}
              and may not be reproduced without written permission.
            </p>

            <h2 id="accuracy" className={h2}>Accuracy</h2>
            <p>
              We work to keep information current, but services, timings, and
              details may change. Please confirm specifics with the centre
              before relying on them.
            </p>

            <h2 id="contact" className={h2}>Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
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
