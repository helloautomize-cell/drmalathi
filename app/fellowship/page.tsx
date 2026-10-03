import type { Metadata } from "next";
import Image from "next/image";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { PlumCard } from "@/components/cards/mobile-cards";
import { CourseEnquiryDialog } from "@/components/fellowship/enquiry-dialog";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { MobileSectionHeader } from "@/components/shared/mobile-section-header";
import { courses, fellowshipProgram } from "@/data/courses";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Fellowship and Courses",
  description:
    "Fetal medicine, advanced obstetric ultrasound, fetal echo, and obstetric ultrasound fellowship training for doctors in Trichy.",
  alternates: { canonical: "/fellowship" },
};

export default function FellowshipPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Fellowship", href: "/fellowship" },
        ])}
      />
      <PageHero
        eyebrow="Fellowship and courses"
        title="Training the next generation of fetal medicine specialists"
        intro="Structured, hands-on training programs run at our centre in Trichy. Applications are handled directly with the centre."
        crumbs={[{ label: "Home", href: "/" }, { label: "Fellowship" }]}
      />

      {/* Mobile flow: checklist, faculty, courses, admissions. */}
      <Section className="md:hidden">
        <Container>
          <MobileSectionHeader
            eyebrow="The program"
            title="Hands-on, one-to-one training"
          />
          <ul className="space-y-3">
            {fellowshipProgram.sharedHighlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-1 size-5 shrink-0 text-teal"
                  aria-hidden="true"
                />
                <span className="text-base/[26px] text-ink-muted">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-8 mb-3 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Faculty
          </p>
          <ul className="divide-y divide-rose-tint rounded-2xl border border-rose-tint bg-white px-4 shadow-soft">
            {fellowshipProgram.faculty.map((person) => (
              <li key={person.name} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-base/[26px] font-semibold text-ink">
                    {person.name}
                  </p>
                  <p className="text-sm/[20px] text-ink-muted">
                    {person.role} · {person.qualifications}
                  </p>
                </div>
                <Link
                  href={`/doctors/${person.doctorSlug}`}
                  aria-label={`View profile of ${person.name}`}
                  className="flex min-h-11 min-w-11 items-center justify-center text-primary"
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          {fellowshipProgram.image ? (
            <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-3xl shadow-soft">
              <Image
                src={fellowshipProgram.image}
                alt={fellowshipProgram.imageAlt}
                fill
                sizes="100vw"
                placeholder="blur"
                blurDataURL={imageBlurDataURL}
                className="object-cover"
              />
            </div>
          ) : null}
        </Container>
      </Section>

      <Section surface="blush" className="md:hidden">
        <Container>
          <MobileSectionHeader
            eyebrow="Courses"
            title="Current programs"
          />
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.slug}
                className="rounded-2xl border border-rose-tint bg-white p-5 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-tint text-primary">
                    <GraduationCap
                      className="size-6"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="text-[19px]/[26px] font-semibold text-ink text-balance">
                    {course.title}
                  </h3>
                </div>
                <div className="mt-3 space-y-1.5 text-base/[26px] text-ink-muted">
                  {course.durationConfirmed && course.duration ? (
                    <p className="flex items-center gap-2">
                      <Clock className="size-4 shrink-0 text-teal" aria-hidden="true" />
                      {course.duration}
                    </p>
                  ) : null}
                  {course.eligibility.map((item) => (
                    <p key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 shrink-0 text-teal" aria-hidden="true" />
                      {item}
                    </p>
                  ))}
                </div>
                <CourseEnquiryDialog
                  course={course}
                  triggerClassName="mt-3 inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-primary underline-offset-4"
                />
              </div>
            ))}
          </div>

          <PlumCard title="Apply for a fellowship" className="mt-8">
            <p className="text-xs font-semibold tracking-[0.14em] text-white/70 uppercase">
              Admissions
            </p>
            <p className="mt-2">
              {fellowshipProgram.admissions.process}
            </p>
            <div className="mt-5 space-y-3">
              <Button
                nativeButton={false}
                className="min-h-12 w-full rounded-full bg-white font-bold text-plum hover:bg-white/90"
                render={<a href={`mailto:${fellowshipProgram.admissions.email}`} />}
              >
                <Mail aria-hidden="true" />
                Send your CV
              </Button>
              <a
                href={fellowshipProgram.admissions.phoneHref}
                className="flex min-h-11 items-center justify-center gap-2 text-base font-semibold text-white/85 underline-offset-4 hover:text-white"
              >
                <Phone className="size-4" aria-hidden="true" />
                Call {fellowshipProgram.admissions.phone}
              </a>
            </div>
          </PlumCard>
        </Container>
      </Section>

      {/* Desktop sections, unchanged below md visibility. */}
      <Section className="max-md:hidden">
        <Container>
          <SectionHeader
            align="left"
            title="Current programs"
            subtitle="Details confirmed from the centre's published course information."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course.title}
                className="h-full overflow-hidden border-rose-tint pt-0 shadow-soft transition-shadow hover:shadow-card"
              >
                {fellowshipProgram.image ? (
                  <div className="relative aspect-[4/3] w-full bg-blush">
                    <Image
                      src={fellowshipProgram.image}
                      alt={fellowshipProgram.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      placeholder="blur"
                      blurDataURL={imageBlurDataURL}
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-tint text-primary">
                      <GraduationCap className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-ink">
                        {course.title}
                      </h3>
                      {course.durationConfirmed ? (
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="size-4" aria-hidden="true" />
                          {course.duration}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-blush max-md:hidden">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              className="mb-6 md:mb-6"
              title="Hands-on simulation training"
              subtitle="Training at the centre includes practice on a fetal interventions simulator, so skills are built before they are needed."
            />
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                nativeButton={false}
                className="bg-primary text-white hover:bg-primary-hover"
                render={<Link href="/contact" />}
              >
                <CalendarCheck aria-hidden="true" />
                Enquire about courses
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                className="border-teal text-teal hover:bg-teal-tint hover:text-teal"
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
          {fellowshipProgram.image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
              <Image
                src={fellowshipProgram.image}
                alt={fellowshipProgram.imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                placeholder="blur"
                blurDataURL={imageBlurDataURL}
                className="object-cover"
              />
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
