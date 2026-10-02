import { Baby, MessageCircle, ScanSearch, Users } from "lucide-react";
import Image from "next/image";
import { ProofCard, type ProofCardData } from "@/components/cards/proof-card";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";

const proofCards: ProofCardData[] = [
  {
    icon: ScanSearch,
    title: "Specialist-only scanning",
    body: "Every scan is performed or supervised by a fetal medicine specialist.",
    quote: { text: "explained every single detail", name: "Manisha" },
  },
  {
    icon: Baby,
    title: "Twin and multiple pregnancy care",
    body: "Dedicated monitoring and care plans for twins and multiples.",
    quote: { text: "they saved my twins", name: "Deva" },
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
    title: "Counselling under one roof",
    body: "In-house genetic counselling, so families are not sent from place to place.",
  },
];



export function WhyChooseUs() {
  return (
    <Section className="bg-blush">
      <Container>
        <SectionHeader
          eyebrow="Why families choose us"
          title="Care you can trust, in their words"
        />
        <div className="grid items-center gap-10 lg:grid-cols-[420px_1fr] lg:gap-16">
          <figure className="mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-soft">
              <Image
                src="/images/gallery/g10.webp"
                alt="The team at the grand opening of Trichy Fetal Medicine and Fertility Centre"
                fill
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 448px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted-foreground">
              Inside our centre on grand opening day, Thillai Nagar, Trichy.
            </figcaption>
          </figure>
          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2">
            {proofCards.map((card) => (
              <ProofCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
