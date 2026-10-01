import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";

const previewImages = [
  { src: "/images/gallery/g2.webp", alt: "Consultation room at the centre", ratio: "aspect-[4/5]" },
  { src: "/images/banners/banner7.webp", alt: "Ultrasound scan room at the centre", ratio: "aspect-[4/3]" },
  { src: "/images/gallery/g5.webp", alt: "Waiting area inside the centre", ratio: "aspect-square" },
  { src: "/images/gallery/g8.webp", alt: "Reception corridor at the centre", ratio: "aspect-[4/5]" },
  { src: "/images/gallery/g10.webp", alt: "Doctor reviewing a scan with a family", ratio: "aspect-[4/3]" },
  { src: "/images/misc/feature.jpg", alt: "The centre's team and facilities", ratio: "aspect-square" },
  { src: "/images/gallery/g13.webp", alt: "Equipment and care space at the centre", ratio: "aspect-[4/3]" },
  { src: "/images/banners/banner3.webp", alt: "The centre building on Annamalai Nagar Main Road", ratio: "aspect-[4/5]" },
];

export function GalleryPreview() {
  return (
    <Section className="bg-blush">
      <Container>
        <SectionHeader
          eyebrow="Our clinic"
          title="Inside the centre"
          subtitle="A calm, welcoming space designed around your comfort and privacy."
        />
        <ul className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
          {previewImages.map((image, i) => (
            <li
              key={image.src}
              className="group relative break-inside-avoid overflow-hidden rounded-2xl shadow-soft"
            >
              <div className={`relative w-full ${image.ratio}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading={i < 4 ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            nativeButton={false}
            className="bg-white"
            render={<Link href="/gallery" />}
          >
            View full gallery
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
