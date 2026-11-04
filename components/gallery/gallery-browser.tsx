"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import dynamic from "next/dynamic";
import {
  galleryCategories,
  galleryImages,
  galleryImagesFor,
  type GalleryCategoryId,
} from "@/data/gallery";

// Lightbox (dialog + next/image) loads only when a photo is opened.
const Lightbox = dynamic(
  () => import("@/components/shared/lightbox").then((m) => m.Lightbox),
  { ssr: false }
);

export type GalleryFilter = "all" | GalleryCategoryId;

export function GalleryBrowser({
  initialFilter = "all",
}: {
  /** Validated on the page from ?tab=; "all" when absent or unknown. */
  initialFilter?: GalleryFilter;
}) {
  const [filter, setFilter] = useState<GalleryFilter>(initialFilter);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const chips = useMemo(
    () => [
      { id: "all" as const, label: "All" },
      ...galleryCategories.filter(
        (category) => galleryImagesFor(category.id).length > 0
      ),
    ],
    []
  );

  const visible = useMemo(
    () =>
      filter === "all" ? galleryImages : galleryImagesFor(filter),
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
              {image.eventTitle ? (
                <span className="block bg-white px-3 py-2 text-left text-xs font-semibold text-ink-muted">
                  {image.eventTitle}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {filter === "cme" ? (
        <p className="mt-8 text-center text-base text-ink-muted">
          Conclaves, workshops and hands-on training we have hosted for
          doctors.{" "}
          <Link
            href="/cme-activities"
            className="link font-semibold whitespace-nowrap"
          >
            View all CME activities
          </Link>
        </p>
      ) : null}

      {openIndex !== null ? (
        <Lightbox
          images={visible}
          index={openIndex}
          onIndexChange={setOpenIndex}
        />
      ) : null}
    </>
  );
}
