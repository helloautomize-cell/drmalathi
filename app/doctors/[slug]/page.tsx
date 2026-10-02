import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Medal, MessageCircle } from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { CTABand } from "@/components/cards/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { doctors } from "@/data/doctors";
import { site } from "@/data/site";
import { breadcrumbSchema, physicianSchema } from "@/lib/schema";

export function generateStaticParams() {
  return doctors.filter((doctor) => doctor.hasProfile).map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/doctors/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doctor = doctors.find((item) => item.slug === slug && item.hasProfile);
  if (!doctor) return {};
  return {
    title: `${doctor.name}, Fetal Medicine Specialist`,
    description: `${doctor.name}, ${doctor.role} at ${site.name}. ${doctor.qualifications.join(", ")}.`,
    alternates: { canonical: `/doctors/${doctor.slug}` },
  };
}

export default async function DoctorDetailPage({
  params,
}: PageProps<"/doctors/[slug]">) {
  const { slug } = await params;
  const doctor = doctors.find((item) => item.slug === slug);
  if (!doctor || !doctor.hasProfile) notFound();

  return (
    <>
      <JsonLd data={physicianSchema(doctor)} />
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/doctors" },
          { label: doctor.name, href: `/doctors/${doctor.slug}` },
        ])}
      />
      <PageHeader
        eyebrow={doctor.role}
        title={doctor.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/doctors" },
          { label: doctor.name },
        ]}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="rounded-3xl bg-gradient-to-b from-rose-tint to-blush p-6">
            <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-t-full">
              <Image
                src={doctor.photo}
                alt={`Portrait of ${doctor.name}, fetal medicine consultant`}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
                style={{
                  objectPosition: `${doctor.photoFocus.x}% ${doctor.photoFocus.y}%`,
                }}
              />
            </div>
            <p className="mt-5 text-center text-sm font-semibold text-plum">
              {doctor.qualifications.join(" · ")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-ink">About {doctor.name}</h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
              {doctor.background?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {doctor.highlights.length ? (
              <ul className="mt-5 space-y-2.5">
                {doctor.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-teal"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-muted-foreground">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {doctor.award ? (
              <p className="mt-5 flex gap-2 text-sm font-semibold text-teal">
                <Medal className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {doctor.award}
              </p>
            ) : null}

            {doctor.mentors?.length ? (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-ink">Mentors</h3>
                <p className="mt-2 text-muted-foreground">
                  {doctor.mentors.join(" · ")}
                </p>
              </div>
            ) : null}

            {doctor.trainedAt.length ? (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-ink">Trained at</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doctor.trainedAt.map((institution) => (
                    <span
                      key={institution}
                      className="rounded-full bg-blush px-3 py-1.5 text-xs font-semibold text-plum"
                    >
                      {institution}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {doctor.expertise.length ? (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-ink">Expertise</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doctor.expertise.map((expertise) =>
                    expertise.serviceSlug ? (
                      <Link
                        key={expertise.label}
                        href={`/services/${expertise.serviceSlug}`}
                        className="inline-flex min-h-11 items-center gap-1 rounded-full bg-teal-tint px-3 py-1.5 text-xs font-semibold text-teal underline-offset-4 hover:underline"
                      >
                        {expertise.label}
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    ) : (
                      <span
                        key={expertise.label}
                        className="inline-flex min-h-11 items-center rounded-full bg-teal-tint px-3 py-1.5 text-xs font-semibold text-teal"
                      >
                        {expertise.label}
                      </span>
                    )
                  )}
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <BookingCta
                source="doctor-profile"
                doctor={doctor.slug}
                label={`Book with ${doctor.name.split(" ").slice(0, 2).join(" ")}`}
                size="lg"
                className="min-h-11"
              />
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                className="min-h-11 border-teal text-teal hover:bg-teal-tint hover:text-teal"
                render={
                  <a
                    href={site.whatsapp.messageHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <MessageCircle aria-hidden="true" />
                WhatsApp us
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <CTABand />
      </Section>
    </>
  );
}
