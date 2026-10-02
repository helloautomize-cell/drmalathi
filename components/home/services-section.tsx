"use client";

import { useState, type FocusEvent, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { WeekChip } from "@/components/home/week-chip";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import {
  serviceIconMap,
  services,
  type Service,
} from "@/data/services";
import { site } from "@/data/site";

const HOME_SLUGS = [
  "viability-scan",
  "nipt",
  "downs-screening-oscar",
  "anomaly-scan",
  "fetal-echo",
  "growth-scan-doppler",
] as const;
const IMAGE_TILE_SLUGS = new Set(["viability-scan", "nipt", "anomaly-scan"]);
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
}: {
  service: Service;
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;
  className?: string;
}) {
  const handlers = getActiveHandlers(service.slug, setActiveSlug);
  const active = activeSlug === service.slug;
  const focalClass =
    service.slug === "viability-scan"
      ? "object-[58%_40%]"
      : "object-[48%_34%]";

  return (
    <article
      id={`home-service-${service.slug}`}
      {...handlers}
      className={`group relative h-full min-h-[300px] scroll-mt-24 overflow-hidden rounded-2xl shadow-soft transition-all hover:-translate-y-1 hover:shadow-card motion-reduce:hover:translate-y-0 ${
        active ? "ring-3 ring-primary ring-offset-3" : ""
      } ${className}`}
    >
      {service.image ? (
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100 ${focalClass}`}
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgb(61 15 42 / 0.96) 0%, rgb(61 15 42 / 0.9) 38%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex min-h-[300px] flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <ServiceIcon service={service} />
          <WeekChip weeks={service.weeks} surface="dark" />
        </div>
        <div className="mt-auto">
          <h3 className="text-xl font-semibold text-white">{service.name}</h3>
          <p className="mt-1 line-clamp-3 text-sm text-white">
            {service.shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <BookingCta
              source={`home-${service.slug}`}
              service={service.slug}
              label="Book this scan"
              size="lg"
              className="min-h-11"
            />
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
}: {
  service: Service;
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;
}) {
  const handlers = getActiveHandlers(service.slug, setActiveSlug);
  const active = activeSlug === service.slug;

  return (
    <Link
      id={`home-service-${service.slug}`}
      href={`/services/${service.slug}`}
      {...handlers}
      className={`group flex h-full min-h-64 scroll-mt-24 flex-col rounded-2xl border border-rose-tint bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:hover:translate-y-0 ${
        active ? "ring-3 ring-primary ring-offset-3" : ""
      }`}
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
  whatsappHref,
}: {
  services: Service[];
  total: number;
  whatsappHref: string;
}) {
  return (
    <aside className="flex h-full flex-col rounded-2xl bg-plum p-6 text-white shadow-soft md:col-span-2 lg:col-span-3">
      <h3 className="text-xl font-semibold text-white">
        +{hiddenServices.length} more specialist services
      </h3>
      <div className="mt-4 grid flex-1 grid-cols-2 gap-x-5 lg:grid-cols-3">
        {hiddenServices.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none"
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
          className="min-h-11 bg-white text-plum hover:bg-rose-tint"
          render={<Link href="/services" />}
        >
          View all {total} services
        </Button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none"
        >
          <WhatsAppIcon className="size-4" aria-hidden="true" />
          Not sure which scan? Ask us on WhatsApp
        </a>
      </div>
    </aside>
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
  const whatsappHref = `${site.whatsapp.href}?text=${encodeURIComponent(
    "Hello, I am not sure which scan I need. Could you help me choose?"
  )}`;

  return (
    <Section id="services" className="bg-blush">
      <Container>
        <SectionHeader
          eyebrow="Our services"
          title="The right scan, at the right week"
          subtitle="Specialist scans and tests timed to your pregnancy — earlier answers, each explained in plain language."
          className="[&>p:last-child]:mx-auto [&>p:last-child]:max-w-2xl [&>p:last-child]:text-balance"
        />
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">
          {homeServices.map((service) => {
            if (IMAGE_TILE_SLUGS.has(service.slug)) {
              return (
                <ImageServiceTile
                  key={service.slug}
                  service={service}
                  activeSlug={activeSlug}
                  setActiveSlug={setActiveSlug}
                  className={
                    service.slug === "viability-scan" || service.slug === "nipt"
                      ? "lg:col-span-2"
                      : service.slug === "anomaly-scan"
                        ? "lg:col-span-2"
                        : ""
                  }
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
            whatsappHref={whatsappHref}
          />
        </div>
      </Container>
    </Section>
  );
}
