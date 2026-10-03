import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { OnThisPage } from "@/components/shared/on-this-page";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { site } from "@/data/site";
import { legal, legalDateLabel } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Trichy Fetal Medicine and Fertility Centre collects, uses and protects your information when you use this website or our appointment forms.",
  alternates: { canonical: "/privacy" },
};

const toc = [
  { id: "what-we-collect", label: "What we collect" },
  { id: "how-we-use-it", label: "How we use it" },
  { id: "whatsapp-and-calls", label: "WhatsApp and calls" },
  { id: "analytics", label: "Analytics" },
  { id: "your-rights", label: "Your rights" },
  { id: "contact", label: "Contact" },
];

const h2 = "scroll-mt-24 text-xl font-semibold text-ink";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        intro={`Last updated: ${legalDateLabel(legal.privacy.lastUpdated)}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
      />
      <Section>
        <Container className="max-w-3xl">
          <OnThisPage items={toc} />
          <div className="mt-6 space-y-6 text-base text-pretty text-muted-foreground md:mt-0">
            <p>
              {site.name} respects your privacy. This policy explains what
              information we collect through this website, why we collect it,
              and how we keep it safe. This is a draft pending legal and client
              review.
            </p>

            <h2 id="what-we-collect" className={h2}>What we collect</h2>
            <p>
              When you use our appointment or callback forms we collect your
              name, phone number, and your preferred doctor. We collect only
              what is needed to respond to your request. We do not ask for
              medical records through this website.
            </p>

            <h2 id="how-we-use-it" className={h2}>How we use it</h2>
            <p>
              The information you submit is used only to contact you about your
              enquiry and to arrange your appointment. It is emailed to the
              centre&apos;s administrative team and is not sold, rented, or shared
              with advertisers.
            </p>

            <h2 id="whatsapp-and-calls" className={h2}>WhatsApp and calls</h2>
            <p>
              If you contact us on WhatsApp or by phone, that conversation is
              handled by the centre&apos;s team. WhatsApp&apos;s own privacy
              policy also applies to messages sent through that service.
            </p>

            <h2 id="analytics" className={h2}>Analytics</h2>
            <p>
              We may use privacy-respecting analytics to understand how the
              website is used. Analytics data is aggregated and is not used to
              identify individual visitors.
            </p>

            <h2 id="your-rights" className={h2}>Your rights</h2>
            <p>
              You can ask us to correct or delete the information you have
              shared with us at any time by writing to{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>
              .
            </p>

            <h2 id="contact" className={h2}>Contact</h2>
            <p>
              Questions about this policy can be sent to{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>{" "}
              or raised by phone at {site.phones[0].label}.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
