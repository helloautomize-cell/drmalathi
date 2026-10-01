import type { Metadata } from "next";
import { CTABand } from "@/components/cards/cta-band";
import { DoctorsSection } from "@/components/home/doctors-section";
import { FaqSection } from "@/components/home/faq-section";
import { FellowshipHighlight } from "@/components/home/fellowship-highlight";
import { FirstsStrip } from "@/components/home/firsts-strip";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { Hero } from "@/components/home/hero";
import { ServicesSection } from "@/components/home/services-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { WhyFetalMedicine } from "@/components/home/why-fetal-medicine";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/shared/section";
import { TrustSlots } from "@/components/shared/trust-slots";
import { medicalClinicSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Fetal Medicine Specialists in Trichy",
  description:
    "Specialist pregnancy scans, NIPT, fetal procedures, and genetic counselling in Trichy. First centre for fetoscopic procedures in south Tamil Nadu. Book an appointment.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={medicalClinicSchema()} />
      <Hero />
      <FirstsStrip />
      <WhyFetalMedicine />
      <ServicesSection />
      <DoctorsSection />
      <FellowshipHighlight />
      <WhyChooseUs />
      <TestimonialsSection />
      <GalleryPreview />
      <TrustSlots />
      <Section className="py-14 md:py-16">
        <CTABand />
      </Section>
      <FaqSection />
    </>
  );
}
