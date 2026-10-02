"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox, type LightboxImage } from "@/components/shared/lightbox";

/** Thumbnail grid that opens the shared Lightbox. Used on the CME page. */
export function PhotoGrid({ images }: { images: LightboxImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, i) => (
          <li
            key={image.src}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="absolute inset-0 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label={`View photo: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading={i < 4 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 hover:scale-105 motion-reduce:hover:scale-100"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        images={images}
        index={openIndex}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}
