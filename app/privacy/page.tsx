import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { OnThisPage } from "@/components/shared/on-this-page";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { site } from "@/data/site";
import { legal, legalDateLabel } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy and How We Use Your Details",
  description:
    "How Trichy Fetal Medicine and Fertility Centre collects, uses and protects your information when you use this website or our appointment forms.",
  alternates: { canonical: "/privacy" },
  robots: { index: !legal.privacy.draftPendingReview },
};

const toc = [
  { id: "who-we-are", label: "Who we are" },
  { id: "what-we-collect", label: "What we collect" },
  { id: "purposes", label: "Why we use it" },
  { id: "who-we-share-with", label: "Who we share it with" },
  { id: "appointment-requests", label: "Appointment requests" },
  { id: "retention", label: "How long we keep it" },
  { id: "your-rights", label: "Your rights" },
  { id: "consent-withdrawal", label: "Withdrawing consent" },
  { id: "children", label: "Children's data" },
  { id: "international-patients", label: "International patients" },
  { id: "data-breach", label: "Data breach" },
  { id: "grievance", label: "Grievances" },
  { id: "changes", label: "Changes to this policy" },
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
              This is a draft pending legal and client review. It is written to
              cover the notice and processing requirements of the Digital
              Personal Data Protection Act, 2023 (DPDP Act) and the DPDP Rules,
              2025, and counsel should confirm it against the centre&apos;s
              actual practice before publication.
            </p>

            <h2 id="who-we-are" className={h2}>Who we are</h2>
            <p>
              {site.name} is the Data Fiduciary for personal data collected
              through this website. This policy covers the appointment and
              callback forms, the course enquiry form, phone calls and WhatsApp
              messages to the numbers listed on this site, and basic technical
              data generated when you browse. It does not cover your medical
              records, which are handled at the centre under separate clinical
              record-keeping obligations.
            </p>

            <h2 id="what-we-collect" className={h2}>What we collect</h2>
            <p>
              Through the appointment and callback forms we collect your name,
              phone number, your preferred doctor, service and time of day, and
              your consent to be contacted. Through the course enquiry form we
              collect your name, phone number, email address, professional
              qualification, the course you are asking about and your message.
              When you call or message us we receive your phone number and the
              contents of the conversation. The website also uses Vercel Speed
              Insights, which records anonymised performance measurements such
              as page load times; it does not use advertising trackers or
              advertising cookies.
            </p>

            <h2 id="purposes" className={h2}>Why we use it</h2>
            <p>
              We use the details you submit for one purpose: to respond to your
              request. For appointment and callback forms that means calling or
              messaging you to arrange a visit. For course enquiries it means
              answering questions about eligibility and admissions. We do not
              use your details for marketing without separate consent, and we
              do not sell or rent personal data.
            </p>

            <h2 id="who-we-share-with" className={h2}>Who we share it with</h2>
            <p>
              Form submissions are emailed to the centre&apos;s administrative
              team through Resend, our email delivery provider. The website is
              hosted by Vercel. WhatsApp conversations are subject to
              WhatsApp&apos;s own privacy policy in addition to this one. We do
              not share your personal data with anyone else unless the law
              requires it.
            </p>

            <h2 id="appointment-requests" className={h2}>
              Appointment requests
            </h2>
            <p>
              When you request an appointment, on this website or through a QR
              code at the centre, we collect your name, mobile number, the
              service you chose, your preferred doctor, your preferred date
              and time, and any optional notes you add. Please do not share
              medical reports or health details in the notes field.
            </p>
            <p>
              We use these details only to contact you about your appointment.
              They are stored in a private Google Sheet that only clinic staff
              can open, and kept for up to 12 months after the appointment
              date. To ask for a request to be corrected or deleted, call us
              on {site.phones[0].label} or email{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>
              .
            </p>

            <h2 id="retention" className={h2}>How long we keep it</h2>
            <p>
              Enquiry details are kept only for as long as needed to respond to
              your request and to run the centre&apos;s appointment records.
              The specific retention period for each record type is being
              confirmed with the client and counsel, and will be stated here
              before launch.
            </p>

            <h2 id="your-rights" className={h2}>Your rights</h2>
            <p>
              Under the DPDP Act, 2023, you have the right to access the
              personal data we hold about you, to ask for it to be corrected or
              completed, to ask for it to be erased when it is no longer needed
              for the purpose it was collected for, to have your grievances
              redressed, and to nominate someone to exercise these rights on
              your behalf. Write to{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>{" "}
              or call {site.phones[0].label} to exercise any of these rights.
            </p>

            <h2 id="consent-withdrawal" className={h2}>Withdrawing consent</h2>
            <p>
              You can withdraw your consent to be contacted at any time by
              writing to{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>{" "}
              or calling {site.phones[0].label}. Withdrawing consent does not
              affect anything we lawfully did with your data before you
              withdrew it.
            </p>

            <h2 id="children" className={h2}>Children&apos;s data</h2>
            <p>
              This website is intended for adults and does not knowingly
              collect personal data from anyone under 18. Where the DPDP Act
              requires verifiable parental or guardian consent for processing a
              child&apos;s data, that consent is obtained at the centre, not
              through this website.
            </p>

            <h2 id="international-patients" className={h2}>
              International patients
            </h2>
            <p>
              If you contact us from outside India, the personal data you share
              is processed in India under this policy. The DPDP Act, 2023
              permits transfer of personal data outside India except to
              countries restricted by the Government of India; the providers we
              use may process data on servers in other countries in line with
              that permission.
            </p>

            <h2 id="data-breach" className={h2}>Data breach</h2>
            <p>
              If a personal data breach occurs, we will inform the Data
              Protection Board of India and the individuals affected, in the
              manner and within the time the DPDP Act, 2023 and the DPDP Rules,
              2025 require.
            </p>

            <h2 id="grievance" className={h2}>Grievances</h2>
            <p>
              Questions or complaints about how your personal data is handled
              can be sent to{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>{" "}
              or raised by phone at {site.phones[0].label}.
            </p>
            {site.grievanceOfficer ? (
              <p>
                Our Grievance Officer under the DPDP Act is{" "}
                {site.grievanceOfficer.name} ({site.grievanceOfficer.designation}
                ), reachable at{" "}
                <a
                  href={`mailto:${site.grievanceOfficer.email}`}
                  className="link"
                >
                  {site.grievanceOfficer.email}
                </a>{" "}
                or {site.grievanceOfficer.phone}.
              </p>
            ) : null}

            <h2 id="changes" className={h2}>Changes to this policy</h2>
            <p>
              If this policy changes, the updated version will appear on this
              page with a revised date. Material changes will be drawn to your
              attention where the law requires it.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
