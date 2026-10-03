import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GuideCard } from "@/components/guides/guide-card";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { MobileSectionHeader } from "@/components/shared/mobile-section-header";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { getNewestGuides } from "@/lib/guides";
import { toGuideCardData } from "@/lib/guide-card-data";

/**
 * "From our patient guides" before the FAQ. Hidden when there are no
 * published guides. Mobile uses the shared carousel; desktop is a grid.
 */
export function GuidesSection() {
  const cards = getNewestGuides(3).map(toGuideCardData);
  if (cards.length === 0) return null;

  return (
    <Section surface="white" className="max-md:pb-0">
      <Container>
        <MobileSectionHeader
          eyebrow="Patient guides"
          title="From our patient guides"
          subline="Clear, practical answers from our fetal medicine team."
        />
        <div className="mt-6 md:hidden">
          <MobileCarousel
            label="Latest patient guides"
            items={cards.map((g) => <GuideCard key={g.slug} guide={g} />)}
          />
        </div>
        <div className="mt-6 hidden gap-6 md:grid md:grid-cols-3">
          {cards.map((g) => (
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
        <Link
          href="/guides"
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-rose-tint font-semibold text-ink hover:bg-blush md:mx-auto md:w-auto md:px-6"
        >
          View all guides
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Container>
    </Section>
  );
}
