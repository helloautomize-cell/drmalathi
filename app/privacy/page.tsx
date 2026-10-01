import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Trichy Fetal Medicine and Fertility Centre collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle={`Last updated: ${new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
      />
      <Section>
        <Container className="max-w-3xl">
          <div className="prose-sm space-y-6 text-muted-foreground">
            <p>
              {site.name} respects your privacy. This policy explains what
              information we collect through this website, why we collect it,
              and how we keep it safe. This is a draft pending legal and client
              review.
            </p>

            <h2 className="text-xl font-semibold text-ink">What we collect</h2>
            <p>
              When you use our appointment or callback forms we collect your
              name, phone number, and your preferred doctor. We collect only
              what is needed to respond to your request. We do not ask for
              medical records through this website.
            </p>

            <h2 className="text-xl font-semibold text-ink">How we use it</h2>
            <p>
              The information you submit is used only to contact you about your
              enquiry and to arrange your appointment. It is emailed to the
              centre&apos;s administrative team and is not sold, rented, or shared
              with advertisers.
            </p>

            <h2 className="text-xl font-semibold text-ink">WhatsApp and calls</h2>
            <p>
              If you contact us on WhatsApp or by phone, that conversation is
              handled by the centre&apos;s team. WhatsApp&apos;s own privacy
              policy also applies to messages sent through that service.
            </p>

            <h2 className="text-xl font-semibold text-ink">Analytics</h2>
            <p>
              We may use privacy-respecting analytics to understand how the
              website is used. Analytics data is aggregated and is not used to
              identify individual visitors.
            </p>

            <h2 className="text-xl font-semibold text-ink">Your rights</h2>
            <p>
              You can ask us to correct or delete the information you have
              shared with us at any time by writing to{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>
              .
            </p>

            <h2 className="text-xl font-semibold text-ink">Contact</h2>
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
