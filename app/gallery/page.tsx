import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from inside Trichy Fetal Medicine and Fertility Centre: our reception, scan rooms, waiting area, and the team at work.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Gallery", href: "/gallery" },
        ])}
      />
      <PageHero
        eyebrow="Gallery"
        title="Inside the centre"
        intro="A look at our reception, scan rooms, waiting areas, and the spaces where we care for families."
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <Section>
        <Container>
          <GalleryBrowser />
        </Container>
      </Section>
    </>
  );
}
