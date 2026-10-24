import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  GraduationCap,
  Handshake,
  MapPin,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { PhotoGrid } from "@/components/shared/photo-grid";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { cmeYears } from "@/data/cme";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "CME Activities for Obstetricians in Trichy",
  description:
    "Continuing medical education activities at Trichy Fetal Medicine and Fertility Centre: conclaves, workshops and hands-on training for doctors.",
  alternates: { canonical: "/cme-activities" },
};

export default function CmeActivitiesPage() {
  const years = cmeYears();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "CME Activities", href: "/cme-activities" },
        ])}
      />
      <PageHero
        eyebrow="Education"
        title="CME activities"
        intro="The centre regularly hosts continuing medical education programmes, workshops, and masterclasses in fetal medicine."
        crumbs={[{ label: "Home", href: "/" }, { label: "CME Activities" }]}
      />

      <Section>
        <Container className="space-y-14">
          {years.map(({ year, events }) => (
            <div key={year}>
              <h2 className="mb-6 text-xl font-semibold text-plum">{year}</h2>
              <div className="space-y-8">
                {events.map((event) => (
                  <article
                    key={event.id}
                    className="rounded-2xl border border-rose-tint bg-white p-5 shadow-soft sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-ink">
                          {event.title}
                        </h3>
                        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays
                              className="size-4 text-primary"
                              aria-hidden="true"
                            />
                            <dt className="sr-only">Date</dt>
                            <dd>{event.dateLabel}</dd>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin
                              className="size-4 text-primary"
                              aria-hidden="true"
                            />
                            <dt className="sr-only">Venue</dt>
                            <dd>{event.venue}</dd>
                          </div>
                          {event.partner ? (
                            <div className="flex items-center gap-1.5">
                              <Handshake
                                className="size-4 text-primary"
                                aria-hidden="true"
                              />
                              <dt className="sr-only">Partner</dt>
                              <dd>In association with {event.partner}</dd>
                            </div>
                          ) : null}
                        </dl>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {event.blurb}
                        </p>
                      </div>
                      {event.pdf ? (
                        <a
                          href={event.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-rose-tint max-md:min-h-11"
                        >
                          <FileText
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                          View programme (PDF)
                        </a>
                      ) : null}
                    </div>
                    {event.photos.length ? (
                      <div className="mt-6">
                        <PhotoGrid images={event.photos} />
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </Section>

      <Section className="bg-blush">
        <Container>
          <div className="rounded-2xl border border-rose-tint bg-white p-6 shadow-soft sm:flex sm:items-center sm:gap-6 sm:p-8">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-tint text-teal">
              <GraduationCap
                className="size-7"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </span>
            <div className="mt-4 flex-1 sm:mt-0">
              <SectionHeader
                align="left"
                className="mb-2"
                title="Train with us"
              />
              <p className="text-sm text-muted-foreground">
                Our fellowship in fetal medicine offers hands-on scanning,
                procedures and teaching under senior specialists.
              </p>
            </div>
            <Link
              href="/fellowship"
              className="mt-5 inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-rose-tint max-md:min-h-11 sm:mt-0"
            >
              Explore the fellowship
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
