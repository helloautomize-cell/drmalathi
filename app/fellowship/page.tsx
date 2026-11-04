import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  ArrowRight,
  Baby,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  HeartPulse,
  Microscope,
  Phone,
  Repeat,
  Stethoscope,
} from "lucide-react";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import { StatChip } from "@/components/cards/stat-chip";
import { BrochureDialog } from "@/components/fellowship/brochure-dialog";
import { JsonLd } from "@/components/seo/json-ld";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { MobileSectionHeader } from "@/components/shared/mobile-section-header";
import { StepsList } from "@/components/shared/steps-list";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { cn } from "cn";
import {
  courses,
  fellowshipFaqs,
  fellowshipProgram,
} from "@/data/courses";
import { doctors } from "@/data/doctors";
import { site } from "@/data/site";
import {
  breadcrumbNode,
  courseNode,
  faqNode,
  pageGraph,
  webPageNode,
} from "@/lib/schema";
import { showPending } from "@/lib/env";

export const metadata: Metadata = {
  title: "Fellowship and Courses in Fetal Medicine",
  description:
    "Fetal medicine, advanced obstetric ultrasound, fetal echo and obstetric ultrasound fellowships at our Trichy centre. Hands-on training, apply online.",
  alternates: { canonical: "/fellowship" },
};

/** True only when the file exists under /public, so cards can fall back. */
const publicImageExists = (src: string | null): src is string =>
  typeof src === "string" &&
  existsSync(join(process.cwd(), "public", src));

const atAGlance = [
  { icon: GraduationCap, label: "3 fellowship programmes" },
  { icon: Stethoscope, label: "One-to-one hands-on training" },
  { icon: Repeat, label: "Rotations in 8 allied specialities" },
  { icon: BookOpen, label: "Research publications in indexed journals" },
];

// Icons align by index with fellowshipProgram.sharedHighlights.
const highlightIcons = [
  GraduationCap,
  Stethoscope,
  Microscope,
  HeartPulse,
  Baby,
  Repeat,
  BookOpen,
];

const cmePhotos = [
  {
    src: "/images/cme/cme1.webp",
    alt: "A consultant lecturing to doctors during an education event at the centre",
  },
  {
    src: "/images/cme/tmfc3.webp",
    alt: "Delegates attending a fetal imaging lecture at the Materno-Fetal Conclave",
  },
  {
    src: "/images/cme/tmfc4.webp",
    alt: "A session in progress at the Materno-Fetal Conclave",
  },
  {
    src: "/images/cme/tmfc5.webp",
    alt: "Faculty and delegates at the Materno-Fetal Conclave",
  },
];

function CourseImage({
  src,
  alt,
  sizes,
}: {
  src: string | null;
  alt: string;
  sizes: string;
}) {
  if (src && publicImageExists(src)) {
    return (
      <div className="relative aspect-[4/3] w-full bg-blush">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={imageBlurDataURL}
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center bg-blush">
      <GraduationCap
        className="size-14 text-primary"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </div>
  );
}

function CourseDuration({ course }: { course: (typeof courses)[number] }) {
  if (course.durationConfirmed && course.duration) {
    return (
      <p className="flex items-center gap-2 text-sm text-ink-muted">
        <Clock className="size-4 shrink-0 text-teal" aria-hidden="true" />
        {course.duration}
      </p>
    );
  }
  if (showPending && course.duration) {
    return (
      <p className="flex items-center gap-2 text-sm text-ink-muted">
        <Clock className="size-4 shrink-0 text-teal" aria-hidden="true" />
        {course.duration} (to be confirmed)
      </p>
    );
  }
  return null;
}

export default function FellowshipPage() {
  const visibleFaqs = fellowshipFaqs.filter(
    (faq) => faq.confirmed || showPending
  );
  const heroImage = publicImageExists(fellowshipProgram.image)
    ? fellowshipProgram.image
    : undefined;

  return (
    <>
      <JsonLd
        data={pageGraph([
          webPageNode("/fellowship", metadata.title as string, metadata.description as string),
          breadcrumbNode([
            { label: "Home", href: "/" },
            { label: "Fellowship", href: "/fellowship" },
          ]),
          ...courses.map(courseNode),
          faqNode(visibleFaqs, "/fellowship"),
        ])}
      />
      <PageHero
        eyebrow="Fellowship and courses"
        title="Training the next generation of fetal medicine specialists"
        intro="Structured, hands-on training programmes run at our centre in Trichy. Apply online with your CV; shortlisted candidates are called for a personal interview."
        crumbs={[{ label: "Home", href: "/" }, { label: "Fellowship" }]}
        image={heroImage}
        imageAlt={fellowshipProgram.imageAlt}
        actions={
          <>
            <Button
              size="lg"
              nativeButton={false}
              className="bg-primary text-white hover:bg-primary-hover"
              render={<Link href="/fellowship/apply" />}
            >
              Apply for training
              <ArrowRight aria-hidden="true" />
            </Button>
            <BrochureDialog
              image={fellowshipProgram.brochure.image}
              alt={fellowshipProgram.brochure.alt}
              label="View course flyer"
              triggerClassName={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-teal text-teal hover:bg-teal-tint hover:text-teal"
              )}
            />
          </>
        }
      />

      <Section>
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,480px)]">
          <div>
            <SectionHeader
              align="left"
              className="mb-6 md:mb-8"
              eyebrow="At a glance"
              title="Structured, hands-on training"
            />
            <div className="flex flex-wrap gap-3">
              {atAGlance.map((item) => (
                <StatChip
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </div>
          </div>
          {heroImage ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-soft max-lg:hidden">
              <Image
                src={heroImage}
                alt={fellowshipProgram.imageAlt}
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                placeholder="blur"
                blurDataURL={imageBlurDataURL}
                className="object-cover"
              />
            </div>
          ) : null}
        </Container>
      </Section>

      {/* Mobile: compact stacked course cards. */}
      <Section surface="blush" className="md:hidden">
        <Container>
          <MobileSectionHeader eyebrow="Courses" title="Current programmes" />
          <div className="space-y-4">
            {courses.map((course) => (
              <article
                key={course.slug}
                className="overflow-hidden rounded-2xl border border-rose-tint bg-white shadow-soft"
              >
                <CourseImage
                  src={course.image}
                  alt={course.imageAlt}
                  sizes="100vw"
                />
                <div className="p-5">
                  <h3 className="text-[19px]/[26px] font-semibold text-ink text-balance">
                    {course.title}
                  </h3>
                  <div className="mt-2">
                    <CourseDuration course={course} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.eligibility.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-blush px-3 py-1 text-xs font-semibold text-ink"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <Button
                    nativeButton={false}
                    className="mt-4 min-h-12 w-full bg-primary text-white hover:bg-primary-hover"
                    render={
                      <Link href={`/fellowship/apply?course=${course.slug}`} />
                    }
                  >
                    Apply for this course
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Desktop: three image cards. */}
      <Section surface="blush" className="max-md:hidden">
        <Container>
          <SectionHeader
            align="left"
            title="Current programmes"
            subtitle="Details confirmed from the centre's published course information."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course.slug}
                className="flex h-full flex-col overflow-hidden border-rose-tint pt-0 shadow-soft transition-shadow hover:shadow-card"
              >
                <CourseImage
                  src={course.image}
                  alt={course.imageAlt}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                <CardContent className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-ink text-balance">
                    {course.title}
                  </h3>
                  <div className="mt-2">
                    <CourseDuration course={course} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.eligibility.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-blush px-3 py-1 text-xs font-semibold text-ink"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-5">
                    <Button
                      nativeButton={false}
                      className="min-h-11 w-full bg-primary text-white hover:bg-primary-hover"
                      render={
                        <Link
                          href={`/fellowship/apply?course=${course.slug}`}
                        />
                      }
                    >
                      Apply for this course
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              className="mb-6 md:mb-8"
              eyebrow="The programme"
              title="What the training includes"
            />
            <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {fellowshipProgram.sharedHighlights.map((highlight, index) => {
                const Icon = highlightIcons[index] ?? CheckCircle2;
                return (
                  <li key={highlight} className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-tint text-primary">
                      <Icon
                        className="size-5"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="pt-1.5 text-base/[24px] text-ink-muted">
                      {highlight}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          {publicImageExists("/images/fellowship/learning-session.webp") ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-soft max-lg:hidden">
              <Image
                src="/images/fellowship/learning-session.webp"
                alt="A consultant presenting ultrasound images to a group of doctors taking notes"
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

      <Section surface="blush">
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
                render={<Link href="/fellowship/apply" />}
              >
                Apply for training
                <ArrowRight aria-hidden="true" />
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
                <WhatsAppIcon aria-hidden="true" />
                WhatsApp us
              </Button>
            </div>
          </div>
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
              <Image
                src={fellowshipProgram.realPhotos[0].src}
                alt={fellowshipProgram.realPhotos[0].alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                placeholder="blur"
                blurDataURL={imageBlurDataURL}
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-sm text-ink-muted">
              {fellowshipProgram.realPhotos[0].caption}
            </figcaption>
          </figure>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Faculty"
            title="Learn from the consultants who run the programme"
          />
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {fellowshipProgram.faculty.map((person) => {
              const doctor = doctors.find(
                (item) => item.slug === person.doctorSlug
              );
              return (
                <Card
                  key={person.name}
                  className="h-full overflow-hidden border-rose-tint pt-0 shadow-soft"
                >
                  {doctor ? (
                    <div className="bg-gradient-to-b from-rose-tint to-blush px-8 pt-8">
                      <div className="relative mx-auto h-56 w-full max-w-48 overflow-hidden rounded-t-full">
                        <Image
                          src={doctor.photo}
                          alt={
                            doctor.photoAlt ??
                            `Portrait of ${doctor.name}, fetal medicine consultant`
                          }
                          fill
                          sizes="(min-width: 640px) 224px, 60vw"
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
                    </div>
                  ) : null}
                  <CardContent className="p-6 text-center">
                    <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                      {person.role}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-ink">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">
                      {person.qualifications}
                    </p>
                    <Link
                      href={`/doctors/${person.doctorSlug}`}
                      className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      View profile
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section surface="blush">
        <Container>
          <SectionHeader
            eyebrow="Admissions"
            title="How admission works"
            subtitle={fellowshipProgram.admissions.process}
          />
          <ol className="hidden gap-8 md:grid md:grid-cols-4">
            {fellowshipProgram.admissionSteps.map((step, index) => (
              <li key={step.title} className="relative">
                {index < fellowshipProgram.admissionSteps.length - 1 ? (
                  <span
                    className="absolute top-6 left-14 h-0.5 w-[calc(100%-3.5rem)] bg-rose-tint"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="flex size-12 items-center justify-center rounded-full bg-rose-tint font-heading text-lg font-semibold text-primary">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm/[22px] text-ink-muted">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="md:hidden">
            <StepsList
              steps={fellowshipProgram.admissionSteps}
              className="mx-0 max-w-none"
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="In photos"
            title="From our training and CME events"
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cmePhotos.map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  placeholder="blur"
                  blurDataURL={imageBlurDataURL}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/cme-activities"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              See all CME activities
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/gallery?tab=cme"
              className="ml-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-muted underline-offset-4 hover:text-primary hover:underline"
            >
              See photos in the gallery
            </Link>
          </div>
        </Container>
      </Section>

      <Section surface="blush">
        <Container className="max-w-3xl">
          <SectionHeader
            eyebrow="Questions"
            title="Fellowship FAQ"
            subtitle="Answers based on the centre's published course information."
          />
          <Accordion>
            {visibleFaqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-base font-semibold text-ink hover:no-underline max-md:min-h-14 max-md:py-3">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base/[26px] text-muted-foreground md:text-sm">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-plum p-5 text-center shadow-card md:p-12">
            <div
              className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-accent-soft/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="text-[26px]/[32px] font-semibold text-balance text-white md:text-4xl">
                Apply for fellowship training
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-white/80">
                {fellowshipProgram.admissions.process}
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  size="lg"
                  nativeButton={false}
                  className="min-h-12 w-full rounded-full bg-white font-bold text-plum hover:bg-white/90 sm:w-auto"
                  render={<Link href="/fellowship/apply" />}
                >
                  Apply for training
                  <ArrowRight aria-hidden="true" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  className="min-h-12 w-full rounded-full border-white/60 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                  render={
                    <a href={fellowshipProgram.admissions.phoneHref} />
                  }
                >
                  <Phone aria-hidden="true" />
                  Call {fellowshipProgram.admissions.phone}
                </Button>
                <Button
                  size="lg"
                  nativeButton={false}
                  className="min-h-12 w-full rounded-full bg-teal text-white hover:bg-teal/85 sm:w-auto"
                  render={
                    <a
                      href={site.whatsapp.messageHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <WhatsAppIcon aria-hidden="true" />
                  WhatsApp us
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
