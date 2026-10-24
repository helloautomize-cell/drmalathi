import Image from "next/image";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  GraduationCap,
  Medal,
  Microscope,
  Phone,
} from "lucide-react";
import { Fragment } from "react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { Container } from "@/components/shared/container";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { doctors, type Doctor, type DoctorExpertise } from "@/data/doctors";
import { showPending } from "@/lib/env";
import { site } from "@/data/site";

const highlightIcons = [Award, GraduationCap, Microscope];

function Portrait({
  doctor,
  lead = false,
  priority = false,
}: {
  doctor: Doctor;
  lead?: boolean;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative mx-auto shrink-0 overflow-hidden rounded-t-full bg-gradient-to-b from-rose-tint to-blush ${
        lead
          ? "h-[200px] w-[160px] md:h-[275px] md:w-[220px] lg:h-[400px] lg:w-[320px]"
          : "h-[110px] w-[88px] md:h-[175px] md:w-[140px]"
      }`}
    >
      <Image
        src={doctor.photo}
        alt={
          doctor.photoAlt ??
          `Portrait of ${doctor.name}, fetal medicine consultant`
        }
        fill
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        sizes={
          lead
            ? "(min-width: 1024px) 320px, (min-width: 768px) 220px, 160px"
            : "(min-width: 768px) 140px, 88px"
        }
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
  );
}

function ExpertiseChip({ expertise }: { expertise: DoctorExpertise }) {
  const className =
    "inline-flex min-h-9 items-center gap-1 rounded-full bg-teal-tint px-3 py-1 text-xs font-semibold text-teal";

  if (!expertise.serviceSlug) {
    return <span className={className}>{expertise.label}</span>;
  }

  return (
    <Link
      href={`/services/${expertise.serviceSlug}`}
      className={`${className} underline-offset-4 hover:underline`}
    >
      {expertise.label}
      <ArrowRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
}

export function LeadDoctorCard({
  doctor,
  priority = false,
}: {
  doctor: Doctor;
  priority?: boolean;
}) {
  return (
    <article className="reveal grid min-h-0 rounded-2xl border border-rose-tint bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card motion-reduce:hover:translate-y-0 md:p-7 lg:max-h-[460px] lg:grid-cols-[320px_1fr] lg:gap-8">
      <Portrait doctor={doctor} lead priority={priority} />
      <div className="mt-6 flex min-w-0 flex-col lg:mt-0">
        <p className="text-xs font-bold tracking-wider text-primary uppercase">
          Lead Consultant
        </p>
        <h3 className="mt-1 font-heading text-2xl font-semibold text-ink md:text-3xl">
          {doctor.name}
        </h3>
        {doctor.roleIsPlaceholder && !showPending ? null : (
          <p className="mt-1 text-sm text-ink-muted">{doctor.role}</p>
        )}
        <p className="mt-2 text-sm font-semibold text-plum">
          {doctor.qualifications.map((qualification, index) => (
            <Fragment key={qualification}>
              {index > 0 ? " · " : null}
              <span className="whitespace-nowrap">{qualification}</span>
            </Fragment>
          ))}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {doctor.highlights.slice(0, 3).map((highlight, index) => {
            const Icon = highlightIcons[index];
            return (
              <div
                key={highlight}
                className="flex min-h-14 items-center gap-2 rounded-xl bg-blush p-2.5 text-xs font-semibold leading-snug text-plum"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-tint text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {highlight}
              </div>
            );
          })}
        </div>

        <div className="mt-3 hidden flex-wrap items-center gap-1.5 md:flex">
          <span className="mr-1 text-xs font-bold tracking-wide text-ink-muted uppercase">
            Trained at
          </span>
          {doctor.trainedAt.map((institution) => (
            <span
              key={institution}
              className="rounded-full bg-blush px-2.5 py-1 text-xs font-semibold text-plum"
            >
              {institution}
            </span>
          ))}
        </div>

        <div className="mt-3 hidden flex-wrap gap-1.5 md:flex">
          {doctor.expertise.map((expertise) => (
            <ExpertiseChip key={expertise.label} expertise={expertise} />
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
          <BookingCta
            source="home-lead-doctor"
            doctor={doctor.slug}
            label="Book with Dr Malathi"
            size="lg"
            className="min-h-11"
          />
          <Link
            href={`/doctors/${doctor.slug}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Read full profile
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function TeamDoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="reveal grid h-full grid-cols-[96px_1fr] gap-3 rounded-2xl border border-rose-tint bg-white p-4 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card motion-reduce:hover:translate-y-0 md:grid-cols-[140px_1fr] md:gap-5 md:p-5">
      <Portrait doctor={doctor} />
      <div className="flex min-w-0 flex-col">
        <h3 className="font-heading text-xl font-semibold text-ink">
          {doctor.name}
        </h3>
        {doctor.roleIsPlaceholder && !showPending ? null : (
          <p className="mt-1 text-sm text-ink-muted">{doctor.role}</p>
        )}
        <p className="mt-2 text-xs font-semibold text-plum">
          {doctor.qualifications.join(" · ")}
        </p>

        {doctor.award ? (
          <p className="mt-3 flex gap-2 text-sm font-semibold text-teal">
            <Medal className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {doctor.award}
          </p>
        ) : null}

        {doctor.expertise.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.expertise.slice(0, 4).map((expertise) => (
              <ExpertiseChip key={expertise.label} expertise={expertise} />
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <BookingCta
            source="home-team-doctor"
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
      </div>
    </article>
  );
}

/** Compact horizontal card for the mobile team carousel (88px portrait). */
export function TeamDoctorMiniCard({
  doctor,
  priority = false,
}: {
  doctor: Doctor;
  priority?: boolean;
}) {
  const content = (
    <>
      <Portrait doctor={doctor} priority={priority} />
      <span className="flex min-w-0 flex-col justify-center py-1">
        <span className="font-heading text-[19px]/[26px] font-semibold text-ink">
          {doctor.name}
        </span>
        {doctor.roleIsPlaceholder && !showPending ? null : (
          <span className="mt-1 block text-sm/[20px] text-ink-muted">
            {doctor.role}
          </span>
        )}
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm/[20px] font-semibold text-primary">
          {doctor.hasProfile ? "View profile" : "Our team"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </span>
    </>
  );

  const className =
    "grid h-full grid-cols-[88px_1fr] gap-4 rounded-2xl border border-rose-tint bg-blush p-4 shadow-soft focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

  if (doctor.hasProfile) {
    return (
      <Link href={`/doctors/${doctor.slug}`} className={className}>
        {content}
      </Link>
    );
  }
  return <article className={className}>{content}</article>;
}

export function DoctorsSection() {
  const [lead, ...team] = doctors;
  const whatsappHref = `${site.whatsapp.href}?text=${encodeURIComponent(
    "Hello, I need help choosing the right fetal medicine specialist."
  )}`;

  return (
    <Section id="doctors" surface="white" className="md:bg-white">
      <Container>
        <SectionHeader
          eyebrow="Our doctors"
          title="Meet your specialists"
          subtitle="A fetal medicine team led by internationally trained specialists."
        />
        {lead ? <LeadDoctorCard doctor={lead} /> : null}
        <MobileCarousel
          label="More specialists"
          className="mt-6 md:hidden"
          items={team.map((doctor) => (
            <TeamDoctorMiniCard key={doctor.slug} doctor={doctor} />
          ))}
        />
        <div className="mt-6 hidden items-stretch gap-6 md:grid lg:grid-cols-2">
          {team.map((doctor) => (
            <TeamDoctorCard key={doctor.slug} doctor={doctor} />
          ))}
        </div>
        <div className="mt-8 text-center text-sm text-ink-muted">
          <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2">
            <span>Need help choosing a specialist?</span>
            <a
              href={site.phones[0].href}
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
            >
              <Phone className="size-4" aria-hidden="true" />
              Call {site.phones[0].label}
            </a>
            <span>or</span>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-teal underline-offset-4 hover:underline"
            >
              <WhatsAppIcon className="size-4" aria-hidden="true" />
              ask on WhatsApp
            </a>
          </p>
          <Link
            href="/international-patients"
            className="mt-1 hidden min-h-11 items-center text-xs font-semibold text-primary underline-offset-4 hover:underline md:inline-flex"
          >
            International patients: {site.internationalPhone.label}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
