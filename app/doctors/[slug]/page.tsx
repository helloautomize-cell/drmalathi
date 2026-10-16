import type { Metadata } from "next";
import Image from "next/image";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronRight, Medal, MessageCircle } from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { CTABand } from "@/components/cards/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { doctors } from "@/data/doctors";
import { site } from "@/data/site";
import { breadcrumbSchema, personSchema } from "@/lib/schema";

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
    title: doctor.name,
    description:
      doctor.seoDescription ??
      `${doctor.name}, ${doctor.role} at ${site.name}. ${doctor.qualifications.join(", ")}.`,
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
      <JsonLd data={personSchema(doctor)} />
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/doctors" },
          { label: doctor.name, href: `/doctors/${doctor.slug}` },
        ])}
      />
      <PageHero
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
            <div className="relative mx-auto aspect-[4/5] max-w-[220px] overflow-hidden rounded-t-full md:max-w-sm">
              <Image
                src={doctor.photo}
                alt={
                  doctor.photoAlt ??
                  `Portrait of ${doctor.name}, fetal medicine consultant`
                }
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                placeholder="blur"
                blurDataURL={imageBlurDataURL}
                className={
                  doctor.photoFit === "contain"
                    ? "object-contain object-bottom"
                    : "object-cover"
                }
                style={
                  doctor.photoFit === "contain"
                    ? undefined
                    : {
                        objectPosition: `${doctor.photoFocus.x}% ${doctor.photoFocus.y}%`,
                      }
                }
              />
            </div>
            <p className="mt-5 text-center text-sm font-semibold text-plum">
              {doctor.qualifications.join(" · ")}
            </p>
          </div>

          <div className="flex flex-col">
            <div className="order-3 max-md:mt-8">
              <h2 className="text-2xl font-semibold text-ink">About {doctor.name}</h2>
              <div className="mt-5 space-y-4 text-muted-foreground">
                {doctor.background?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {doctor.highlights.length ? (
              <ul className="order-1 mt-5 space-y-2.5 max-md:mt-0">
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

            <div className="order-2 mt-8 flex flex-wrap gap-3">
              <BookingCta
                source="doctor-profile"
                doctor={doctor.slug}
                label={`Book with ${doctor.name.split(" ").slice(0, 2).join(" ")}`}
                size="lg"
                className="min-h-11 max-md:w-full"
              />
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                className="min-h-11 border-teal text-teal hover:bg-teal-tint hover:text-teal max-md:hidden"
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

            {doctor.trainedAt.length ? (
              <div className="order-4 mt-6 max-md:mt-8">
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

            {doctor.mentors?.length ? (
              <div className="order-5 mt-6 max-md:mt-8">
                <h3 className="text-lg font-semibold text-ink">Mentors</h3>
                <p className="mt-2 text-muted-foreground">
                  {doctor.mentors.join(" · ")}
                </p>
              </div>
            ) : null}

            {doctor.expertise.length ? (
              <div className="order-6 mt-6 max-md:mt-8">
                <h3 className="text-lg font-semibold text-ink">Areas of practice</h3>
                {/* Mobile: ListRows linking to services. */}
                <div className="mt-3 divide-y divide-rose-tint rounded-2xl border border-rose-tint bg-white px-3 md:hidden">
                  {doctor.expertise.map((expertise) =>
                    expertise.serviceSlug ? (
                      <Link
                        key={expertise.label}
                        href={`/services/${expertise.serviceSlug}`}
                        className="flex min-h-14 items-center gap-3 py-3"
                      >
                        <span className="min-w-0 flex-1 text-base/[26px] font-semibold text-ink">
                          {expertise.label}
                        </span>
                        <ChevronRight
                          className="size-4 shrink-0 text-ink-muted"
                          aria-hidden="true"
                        />
                      </Link>
                    ) : (
                      <p
                        key={expertise.label}
                        className="min-h-14 py-3 text-base/[26px] font-semibold text-ink"
                      >
                        {expertise.label}
                      </p>
                    )
                  )}
                </div>
                {/* Desktop: teal chips, unchanged. */}
                <div className="mt-2 hidden flex-wrap gap-2 md:flex">
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

            {doctor.award ? (
              <p className="order-7 mt-5 flex gap-2 text-sm font-semibold text-teal max-md:mt-8">
                <Medal className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {doctor.award}
              </p>
            ) : null}

            {doctor.qualificationsDetailed.length ? (
              <div className="order-8 mt-6 max-md:mt-8">
                <h3 className="text-lg font-semibold text-ink">Qualifications</h3>
                <ul className="mt-3 space-y-2.5">
                  {doctor.qualificationsDetailed.map((q) => (
                    <li key={`${q.degree}-${q.institution}`} className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 size-5 shrink-0 text-teal"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <span className="font-semibold text-ink">{q.degree}</span>
                        {`, ${q.institution}`}
                        {q.year ? ` (${q.year})` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {doctor.trainingPosts.length ? (
              <div className="order-9 mt-6 max-md:mt-8">
                <h3 className="text-lg font-semibold text-ink">Training and posts</h3>
                <ul className="mt-3 space-y-2.5">
                  {doctor.trainingPosts.map((p) => (
                    <li key={`${p.post}-${p.institution}`} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span className="text-sm text-muted-foreground">
                        {p.post}, {p.institution}
                        {p.years ? ` (${p.years})` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {doctor.clinicalFocus.length ? (
              <div className="order-10 mt-6 max-md:mt-8">
                <h3 className="text-lg font-semibold text-ink">Clinical focus</h3>
                <ul className="mt-3 space-y-2.5">
                  {doctor.clinicalFocus.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {doctor.languages.length ? (
              <div className="order-11 mt-6 max-md:mt-8">
                <h3 className="text-lg font-semibold text-ink">Consults in</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doctor.languages.map((language) => (
                    <span
                      key={language}
                      className="rounded-full bg-blush px-3 py-1.5 text-xs font-semibold text-plum"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {doctor.memberships.length ? (
              <div className="order-12 mt-6 max-md:mt-8">
                <h3 className="text-lg font-semibold text-ink">Memberships</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doctor.memberships.map((membership) => (
                    <span
                      key={membership}
                      className="rounded-full bg-blush px-3 py-1.5 text-xs font-semibold text-plum"
                    >
                      {membership}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {doctor.patientNote ? (
              <figure className="order-13 mt-6 rounded-2xl border border-rose-tint bg-blush p-5 max-md:mt-8">
                <blockquote className="text-sm/[22px] text-muted-foreground">
                  {doctor.patientNote}
                </blockquote>
                <figcaption className="mt-2 text-xs font-semibold text-ink">
                  {doctor.name}
                </figcaption>
              </figure>
            ) : null}

            {doctor.experienceSinceYear ? (
              <p className="order-14 mt-6 text-sm text-muted-foreground max-md:mt-8">
                In practice since {doctor.experienceSinceYear}.
              </p>
            ) : null}

            {doctor.registration ? (
              <p className="order-15 mt-6 text-xs text-muted-foreground max-md:mt-8">
                Registered with {doctor.registration.council}, registration
                number {doctor.registration.number}.
              </p>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section surface="blush" className="pt-0 md:bg-white">
        <CTABand />
      </Section>
    </>
  );
}
