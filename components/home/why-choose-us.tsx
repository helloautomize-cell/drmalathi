import { Award, Clock, MessageCircle, Users } from "lucide-react";
import Image from "next/image";
import { FeatureCard } from "@/components/cards/feature-card";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { yearsOfCare } from "@/lib/site";

const features = [
  {
    icon: Clock,
    title: `${yearsOfCare()} years focused on fetal medicine`,
    description:
      "A state-of-the-art centre dedicated to fetal medicine for over a decade, serving families across the region.",
  },
  {
    icon: Award,
    title: "Regional firsts",
    description:
      "First for fetoscopic procedures in south Tamil Nadu, first fetal neurosonogram centre in Tamil Nadu, and first with in-house genetic counselling and fetal postmortem.",
  },
  {
    icon: Users,
    title: "Multidisciplinary panel",
    description:
      "Complex findings are reviewed together by a panel of specialists, so decisions are made carefully, not alone.",
  },
  {
    icon: MessageCircle,
    title: "Time taken to explain",
    description:
      "Our doctors take time to explain every finding in plain language, so you leave with answers, not confusion.",
  },
];

export function WhyChooseUs() {
  return (
    <Section className="bg-blush">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          <div className="relative mx-auto aspect-[3/2] w-full max-w-md overflow-hidden rounded-3xl shadow-soft">
            <Image
              src="/images/gallery/event9.webp"
              alt="A doctor at the ultrasound console with a fetal scan on screen at Trichy Fetal Medicine and Fertility Centre"
              fill
              sizes="(min-width: 1024px) 416px, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-3 text-sm font-bold tracking-[0.14em] uppercase text-primary">
              Why choose us
            </p>
            <h2 className="text-3xl font-semibold text-ink md:text-4xl">
              Care you can trust
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Quality healthcare from qualified doctors, with research and
              teaching at the heart of what we do.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
