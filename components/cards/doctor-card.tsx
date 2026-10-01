import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Doctor } from "@/data/doctors";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const profileHref = doctor.hasProfile ? `/doctors/${doctor.slug}` : "/doctors";

  return (
    <Card className="h-full overflow-hidden border-rose-tint bg-white pt-0 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
      <div className="bg-gradient-to-b from-rose-tint to-blush px-8 pt-8 pb-0">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-56 overflow-hidden rounded-t-full shadow-soft">
          <Image
            src={doctor.image}
            alt={`${doctor.name}, fetal medicine specialist`}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 60vw"
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-rose-tint/25 mix-blend-multiply"
            aria-hidden="true"
          />
        </div>
      </div>
      <CardContent className="flex flex-col gap-4 p-6 pt-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-ink">{doctor.name}</h3>
            <Badge className="bg-teal-tint text-teal">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              {doctor.badge}
            </Badge>
          </div>
          {doctor.role ? (
            <p className="mt-1.5 text-sm text-muted-foreground">{doctor.role}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.credentials.map((c) => (
              <span
                key={c}
                className="rounded-full border border-rose-tint bg-blush px-2.5 py-1 text-[11px] font-semibold text-ink-muted"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-auto flex flex-wrap gap-3">
          <Button
            size="lg"
            nativeButton={false}
            className="bg-primary text-white hover:bg-primary-hover"
            render={<Link href="/contact" />}
          >
            Book Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            className="bg-white"
            render={<Link href={profileHref} />}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
