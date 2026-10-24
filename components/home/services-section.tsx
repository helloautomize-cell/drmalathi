"use client";

import { Fragment, useState, type FocusEvent, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { WeekChip } from "@/components/home/week-chip";
import { WeekRailCompact } from "@/components/home/week-rail-compact";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import {
  serviceIconMap,
  services,
  type Service,
} from "@/data/services";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import { site } from "@/data/site";

const HOME_SLUGS = [
  "viability-scan",
  "nipt",
  "downs-screening-oscar",
  "anomaly-scan",
  "fetal-echo",
  "growth-scan-doppler",
] as const;
const IMAGE_TILE_SLUGS = new Set(["viability-scan", "nipt"]);
function getActiveHandlers(
  slug: string,
  setActiveSlug: (slug: string | null) => void
) {
  return {
    onMouseEnter: () => setActiveSlug(slug),
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(document.activeElement)) {
        setActiveSlug(null);
      }
    },
    onFocus: () => setActiveSlug(slug),
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setActiveSlug(null);
      }
    },
  };
}

function ServiceIcon({ service }: { service: Service }) {
  const Icon = serviceIconMap[service.iconName];
  const bloodTest = service.kind === "blood-test";
  return (
    <span
      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
        bloodTest ? "bg-teal-tint text-teal" : "bg-rose-tint text-primary"
      }`}
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

function ImageServiceTile({
  service,
  activeSlug,
  setActiveSlug,
  className = "",
  id,
}: {
  service: Service;
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;
  className?: string;
  id?: string;
}) {
  const handlers = getActiveHandlers(service.slug, setActiveSlug);
  const active = activeSlug === service.slug;
  const focalClass =
    service.slug === "viability-scan"
      ? "object-[58%_40%]"
      : "object-[48%_34%]";

  return (
    <article
      id={id ?? `home-service-${service.slug}`}
      {...handlers}
      data-mobile-card="image"
      className={`group relative h-full scroll-mt-24 overflow-hidden rounded-2xl bg-plum shadow-soft transition-all md:min-h-[300px] hover:-translate-y-1 hover:shadow-card motion-reduce:hover:translate-y-0 ${
        active ? "ring-3 ring-primary ring-offset-3" : ""
      } ${className}`}
    >
      {service.image ? (
        <div className="relative aspect-[4/3] md:absolute md:inset-0 md:aspect-auto">
          <Image
            src={service.image}
            alt={`${service.name} at ${site.name}`}
            fill
            sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 85vw"
            placeholder="blur"
            blurDataURL={imageBlurDataURL}
            className={`object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100 ${focalClass}`}
          />
        </div>
      ) : null}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to top, rgb(61 15 42 / 0.96) 0%, rgb(61 15 42 / 0.9) 38%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col bg-gradient-to-b from-plum to-[#260819] p-5 md:min-h-[300px] md:bg-none sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <ServiceIcon service={service} />
          <WeekChip weeks={service.weeks} surface="dark" />
        </div>
        <div className="mt-auto">
          <h3 className="text-xl font-semibold text-white">{service.name}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-white md:line-clamp-3">
            {service.shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
            {/* Mobile: text-link actions only (one primary button per section). */}
            <BookingCta
              source={`home-${service.slug}`}
              service={service.slug}
              variant="bare"
              trigger={
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-white underline underline-offset-4 md:hidden"
                >
                  Book this scan
                </button>
              }
            />
            <span className="hidden md:contents">
              <BookingCta
                source={`home-${service.slug}`}
                service={service.slug}
                label="Book this scan"
                size="lg"
                className="min-h-11"
              />
            </span>
            <Link
              href={`/services/${service.slug}`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none"
            >
              Learn more
              <span className="sr-only"> about {service.name}</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function HomeServiceCard({
  service,
  activeSlug,
  setActiveSlug,
  className = "",
}: {
  service: Service;
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;
  className?: string;
}) {
  const handlers = getActiveHandlers(service.slug, setActiveSlug);
  const active = activeSlug === service.slug;

  return (
    <Link
      id={`home-service-${service.slug}`}
      href={`/services/${service.slug}`}
      {...handlers}
      data-mobile-card="info"
      className={`group flex h-full scroll-mt-24 flex-col rounded-2xl border border-rose-tint bg-white p-5 shadow-soft transition-all md:min-h-64 md:p-6 hover:-translate-y-1 hover:shadow-card focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:hover:translate-y-0 ${
        active ? "ring-3 ring-primary ring-offset-3" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <ServiceIcon service={service} />
        <WeekChip weeks={service.weeks} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink">{service.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
        {service.shortDescription}
      </p>
      <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
        Learn more
        <span className="sr-only"> about {service.name}</span>
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

function MoreServicesBand({
  services: hiddenServices,
  total,
}: {
  services: Service[];
  total: number;
}) {
  return (
    <>
    {/* Mobile: PlumCard with a single-column ListRow list. */}
    <aside
      data-mobile-card="plum"
      className="rounded-3xl bg-plum p-5 text-white shadow-card md:hidden"
    >
      <h3 className="text-[19px]/[26px] font-semibold text-white">
        +{hiddenServices.length} more specialist services
      </h3>
      <div className="mt-2 divide-y divide-white/10">
        {hiddenServices.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="flex min-h-14 items-center gap-3 py-3 text-base/[26px] font-semibold text-white focus-visible:underline"
          >
            <span className="min-w-0 flex-1">{service.name}</span>
            <ChevronRight
              className="size-4 shrink-0 text-white/70"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
      <Button
        size="lg"
        nativeButton={false}
        className="mt-3 min-h-12 w-full rounded-full bg-white text-plum hover:bg-rose-tint"
        render={<Link href="/services" />}
      >
        View all {total} services
      </Button>
    </aside>
    {/* Desktop: original band, unchanged. */}
    <aside data-mobile-card="info" className="hidden h-full flex-col rounded-2xl border border-rose-tint bg-white p-5 text-ink shadow-soft md:col-span-2 md:flex md:border-0 md:bg-plum md:p-6 md:text-white lg:col-span-3">
      <h3 className="text-xl font-semibold text-ink md:text-white">
        +{hiddenServices.length} more specialist services
      </h3>
      <div className="mt-4 grid flex-1 grid-cols-2 gap-x-5 lg:grid-cols-3">
        {hiddenServices.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:text-white md:focus-visible:ring-white/60"
          >
            <span>{service.name}</span>
            <ArrowRight
              className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          nativeButton={false}
          className="min-h-12 bg-primary text-white hover:bg-primary-hover md:min-h-11 md:bg-white md:text-plum md:hover:bg-rose-tint"
          render={<Link href="/services" />}
        >
          View all {total} services
        </Button>
      </div>
    </aside>
    </>
  );
}

export function ServicesSection() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const find = (slug: string) => services.find((service) => service.slug === slug);
  const homeServices = HOME_SLUGS.map(find).filter(
    (service): service is Service => Boolean(service)
  );
  const homeSlugs = new Set(homeServices.map((service) => service.slug));
  const hiddenServices = services.filter((service) => !homeSlugs.has(service.slug));
  return (
    <Section id="services" surface="blush" className="md:bg-blush">
      <Container>
        <SectionHeader
          eyebrow="Our services"
          title="The right scan, at the right week"
          subtitle="Specialist scans and tests timed to your pregnancy, with findings explained in the same visit."
          className="[&>p:last-child]:mx-auto [&>p:last-child]:max-w-2xl [&>p:last-child]:text-balance"
        />
        <WeekRailCompact items={homeServices} />
        <div className="grid items-stretch gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {homeServices.map((service) => {
            if (service.slug === "anomaly-scan") {
              return (
                <Fragment key={service.slug}>
                  {/* Mobile: plain info card like the other non-image services. */}
                  <HomeServiceCard
                    service={service}
                    activeSlug={activeSlug}
                    setActiveSlug={setActiveSlug}
                    className="md:hidden"
                  />
                  {/* Desktop: image tile, unchanged. */}
                  <ImageServiceTile
                    service={service}
                    activeSlug={activeSlug}
                    setActiveSlug={setActiveSlug}
                    id={`home-service-${service.slug}-desktop`}
                    className="hidden md:block lg:col-span-2"
                  />
                </Fragment>
              );
            }
            if (IMAGE_TILE_SLUGS.has(service.slug)) {
              return (
                <ImageServiceTile
                  key={service.slug}
                  service={service}
                  activeSlug={activeSlug}
                  setActiveSlug={setActiveSlug}
                  className="lg:col-span-2"
                />
              );
            }
            return (
              <HomeServiceCard
                key={service.slug}
                service={service}
                activeSlug={activeSlug}
                setActiveSlug={setActiveSlug}
              />
            );
          })}
          <MoreServicesBand
            services={hiddenServices}
            total={services.length}
          />
        </div>
      </Container>
    </Section>
  );
}
