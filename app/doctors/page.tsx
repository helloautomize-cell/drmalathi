import type { Metadata } from "next";
import { DoctorCard } from "@/components/cards/doctor-card";
import { CTABand } from "@/components/cards/cta-band";
import {
  LeadDoctorCard,
  TeamDoctorMiniCard,
} from "@/components/home/doctors-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { doctors } from "@/data/doctors";
import {
  breadcrumbNode,
  pageGraph,
  webPageNode,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "Our Fetal Medicine Specialists in Trichy",
  description:
    "Meet the fetal medicine specialists at Trichy Fetal Medicine and Fertility Centre: Dr Malathi G. Prasad, Dr Revathy Chandrasekharan, and Dr Nivethitha.",
  alternates: { canonical: "/doctors" },
};

export default function DoctorsPage() {
  return (
    <>
      <JsonLd
        data={pageGraph([
          webPageNode("/doctors", metadata.title as string, metadata.description as string),
          breadcrumbNode([
            { label: "Home", href: "/" },
            { label: "Doctors", href: "/doctors" },
          ]),
        ])}
      />
      <PageHero
        eyebrow="Our doctors"
        title="Specialists who take the time"
        intro="Every scan and procedure is performed or supervised by a fetal medicine specialist who explains the findings and answers your questions."
        crumbs={[{ label: "Home", href: "/" }, { label: "Doctors" }]}
      />
      <Section>
        <Container>
          {/* Mobile: lead card plus a team carousel, same cards as home. */}
          <div className="md:hidden">
            <h2 className="sr-only">Our specialists</h2>
            <LeadDoctorCard doctor={doctors[0]} priority />
            {doctors.length > 1 ? (
              <div className="mt-8">
                <MobileCarousel
                  label="All specialists"
                  items={doctors.slice(1).map((doctor) => (
                    <TeamDoctorMiniCard key={doctor.slug} doctor={doctor} />
                  ))}
                />
              </div>
            ) : null}
          </div>

          {/* Desktop: uniform card grid, unchanged. */}
          <h2 className="sr-only">Our specialists</h2>
          <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor, index) => (
              <DoctorCard key={doctor.slug} doctor={doctor} priority={index === 0} />
            ))}
          </div>
        </Container>
      </Section>
      <Section surface="blush" className="pt-0 md:bg-white">
        <CTABand />
      </Section>
    </>
  );
}
