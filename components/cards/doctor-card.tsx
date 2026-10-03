import Image from "next/image";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { Card, CardContent } from "@/components/ui/card";
import type { Doctor } from "@/data/doctors";
import { showPending } from "@/lib/env";

export function DoctorCard({
  doctor,
  priority = false,
}: {
  doctor: Doctor;
  priority?: boolean;
}) {
  return (
    <Card data-mobile-card="image" className="h-full overflow-hidden border-rose-tint bg-white pt-0 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card motion-reduce:hover:translate-y-0">
      <div className="bg-gradient-to-b from-rose-tint to-blush px-8 pt-8">
        <div className="relative mx-auto h-72 w-full max-w-56 overflow-hidden rounded-t-full">
          <Image
            src={doctor.photo}
            alt={`Portrait of ${doctor.name}, fetal medicine consultant`}
            fill
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            sizes="(min-width: 1024px) 224px, (min-width: 640px) 40vw, 60vw"
            placeholder="blur"
            blurDataURL={imageBlurDataURL}
            className="object-cover"
            style={{
              objectPosition: `${doctor.photoFocus.x}% ${doctor.photoFocus.y}%`,
            }}
          />
        </div>
      </div>
      <CardContent className="flex h-full flex-col p-6 pt-5">
        <h3 className="text-xl font-semibold text-ink">{doctor.name}</h3>
        {doctor.roleIsPlaceholder && !showPending ? null : (
          <p className="mt-1.5 text-sm text-muted-foreground">{doctor.role}</p>
        )}
        <p className="mt-3 text-sm font-semibold text-plum">
          {doctor.qualifications.join(" · ")}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          <BookingCta
            source="doctor-card"
            doctor={doctor.slug}
            label="Book"
            size="lg"
            className="min-h-11"
          />
          {doctor.hasProfile ? (
            <Link
              href={`/doctors/${doctor.slug}`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Profile
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
