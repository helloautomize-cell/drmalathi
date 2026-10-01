"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BrochureDialog({
  image,
  alt,
}: {
  image: string;
  alt: string;
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none"
          />
        }
      >
        View course brochure
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Course brochure</DialogTitle>
          <DialogDescription>
            Current course information supplied by the centre.
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-blush">
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 768px) 720px, 100vw"
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
