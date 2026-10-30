import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";

const previewImages = [
  {
    src: "/images/banners/banner6.webp",
    alt: "Ultrasound machine and exam bed in the centre's scan room",
    className: "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto",
    sizes: "(min-width: 768px) 66vw, 100vw",
  },
  {
    src: "/images/banners/banner2.webp",
    alt: "Families in the waiting area at the centre",
    className: "aspect-square max-md:hidden",
    sizes: "(min-width: 768px) 33vw, 50vw",
  },
  {
    src: "/images/banners/banner1.webp",
    alt: "The reception desk at the centre",
    className: "aspect-square",
    sizes: "(min-width: 768px) 33vw, 50vw",
  },
  {
    src: "/images/banners/banner4.webp",
    alt: "Microscope workstation in the centre's laboratory",
    className: "aspect-square",
    sizes: "(min-width: 768px) 33vw, 50vw",
  },
  {
    src: "/images/banners/banner5.webp",
    alt: "Recovery ward with beds and privacy curtains",
    className: "aspect-square",
    sizes: "(min-width: 768px) 33vw, 50vw",
  },
  {
    src: "/images/banners/banner3.webp",
    alt: "The centre building on Annamalai Nagar Main Road",
    className: "col-span-2 aspect-[2/1] md:col-span-1 md:aspect-square",
    sizes: "(min-width: 768px) 33vw, 100vw",
  },
];

export function GalleryPreview() {
  return (
    <Section surface="blush" className="md:bg-blush">
      <Container>
        <SectionHeader
          eyebrow="Our clinic"
          title="Inside the centre"
          subtitle="Scan and consulting rooms designed around your comfort and privacy."
        />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {previewImages.map((image) => (
            <li
              key={image.src}
              className={cn(
                "group relative overflow-hidden rounded-2xl shadow-soft",
                image.className
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes={image.sizes}
                placeholder="blur"
                blurDataURL={imageBlurDataURL}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            nativeButton={false}
            className="bg-white max-md:min-h-12 max-md:w-full max-md:rounded-full"
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
