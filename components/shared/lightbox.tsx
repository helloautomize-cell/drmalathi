"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type LightboxImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Shared photo lightbox (Gallery and CME pages). `index === null` means
 * closed. ArrowLeft/ArrowRight navigate, horizontal swipe works on touch,
 * and Escape/close come from the underlying Dialog.
 */
export function Lightbox({
  images,
  index,
  onIndexChange,
}: {
  images: LightboxImage[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}) {
  const touchStartX = useRef<number | null>(null);

  const step = useCallback(
    (delta: number) => {
      if (index === null || images.length === 0) return;
      onIndexChange((index + delta + images.length) % images.length);
    },
    [index, images.length, onIndexChange]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const image = index !== null ? images[index] : null;

  return (
    <Dialog
      open={index !== null}
      onOpenChange={(open) => {
        if (!open) onIndexChange(null);
      }}
    >
      <DialogContent className="w-[calc(100%-2rem)] max-w-4xl gap-3 border-0 bg-plum/95 p-4 text-white shadow-lift sm:p-5">
        <DialogTitle className="sr-only">Photo viewer</DialogTitle>
        <DialogDescription className="sr-only">
          {image ? image.alt : "Photo viewer"}
        </DialogDescription>
        {image ? (
          <>
            <div
              className="relative flex items-center justify-center"
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null) return;
                const delta =
                  event.changedTouches[0].clientX - touchStartX.current;
                touchStartX.current = null;
                if (Math.abs(delta) < 50) return;
                step(delta < 0 ? 1 : -1);
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 60vw, 90vw"
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain"
              />
              {images.length > 1 ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Previous photo"
                    onClick={() => step(-1)}
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/90 text-plum hover:bg-white"
                  >
                    <ChevronLeft aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Next photo"
                    onClick={() => step(1)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/90 text-plum hover:bg-white"
                  >
                    <ChevronRight aria-hidden="true" />
                  </Button>
                </>
              ) : null}
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <p className="min-w-0 flex-1 text-white/85">{image.alt}</p>
              <p className="shrink-0 text-white/60">
                {(index ?? 0) + 1} of {images.length}
              </p>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
