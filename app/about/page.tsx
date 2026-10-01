import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, HeartHandshake, ScanHeart, Users } from "lucide-react";
import { CTABand } from "@/components/cards/cta-band";
import { DoctorCard } from "@/components/cards/doctor-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { doctors } from "@/data/doctors";
import { breadcrumbSchema } from "@/lib/schema";
import { yearsOfCare } from "@/lib/site";

const years = yearsOfCare();

export const metadata: Metadata = {
  title: "About the Centre",
  description:
    `A state-of-the-art fetal medicine centre in Trichy for ${years} years: first for fetoscopic procedures in south Tamil Nadu and first for fetal neurosonogram in Tamil Nadu.`,
  alternates: { canonical: "/about" },
};

const facts = [
  {
    icon: ScanHeart,
    title: "Fetoscopic procedures",
    text: "The first centre in south Tamil Nadu to perform fetoscopic procedures.",
  },
  {
    icon: Award,
    title: "Fetal neurosonogram",
    text: "The first centre in Tamil Nadu to offer a dedicated fetal neurosonogram.",
  },
  {
    icon: Users,
    title: "In-house genetics",
    text: "The first centre in the region with in-house genetic counselling and fetal postmortem.",
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
        subtitle={`Trichy Fetal Medicine and Fertility Centre has cared for families in Trichy and across south Tamil Nadu for ${years} years.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <Section>
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-soft">
            <Image
              src="/images/gallery/event8.webp"
              alt="A doctor at the ultrasound machine in a scan room at Trichy Fetal Medicine and Fertility Centre"
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
                For {years} years our centre has focused on one thing: the
                health of your baby before birth. Families come to us for detailed
                pregnancy scans, advanced fetal diagnostics, fetal procedures,
                and calm, honest counselling.
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
            eyebrow="Regional firsts"
            title={`First in the region, trusted for ${years} years`}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {facts.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-rose-tint bg-white p-6 shadow-soft"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-rose-tint text-primary">
                  <f.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-rose-tint bg-white p-5 text-sm text-muted-foreground">
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

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Our specialists"
            title="The team behind your care"
            subtitle="Fetal medicine specialists who take time to explain every finding."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.slug} doctor={doctor} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <CTABand />
      </Section>
    </>
  );
}
