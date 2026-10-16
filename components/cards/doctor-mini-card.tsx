import Image from "next/image";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Doctor } from "@/data/doctors";

/**
 * Compact doctor card used inside service detail pages and the About team
 * strip, where the full DoctorCard is too tall.
 */
export function DoctorMiniCard({ doctor }: { doctor: Doctor }) {
  const inner = (
    <>
      <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-blush">
        <Image
          src={doctor.photo}
          alt={doctor.photoAlt ?? `Portrait of ${doctor.name}`}
          fill
          sizes="56px"
          placeholder="blur"
          blurDataURL={imageBlurDataURL}
          className="object-cover"
          style={{
            objectPosition: `${doctor.photoFocus.x}% ${doctor.photoFocus.y}%`,
          }}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">
          {doctor.name}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {doctor.role}
        </span>
      </span>
      {doctor.hasProfile ? (
        <ArrowRight
          className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  return doctor.hasProfile ? (
    <Link
      href={`/doctors/${doctor.slug}`}
      className="group flex w-full min-w-0 items-center gap-4 rounded-2xl border border-rose-tint bg-white p-4 shadow-soft transition-shadow hover:shadow-card"
    >
      {inner}
    </Link>
  ) : (
    <div className="flex w-full min-w-0 items-center gap-4 rounded-2xl border border-rose-tint bg-white p-4 shadow-soft">
      {inner}
    </div>
  );
}
