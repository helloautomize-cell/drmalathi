import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from inside Trichy Fetal Medicine and Fertility Centre: our reception, scan rooms, waiting area, and the team at work.",
  alternates: { canonical: "/gallery" },
};

const images = Array.from(
  { length: 16 },
  (_, i) => `/images/gallery/g${i + 1}.webp`
);

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Gallery", href: "/gallery" },
        ])}
      />
      <PageHeader
        eyebrow="Gallery"
        title="Inside the centre"
        subtitle="A look at our reception, scan rooms, waiting areas, and the spaces where we care for families."
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <Section>
        <Container>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((src, i) => (
              <li
                key={src}
                className="relative aspect-square overflow-hidden rounded-2xl shadow-soft"
              >
                <Image
                  src={src}
                  alt={`Trichy Fetal Medicine and Fertility Centre, photo ${i + 1}`}
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
