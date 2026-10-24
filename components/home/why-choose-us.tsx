import { Baby, MessageCircle, ScanSearch, Users } from "lucide-react";
import Image from "next/image";
import { ProofCard, type ProofCardData } from "@/components/cards/proof-card";
import { Container } from "@/components/shared/container";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { advancedProcedures } from "@/data/procedures";
import { testimonials } from "@/data/testimonials";
import { imageBlurDataURL } from "@/lib/image-placeholder";

// Quotes reuse the consented testimonials only; while consent is pending the
// quote slot stays empty instead of leaking unapproved words into production.
const consentedQuote = (name: string, fragment: string) => {
  const t = testimonials.find(
    (item) =>
      item.name === name &&
      item.consentOnFile === true &&
      item.quote.includes(fragment)
  );
  return t ? { text: fragment, name } : undefined;
};

const proofCards: ProofCardData[] = [
  {
    icon: ScanSearch,
    title: "Specialist-only scanning",
    body: "Every scan is performed or supervised by a fetal medicine specialist.",
    quote: consentedQuote("Manisha Margrete", "explained every single detail"),
  },
  {
    icon: Baby,
    title: "Twin and multiple pregnancy care",
    body: "Scan schedules and care plans for twins and multiples.",
    quote: consentedQuote("Deva", "they saved my twins"),
    href: "/services/twin-specialised-clinic",
    linkLabel: "Visit the Twin Specialised Clinic",
  },
  {
    icon: Users,
    title: "Multidisciplinary panel",
    body: "Complex findings are reviewed together by a panel of specialists.",
  },
  {
    icon: MessageCircle,
    title: "In-house counselling",
    body: "In-house genetic counselling, so families are not sent from place to place.",
  },
];



export function WhyChooseUs() {
  return (
    <Section surface="blush">
      <Container>
        <SectionHeader
          eyebrow="Why families choose us"
          title="Care you can trust, in their words"
        />
        <div className="grid items-center gap-6 md:gap-10 lg:grid-cols-[420px_1fr] lg:gap-16">
          <figure className="mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft md:aspect-[4/5]">
              <Image
                src="/images/gallery/event9.webp"
                alt="A fetal medicine specialist at the ultrasound console during a scan"
                fill
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 448px, 100vw"
                placeholder="blur"
                blurDataURL={imageBlurDataURL}
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted-foreground">
              Inside our scan room, Thillai Nagar, Trichy.
            </figcaption>
          </figure>
          <MobileCarousel
            label="Why families choose us"
            className="md:grid md:auto-rows-fr md:grid-cols-2 md:gap-5"
            items={proofCards.map((card) => (
              <ProofCard key={card.title} {...card} />
            ))}
          />
        </div>
        {/* Mobile only: procedure chips wrap below the proof cards. */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 md:hidden">
          {advancedProcedures.map((procedure) => (
            <span
              key={procedure}
              className="rounded-full border border-primary/15 bg-white px-3 py-1.5 text-[13px]/[20px] font-semibold text-plum"
            >
              {procedure}
            </span>
          ))}
        </div>
      </Container>
    </Section>
  );
}
