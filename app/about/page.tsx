import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, HeartHandshake, Presentation } from "lucide-react";
import { CTABand } from "@/components/cards/cta-band";
import { DoctorMiniCard } from "@/components/cards/doctor-mini-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { doctors } from "@/data/doctors";
import { advancedProcedures } from "@/data/procedures";
import { breadcrumbSchema } from "@/lib/schema";
import { foundedYear } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the Centre",
  description:
    "A dedicated fetal medicine centre in Trichy: specialist scans, advanced diagnostics, in-house counselling, and training programs for doctors.",
  alternates: { canonical: "/about" },
};

// TODO: client to confirm the founding year and the dates of each regional
// first before launch. foundedYear is a placeholder pending confirmation.
const timeline: { year?: string; title: string; text: string; href?: string }[] = [
  {
    year: String(foundedYear),
    title: "The centre is founded",
    text: "Trichy Fetal Medicine and Fertility Centre opens in Thillai Nagar, bringing dedicated fetal medicine care to the region.",
  },
  {
    title: "First in south Tamil Nadu for fetoscopic procedures",
    text: "The centre introduces fetoscopic procedures for complex twin pregnancies.",
  },
  {
    title: "First in Tamil Nadu for a dedicated fetal neurosonogram",
    text: "A dedicated fetal neurosonogram service begins for detailed brain and spine assessment.",
  },
  {
    title: "First in the region with in-house genetic counselling",
    text: "In-house genetic counselling and fetal postmortem evaluation mean families are not sent elsewhere for answers.",
  },
  {
    year: "August 2025",
    title: "ISUOG Trichy Materno-Fetal Conclave",
    text: "The centre hosts a regional conclave for doctors, held in association with ISUOG.",
    href: "/cme-activities",
  },
];

const teachingLinks = [
  {
    icon: GraduationCap,
    title: "Fellowship in fetal medicine",
    text: "Structured training for obstetricians who want to specialise in fetal medicine.",
    href: "/fellowship",
    cta: "Explore the fellowship",
  },
  {
    icon: Presentation,
    title: "CME programs and workshops",
    text: "Regular continuing education programs, conclaves and hands-on workshops hosted by the centre.",
    href: "/cme-activities",
    cta: "See CME activities",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ])}
      />
      <PageHeader
        eyebrow="About us"
        title="A centre built around the baby you cannot see yet"
        subtitle="Trichy Fetal Medicine and Fertility Centre cares for families in Trichy and across south Tamil Nadu."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <Section>
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-soft">
            <Image
              src="/images/gallery/event8.webp"
              alt="A fetal medicine specialist at the ultrasound machine inside Trichy Fetal Medicine and Fertility Centre"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeader
              align="left"
              className="mb-6 md:mb-6"
              title="Specialist care, close to home"
            />
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our centre focuses on one thing: the health of your baby before
                birth. Families come to us for detailed pregnancy scans,
                advanced fetal diagnostics, fetal procedures, and calm, honest
                counselling.
              </p>
              <p>
                Everything is explained in plain language, and you are given
                time to ask questions. When a scan raises a concern, our
                in-house genetic counselling and multidisciplinary panel mean
                you are guided at every step rather than referred elsewhere.
              </p>
              <p>
                International families are welcome and can reach us on{" "}
                <Link href="/international-patients" className="link font-semibold">
                  our international line
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-blush">
        <Container>
          <SectionHeader
            eyebrow="Our story"
            title="How the centre grew"
          />
          <ol className="relative mx-auto max-w-3xl space-y-8 border-l-2 border-rose-tint pl-8">
            {timeline.map((event) => (
              <li key={event.title} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-[41px] size-4 rounded-full border-2 border-primary bg-white"
                />
                <div className="flex flex-wrap items-center gap-3">
                  {event.year ? (
                    <span className="inline-flex items-center rounded-full bg-rose-tint px-3 py-1 text-xs font-semibold text-plum">
                      {event.year}
                    </span>
                  ) : null}
                  <h3 className="text-lg font-semibold text-ink">
                    {event.title}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.text}{" "}
                  {event.href ? (
                    <Link href={event.href} className="link font-semibold">
                      Read more
                    </Link>
                  ) : null}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="What we do"
            title="Advanced procedures under one roof"
            subtitle="From detailed scans to fetal procedures, our specialists manage complex care within the centre."
          />
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {advancedProcedures.map((procedure) => (
              <li
                key={procedure}
                className="rounded-full border border-rose-tint bg-blush px-4 py-2 text-sm font-semibold text-ink"
              >
                {procedure}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="bg-blush">
        <Container>
          <SectionHeader
            eyebrow="Teaching and training"
            title="Sharing fetal medicine with the next generation"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {teachingLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-rose-tint bg-white p-6 shadow-soft transition-shadow hover:shadow-card"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-teal-tint text-teal">
                  <item.icon
                    className="size-6"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
                  {item.cta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Our specialists"
            title="The team behind your care"
            subtitle="Fetal medicine specialists who take time to explain every finding."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorMiniCard key={doctor.slug} doctor={doctor} />
            ))}
          </div>
          <p className="mx-auto mt-10 flex max-w-2xl items-start gap-3 rounded-2xl border border-rose-tint bg-blush p-5 text-sm text-muted-foreground">
            <HeartHandshake
              className="mt-0.5 size-5 shrink-0 text-teal"
              aria-hidden="true"
            />
            Our centre complies fully with the PCPNDT Act, 1994. We do not
            perform or support sex determination, which is a criminal offence in
            India.
          </p>
        </Container>
      </Section>

      <Section className="pt-0">
        <CTABand />
      </Section>
    </>
  );
}
