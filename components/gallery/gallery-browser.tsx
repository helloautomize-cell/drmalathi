"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import {
  galleryCategories,
  galleryImages,
  type GalleryCategoryId,
} from "@/data/gallery";
import { Lightbox } from "@/components/shared/lightbox";

type Filter = "all" | GalleryCategoryId;

export function GalleryBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const chips = useMemo(
    () => [
      { id: "all" as const, label: "All" },
      ...galleryCategories.filter((category) =>
        galleryImages.some((image) => image.category === category.id)
      ),
    ],
    []
  );

  const visible = useMemo(
    () =>
      filter === "all"
        ? galleryImages
        : galleryImages.filter((image) => image.category === filter),
    [filter]
  );

  return (
    <>
      <div
        role="group"
        aria-label="Filter photos by area"
        className="mb-8 flex gap-2 max-md:sticky max-md:top-[60px] max-md:z-30 max-md:-mx-4 max-md:overflow-x-auto max-md:border-b max-md:border-rose-tint max-md:bg-white/95 max-md:px-4 max-md:py-2 max-md:backdrop-blur max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:flex-wrap"
      >
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            aria-pressed={filter === chip.id}
            onClick={() => setFilter(chip.id)}
            className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
              filter === chip.id
                ? "border-primary bg-primary text-white"
                : "border-rose-tint bg-white text-ink hover:bg-blush"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <ul className="columns-2 gap-4 space-y-4 sm:columns-3 lg:columns-4">
        {visible.map((image, i) => (
          <li key={image.src} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="block w-full overflow-hidden rounded-2xl shadow-soft transition-shadow hover:shadow-card focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label={`View photo: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading={i < 4 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                placeholder="blur"
                blurDataURL={imageBlurDataURL}
                className="h-auto w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        images={visible}
        index={openIndex}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}
