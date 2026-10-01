"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceCard } from "@/components/cards/service-card";
import { BrandImage } from "@/components/shared/brand-image";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  serviceCategories,
  services,
  servicesByCategory,
  type Service,
} from "@/data/services";

const FEATURED_SLUGS = ["anomaly-scan", "nipt"];

function FeaturedServiceTile({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative block h-full min-h-56 overflow-hidden rounded-2xl shadow-soft transition-all hover:-translate-y-1 hover:shadow-card focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {service.image ? (
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-plum/90 via-plum/45 to-plum/10" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
          <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h3 className="text-xl font-semibold text-white">{service.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/80">
          {service.shortDescription}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
          Learn more
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function StartHereTile() {
  return (
    <Link
      href="/services/viability-scan"
      className="group relative block overflow-hidden rounded-2xl border border-rose-tint bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:col-span-2 lg:col-span-4"
    >
      <div className="grid sm:grid-cols-[15rem_1fr]">
        <div className="relative h-44 overflow-hidden sm:h-auto">
          <BrandImage
            slug="pregnancy-test-stork"
            variant="bleed"
            reveal={false}
            sizes="(min-width: 640px) 240px, 100vw"
            fill
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="max-w-xl">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-primary">
              Just found out you&apos;re pregnant?
            </p>
            <h3 className="mt-1 text-xl font-semibold text-ink">
              Start with a Viability Scan
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              An early scan that confirms the pregnancy is developing as
              expected and dates it accurately.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Learn more
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function BentoGrid({ items }: { items: Service[] }) {
  const featured = FEATURED_SLUGS.map((slug) =>
    items.find((s) => s.slug === slug)
  ).filter((s): s is Service => Boolean(s));
  const rest = items.filter((s) => !FEATURED_SLUGS.includes(s.slug));
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StartHereTile />
      {featured.map((service) => (
        <div key={service.slug} className="sm:col-span-2">
          <FeaturedServiceTile service={service} />
        </div>
      ))}
      {rest.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </div>
  );
}

export function ServicesSection() {
  return (
    <Section className="bg-blush">
      <Container>
        <SectionHeader
          eyebrow="Our services"
          title="Invasive and non-invasive fetal care"
          subtitle="Every scan and service is performed by fetal medicine specialists, with time taken to explain each finding."
        />
        <Tabs defaultValue="all">
          <TabsList className="mx-auto mb-10 flex w-fit max-w-full flex-wrap justify-center">
            <TabsTrigger value="all">All services</TabsTrigger>
            {serviceCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <BentoGrid items={services} />
          </TabsContent>
          {serviceCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {servicesByCategory(category.id).map((service) => (
                  <ServiceCard key={service.slug} service={service} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Container>
    </Section>
  );
}
