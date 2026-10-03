import Image from "next/image";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  Clock,
  FileText,
  GraduationCap,
  Phone,
} from "lucide-react";
import { BrochureDialog } from "@/components/fellowship/brochure-dialog";
import { CourseEnquiryDialog } from "@/components/fellowship/enquiry-dialog";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionShell } from "@/components/shared/section-shell";
import { courses, fellowshipProgram, type Course } from "@/data/courses";
import { doctors } from "@/data/doctors";
import { courseSchema } from "@/lib/schema";

const featuredHighlights = [
  "Simulator-based training in fetal interventions",
  "Rotational postings in eight allied specialities",
  "One-to-one training in fetal and postnatal care",
];

function FacultyItem({
  doctorSlug,
  role,
}: {
  doctorSlug: string;
  role: string;
}) {
  const doctor = doctors.find((item) => item.slug === doctorSlug);
  if (!doctor) return null;

  return (
    <Link
      href={`/doctors/${doctor.slug}`}
      className="group flex min-h-11 items-center gap-3 rounded-lg focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none"
    >
      <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-rose-tint to-blush">
        <Image
          src={doctor.photo}
          alt={`Portrait of ${doctor.name}`}
          fill
          sizes="40px"
          placeholder="blur"
          blurDataURL={imageBlurDataURL}
          className="object-cover"
          style={{
            objectPosition: `${doctor.photoFocus.x}% ${doctor.photoFocus.y}%`,
          }}
        />
      </span>
      <span>
        <span className="block text-sm font-semibold text-white group-hover:underline">
          {doctor.name}
        </span>
        <span className="block text-sm text-white/70">{role}</span>
      </span>
    </Link>
  );
}

function CourseCard({ course }: { course: Course }) {
  const duration = course.duration ?? "to be confirmed";

  return (
    <article className="reveal flex h-full flex-col rounded-2xl border border-white/15 bg-white/5 p-6 transition-all hover:-translate-y-0.5 hover:bg-white/10 motion-reduce:hover:translate-y-0">
      <p className="font-heading text-3xl font-semibold text-rose-tint">
        {course.number}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-white">{course.title}</h3>
      <div className="mt-5 space-y-3 text-sm text-white/85">
        <p className="flex gap-2.5">
          <Clock className="mt-0.5 size-4 shrink-0 text-rose-tint" aria-hidden="true" />
          <span>Duration: {duration}</span>
        </p>
        <p className="flex gap-2.5">
          <GraduationCap
            className="mt-0.5 size-4 shrink-0 text-rose-tint"
            aria-hidden="true"
          />
          <span>Eligibility: {course.eligibility.join(" or ")}</span>
        </p>
        <p className="flex gap-2.5">
          <FileText className="mt-0.5 size-4 shrink-0 text-rose-tint" aria-hidden="true" />
          <span>Requires 2 indexed publications by course end</span>
        </p>
      </div>
      <div className="mt-auto pt-5">
        <CourseEnquiryDialog course={course} />
      </div>
    </article>
  );
}

export function FellowshipHighlight() {
  const mailtoHref = `mailto:${fellowshipProgram.admissions.email}?subject=${encodeURIComponent(
    "Fellowship application"
  )}`;

  return (
    <SectionShell
      surface="white"
      className="relative overflow-hidden bg-white py-12 text-white md:bg-plum md:py-24"
    >
      {courses.map((course) => (
        <JsonLd key={course.slug} data={courseSchema(course)} />
      ))}
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-accent-soft/10 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="rounded-3xl bg-plum p-5 md:contents">
        {/* Mobile: single compact PlumCard. */}
        <div className="md:hidden">
          <p className="text-xs font-semibold tracking-[0.14em] text-rose-tint uppercase">
            For doctors
          </p>
          <h2 className="mt-2 font-heading text-[26px]/[32px] font-semibold text-balance text-white">
            Fellowship and courses
          </h2>
          <ul className="mt-4 space-y-2.5">
            {courses.map((course) => (
              <li
                key={course.slug}
                className="flex gap-2.5 text-sm/[20px] font-semibold text-white/90"
              >
                <CircleCheck
                  className="mt-0.5 size-4 shrink-0 text-rose-tint"
                  aria-hidden="true"
                />
                {course.title}
              </li>
            ))}
          </ul>
          <Button
            size="lg"
            nativeButton={false}
            className="mt-5 min-h-12 w-full rounded-full bg-white text-plum hover:bg-rose-tint"
            render={<Link href="/fellowship" />}
          >
            View courses
          </Button>
          <a
            href={mailtoHref}
            className="mt-2 flex min-h-11 w-full items-center justify-center text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            Send your CV
          </a>
        </div>
        {/* Desktop: original section, unchanged. */}
        <div className="hidden md:contents">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-sm font-bold tracking-[0.14em] text-rose-tint uppercase">
              For doctors · Teaching and training
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-white md:text-4xl">
              Fellowship and courses
            </h2>
            <p className="mt-4 max-w-xl text-balance text-white/85 md:text-lg">
              Train in fetal medicine with hands-on scanning, procedures and
              one-to-one mentoring.
            </p>

            <ul className="mt-6 space-y-3">
              {featuredHighlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm font-semibold text-white">
                  <CircleCheck
                    className="mt-0.5 size-5 shrink-0 text-rose-tint"
                    aria-hidden="true"
                  />
                  {highlight}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4">
              {fellowshipProgram.faculty.map((faculty) => (
                <FacultyItem
                  key={faculty.doctorSlug}
                  doctorSlug={faculty.doctorSlug}
                  role={faculty.role}
                />
              ))}
            </div>
          </div>

          {fellowshipProgram.image ? (
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15">
                <Image
                  src={fellowshipProgram.image}
                  alt={fellowshipProgram.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  placeholder="blur"
                  blurDataURL={imageBlurDataURL}
                  className="object-cover"
                />
                <span
                  className="pointer-events-none absolute inset-0 bg-plum/20 mix-blend-multiply"
                  aria-hidden="true"
                />
              </div>
              <figcaption className="mt-2 text-sm text-white/80">
                Hands-on training in obstetric ultrasound
              </figcaption>
            </figure>
          ) : null}
        </div>

        <p className="mt-12 flex items-center gap-2 text-sm text-white/70">
          <GraduationCap className="size-4 shrink-0 text-rose-tint" aria-hidden="true" />
          Part of our {fellowshipProgram.programName} program
        </p>

        <div className="mt-5 grid items-stretch gap-6 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-white/15 bg-white/5 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold text-white">
              Admission is by CV and personal interview.
            </p>
            {fellowshipProgram.admissions.intakeDate ? (
              <p className="mt-1 text-sm text-white/70">
                Next intake: {fellowshipProgram.admissions.intakeDate}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center lg:justify-end">
            <Button
              size="lg"
              nativeButton={false}
              className="min-h-11 bg-white text-plum hover:bg-rose-tint max-md:w-full"
              render={<a href={mailtoHref} />}
            >
              Send your CV
            </Button>
            <a
              href={fellowshipProgram.admissions.phoneHref}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              <Phone className="size-4" aria-hidden="true" />
              Call {fellowshipProgram.admissions.phone}
            </a>
            <Link
              href="/cme-activities"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              See CME activities
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            {fellowshipProgram.showBrochure ? (
              <BrochureDialog
                image={fellowshipProgram.brochure.image}
                alt={fellowshipProgram.brochure.alt}
              />
            ) : null}
          </div>
        </div>
        </div>
        </div>
      </Container>
    </SectionShell>
  );
}
