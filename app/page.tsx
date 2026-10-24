import type { Metadata } from "next";
import { CTABand } from "@/components/cards/cta-band";
import { DoctorsSection } from "@/components/home/doctors-section";
import { FaqSection } from "@/components/home/faq-section";
import { FellowshipHighlight } from "@/components/home/fellowship-highlight";
import { FirstsStrip } from "@/components/home/firsts-strip";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { GuidesSection } from "@/components/home/guides-section";
import { HelpRow } from "@/components/home/help-row";
import { Hero } from "@/components/home/hero";
import { ServicesSection } from "@/components/home/services-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { VisitSteps } from "@/components/home/visit-steps";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/shared/section";
import { TrustSlots } from "@/components/shared/trust-slots";
import { faqs } from "@/data/faqs";
import { site } from "@/data/site";
import { hasPublishedGuides } from "@/lib/guides";
import {
  faqNode,
  medicalClinicNode,
  pageGraph,
  webPageNode,
  webSiteNode,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "Fetal Medicine Specialists in Trichy | FMC Trichy",
  description:
    "Specialist pregnancy scans, NIPT and genetic counselling in Trichy, performed or supervised by fetal medicine specialists. Book an appointment.",
  alternates: { canonical: "/" },
};

// Below md the sections follow the mobile story order (CSS order); at md and
// up the wrappers collapse via `md:contents` so the desktop order is untouched.
export default function HomePage() {
  return (
    <>
      <JsonLd
        data={pageGraph([
          webSiteNode(),
          webPageNode("/", "Fetal Medicine Specialists in Trichy", site.description),
          medicalClinicNode(),
          faqNode(faqs, "/"),
        ])}
      />
      <div className="flex flex-col md:contents">
        <Hero />
        <FirstsStrip />
        <div className="order-2 md:contents">
          <HelpRow />
        </div>
        <div className="order-3 md:contents">
          <ServicesSection />
        </div>
        <div className="order-4 md:contents">
          <DoctorsSection />
        </div>
        <div className="order-5 md:contents">
          <WhyChooseUs />
        </div>
        <div className="order-6 md:contents">
          <TestimonialsSection />
        </div>
        <div className="order-7 md:contents">
          <VisitSteps />
        </div>
        <div className="order-8 md:contents">
          <FellowshipHighlight />
        </div>
        <div className="order-9 md:contents">
          <GalleryPreview />
        </div>
        <div className="order-10 md:contents">
          <TrustSlots />
        </div>
        <div className="order-11 md:contents">
          {hasPublishedGuides() ? <GuidesSection /> : null}
        </div>
        <div className="order-12 md:contents">
          <FaqSection />
        </div>
        <div className="order-13 md:contents">
          <Section surface="blush" className="md:bg-white md:py-16">
            <CTABand />
          </Section>
        </div>
      </div>
    </>
  );
}
