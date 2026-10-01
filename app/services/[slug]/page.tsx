import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Info } from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { CTABand } from "@/components/cards/cta-band";
import { ServiceCard } from "@/components/cards/service-card";
import { JsonLd } from "@/components/seo/json-ld";
import { BrandImage } from "@/components/shared/brand-image";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { serviceCategories, services } from "@/data/services";
import { breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

// Sensitive services show the hands/baby-feet placeholder (or no photo);
// never newborn faces on these pages.
const SENSITIVE_IMAGE_SLUGS = new Set([
  "genetic-counselling",
  "recurrent-miscarriages-clinic",
  "fetal-postmortem",
]);

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.name} in Trichy`,
    description: service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const category = serviceCategories.find((c) => c.id === service.category);
  const related = services
    .filter((s) => s.category === service.category && s.slug !== slug)
    .slice(0, 3);
  const Icon = service.icon;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name, href: `/services/${service.slug}` },
        ])}
      />
      <PageHeader
        eyebrow={category?.label}
        title={service.name}
        subtitle={service.shortDescription}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            {SENSITIVE_IMAGE_SLUGS.has(service.slug) ? (
              <BrandImage
                slug="hands-baby-feet"
                variant="rounded"
                ratio="16/9"
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="mb-8 rounded-3xl shadow-soft"
              />
            ) : service.image ? (
              <div className="relative mb-8 aspect-video overflow-hidden rounded-3xl shadow-soft">
                <Image
                  src={service.image}
                  alt={`${service.name} at Trichy Fetal Medicine and Fertility Centre`}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="space-y-4 text-muted-foreground">
              {service.detail.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div
              id="what-to-expect"
              className="scroll-mt-24 rounded-2xl border border-rose-tint bg-white p-6 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-rose-tint text-primary">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h2 className="text-lg font-semibold text-ink">Good to know</h2>
              </div>
              {service.timing ? (
                <div className="mt-4 flex gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Timing</p>
                    <p className="text-sm text-muted-foreground">{service.timing}</p>
                  </div>
                </div>
              ) : null}
              {service.preparation ? (
                <div className="mt-4 flex gap-3">
                  <Info className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Preparation</p>
                    <p className="text-sm text-muted-foreground">
                      {service.preparation}
                    </p>
                  </div>
                </div>
              ) : null}
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <BookingCta
                  source="service-page"
                  service={service.slug}
                  label="Book this scan"
                  size="lg"
                  icon={false}
                />
              </div>
            </div>
            <p className="rounded-2xl bg-blush p-4 text-xs leading-relaxed text-muted-foreground">
              In keeping with the PCPNDT Act, 1994, this service does not
              involve determination or disclosure of the sex of the fetus.
            </p>
          </aside>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section className="bg-blush">
          <Container>
            <h2 className="mb-8 text-2xl font-semibold text-ink">
              Related services
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              View all services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Container>
        </Section>
      ) : null}

      <Section className="pt-0">
        <CTABand />
      </Section>
    </>
  );
}
