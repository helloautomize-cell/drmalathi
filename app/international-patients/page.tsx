import type { Metadata } from "next";
import Link from "next/link";
import { Globe2, Mail, MessageCircle, Phone, Plane, Video } from "lucide-react";
import { CTABand } from "@/components/cards/cta-band";
import { BookingForm } from "@/components/forms/booking-form";
import { IstHoursNote } from "@/components/international/ist-hours-note";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { site } from "@/data/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "International Patients",
  description:
    "Planning to visit Trichy Fetal Medicine and Fertility Centre from abroad? Dedicated international appointments line, remote report reviews, and travel guidance.",
  alternates: { canonical: "/international-patients" },
};

const steps = [
  {
    icon: Phone,
    title: "Call the international line",
    text: `Reach us directly on ${site.internationalPhone.label} to discuss your situation and plan your visit.`,
  },
  {
    icon: Video,
    title: "Share your reports first",
    text: "Send your scan reports and medical records ahead of your visit so our specialists can review them and plan what is needed.",
  },
  {
    icon: Plane,
    title: "Plan your visit",
    text: "We will help you schedule scans and consultations together so your time in Trichy is used well.",
  },
];

// DRAFT FOR CLIENT REVIEW: FAQ answers below are new plain-language copy
// pending client and medical team approval.
const faqs = [
  {
    question: "How do I share my reports?",
    answer: `Email them to ${site.email} with the subject "International patient: reports", or send them on WhatsApp to our international line, ${site.internationalPhone.label}. Scan reports, images and referral letters all help us plan your visit.`,
  },
  {
    question: "How are scans grouped across my visit days?",
    answer:
      "Share your expected travel window and we will plan your scans and consultations together, so your time in Trichy is used efficiently and repeat trips are avoided where possible.",
  },
  {
    question: "How do I reach the team from abroad?",
    answer: `Call or WhatsApp the international line on ${site.internationalPhone.label}, or email ${site.email}. We answer during centre hours, Monday to Friday, 9:00 AM to 9:00 PM IST.`,
  },
];

const reportsMailto = `mailto:${site.email}?subject=${encodeURIComponent(
  "International patient: reports"
)}`;

export default function InternationalPatientsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "International Patients", href: "/international-patients" },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />
      <PageHeader
        eyebrow="International patients"
        title="Visiting us from abroad"
        subtitle="Families travel to Trichy for our specialist fetal medicine care. A dedicated line and pre-visit reviews make the trip easier."
        crumbs={[{ label: "Home", href: "/" }, { label: "International Patients" }]}
      />

      <Section>
        <Container>
          <SectionHeader
            align="left"
            title="How it works"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="rounded-2xl border border-rose-tint bg-white p-6 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-rose-tint text-primary">
                    <s.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-blush">
        <Container className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold text-ink">
              Talk to us before you travel
            </h2>
            <p className="mt-3 text-muted-foreground">
              The fastest way to plan is a call or WhatsApp message on our
              international line. Share your reports and your expected travel
              window, and we will suggest a schedule of scans and consultations.
            </p>
            <IstHoursNote />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                nativeButton={false}
                className="bg-primary text-white hover:bg-primary-hover"
                render={<a href={site.internationalPhone.href} />}
              >
                <Phone aria-hidden="true" />
                {site.internationalPhone.label}
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                className="border-teal text-teal hover:bg-teal-tint hover:text-teal"
                render={
                  <a
                    href={site.whatsappInternational.messageHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <MessageCircle aria-hidden="true" />
                WhatsApp us
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                className="border-teal text-teal hover:bg-teal-tint hover:text-teal"
                render={<a href={reportsMailto} />}
              >
                <Mail aria-hidden="true" />
                Email your reports
              </Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Visiting from within India?{" "}
              <Link href="/contact" className="link font-semibold">
                Use our regular appointment options
              </Link>
              .
            </p>
          </div>
          <div className="rounded-2xl border border-rose-tint bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-teal-tint text-teal">
                <Globe2 className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-ink">What to send us</h3>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Your latest scan reports and any earlier ultrasound images.</li>
              <li>Relevant medical records: blood tests, prescriptions, discharge summaries.</li>
              <li>Your referral letter, if your doctor provided one.</li>
              <li>Your expected travel window so we can group appointments together.</li>
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            align="left"
            title="Common questions from international families"
          />
          <Accordion className="mx-auto max-w-3xl">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="mx-auto max-w-xl rounded-2xl border border-rose-tint bg-white p-6 shadow-soft sm:p-8">
            <SectionHeader
              align="left"
              title="Send us your details"
              subtitle="Tell us how to reach you and we will call or WhatsApp you back to plan your visit."
            />
            <BookingForm source="international" />
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <CTABand
          title="Ready to plan your visit?"
          subtitle="Call the international line or message us on WhatsApp and our team will guide you through the next steps."
          variant="international"
        />
      </Section>
    </>
  );
}
