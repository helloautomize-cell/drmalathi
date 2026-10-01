import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  GraduationCap,
  Medal,
  Microscope,
  Phone,
} from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { doctors, type Doctor, type DoctorExpertise } from "@/data/doctors";
import { site } from "@/data/site";
import { physicianSchema } from "@/lib/schema";

const highlightIcons = [Award, GraduationCap, Microscope];

function Portrait({
  doctor,
  lead = false,
}: {
  doctor: Doctor;
  lead?: boolean;
}) {
  return (
    <div
      className={`relative mx-auto shrink-0 overflow-hidden rounded-t-full bg-gradient-to-b from-rose-tint to-blush ${
        lead
          ? "h-[275px] w-[220px] lg:h-[400px] lg:w-[320px]"
          : "h-[120px] w-24 md:h-[175px] md:w-[140px]"
      }`}
    >
      <Image
        src={doctor.photo}
        alt={`Portrait of ${doctor.name}, fetal medicine consultant`}
        fill
        sizes={
          lead
            ? "(min-width: 1024px) 320px, 220px"
            : "(min-width: 768px) 140px, 96px"
        }
        className="object-cover"
        style={{
          objectPosition: `${doctor.photoFocus.x}% ${doctor.photoFocus.y}%`,
        }}
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

function LeadDoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="reveal grid min-h-0 rounded-2xl border border-rose-tint bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card motion-reduce:hover:translate-y-0 md:p-7 lg:max-h-[460px] lg:grid-cols-[320px_1fr] lg:gap-8">
      <Portrait doctor={doctor} lead />
      <div className="mt-6 flex min-w-0 flex-col lg:mt-0">
        <p className="text-xs font-bold tracking-wider text-primary uppercase">
          Lead Consultant
        </p>
        <h3 className="mt-1 font-heading text-2xl font-semibold text-ink md:text-3xl">
          {doctor.name}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">{doctor.role}</p>
        <p className="mt-2 text-sm font-semibold text-plum">
          {doctor.qualifications.join(" · ")}
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

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
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

        <div className="mt-3 flex flex-wrap gap-1.5">
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
        <p className="mt-1 text-sm text-ink-muted">{doctor.role}</p>
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

export function DoctorsSection() {
  const [lead, ...team] = doctors;
  const whatsappHref = `${site.whatsapp.href}?text=${encodeURIComponent(
    "Hello, I need help choosing the right fetal medicine specialist."
  )}`;

  return (
    <Section id="doctors">
      {doctors.map((doctor) => (
        <JsonLd key={doctor.slug} data={physicianSchema(doctor)} />
      ))}
      <Container>
        <SectionHeader
          eyebrow="Our doctors"
          title="Meet your specialists"
          subtitle="A dedicated fetal medicine team, led by internationally trained specialists."
        />
        {lead ? <LeadDoctorCard doctor={lead} /> : null}
        <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-2">
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
            className="mt-1 inline-flex min-h-11 items-center text-xs font-semibold text-primary underline-offset-4 hover:underline"
          >
            International patients: {site.internationalPhone.label}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
