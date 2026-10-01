import type { Metadata } from "next";
import Image from "next/image";
import { FileText, Presentation } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "CME Activities",
  description:
    "Continuing medical education activities at Trichy Fetal Medicine and Fertility Centre, including the ISUOG Trichy Materno-Fetal Conclave.",
  alternates: { canonical: "/cme-activities" },
};

const eventImages = Array.from(
  { length: 10 },
  (_, i) => `/images/gallery/event${i + 1}.webp`
);

export default function CmeActivitiesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "CME Activities", href: "/cme-activities" },
        ])}
      />
      <PageHeader
        eyebrow="Education"
        title="CME activities"
        subtitle="The centre regularly hosts continuing medical education programs, workshops, and masterclasses in fetal medicine."
        crumbs={[{ label: "Home", href: "/" }, { label: "CME Activities" }]}
      />

      <Section>
        <Container>
          <div className="flex flex-col gap-5 rounded-2xl border border-rose-tint bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-tint text-teal">
              <Presentation className="size-7" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-ink">
                ISUOG Trichy Materno-Fetal Conclave
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Program details from our recent conclave, hosted in association
                with ISUOG.
              </p>
            </div>
            <a
              href="/docs/ISUOG-Trichy-Materno-Fetal-Conclave.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-rose-tint"
            >
              <FileText className="size-4 shrink-0" aria-hidden="true" />
              View program (PDF)
            </a>
          </div>

          <SectionHeader
            align="left"
            className="mt-14"
            title="From our programs"
            subtitle="Moments from workshops, CME programs, and training sessions held at the centre."
          />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {eventImages.map((src, i) => (
              <li
                key={src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft"
              >
                <Image
                  src={src}
                  alt={`Fetal medicine CME program at the centre, photo ${i + 1}`}
                  fill
                  loading={i < 4 ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
