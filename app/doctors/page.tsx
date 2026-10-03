import type { Metadata } from "next";
import { DoctorCard } from "@/components/cards/doctor-card";
import { CTABand } from "@/components/cards/cta-band";
import {
  LeadDoctorCard,
  TeamDoctorMiniCard,
} from "@/components/home/doctors-section";
import { JsonLd } from "@/components/seo/json-ld";
import { BrandImage } from "@/components/shared/brand-image";
import { Container } from "@/components/shared/container";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { doctors } from "@/data/doctors";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Our Doctors",
  description:
    "Meet the fetal medicine specialists at Trichy Fetal Medicine and Fertility Centre: Dr Malathi G. Prasad, Dr Revathy Chandrasekharan, and Dr Nivethitha.",
  alternates: { canonical: "/doctors" },
};

export default function DoctorsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/doctors" },
        ])}
      />
      <PageHero
        eyebrow="Our doctors"
        title="Specialists who take the time"
        intro="Every scan and procedure is performed or supervised by a fetal medicine specialist who explains findings in plain language."
        crumbs={[{ label: "Home", href: "/" }, { label: "Doctors" }]}
      />
      <Section>
        <Container>
          {/* Mobile: lead card plus a team carousel, same cards as home. */}
          <div className="md:hidden">
            <LeadDoctorCard doctor={doctors[0]} />
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
          <div className="mb-8 hidden items-center justify-end md:flex">
            {/* Decorative illustration, capped at source resolution (~181px). */}
            <BrandImage
              slug="doctor-glowing-fetus"
              variant="rounded"
              decorative
              reveal={false}
              sizes="140px"
              className="w-28 opacity-90 shadow-soft sm:w-32"
            />
          </div>
          <h2 className="sr-only">Our specialists</h2>
          <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.slug} doctor={doctor} />
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
