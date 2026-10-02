import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Phone,
} from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { CTABand } from "@/components/cards/cta-band";
import { DoctorMiniCard } from "@/components/cards/doctor-mini-card";
import { ServiceCard } from "@/components/cards/service-card";
import { WeekChip } from "@/components/home/week-chip";
import { JsonLd } from "@/components/seo/json-ld";
import { BrandImage } from "@/components/shared/brand-image";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { doctors } from "@/data/doctors";
import {
  relatedServices,
  serviceCategories,
  services,
  type Service,
} from "@/data/services";
import { site } from "@/data/site";
import {
  breadcrumbSchema,
  faqSchema,
  medicalProcedureSchema,
} from "@/lib/schema";

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

function DetailSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BookingCard({ service }: { service: Service }) {
  const whatsappHref = `${site.whatsapp.href}?text=${encodeURIComponent(
    `Hello, I would like to book a ${service.name} at Trichy Fetal Medicine and Fertility Centre.`
  )}`;
  return (
    <div className="rounded-2xl border border-rose-tint bg-white p-6 shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-tint text-primary">
          <service.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold text-ink">{service.name}</h2>
      </div>
      <div className="mt-3">
        <WeekChip weeks={service.weeks} />
      </div>
      <div className="mt-4 space-y-2.5">
        <BookingCta
          source="service-page"
          service={service.slug}
          label="Book this scan"
          size="lg"
          className="w-full"
        />
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          className="w-full border-teal text-teal hover:bg-teal-tint hover:text-teal"
          render={<a href={site.phones[0].href} />}
        >
          <Phone aria-hidden="true" />
          Call {site.phones[0].label}
        </Button>
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          className="w-full border-teal text-teal hover:bg-teal-tint hover:text-teal"
          render={
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" />
          }
        >
          <WhatsAppIcon aria-hidden="true" />
          WhatsApp us
        </Button>
      </div>
      <p className="mt-4 rounded-xl bg-blush p-3 text-xs leading-relaxed text-muted-foreground">
        In keeping with the PCPNDT Act, 1994, this service does not involve
        determination or disclosure of the sex of the fetus.
      </p>
    </div>
  );
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const category = serviceCategories.find((c) => c.id === service.category);
  const related = relatedServices(service);
  const performedBy = (service.performedBy ?? [])
    .map((doctorSlug) => doctors.find((d) => d.slug === doctorSlug))
    .filter((d): d is (typeof doctors)[number] => Boolean(d));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name, href: `/services/${service.slug}` },
        ])}
      />
      <JsonLd data={medicalProcedureSchema(service)} />
      {service.faqs?.length ? <JsonLd data={faqSchema(service.faqs)} /> : null}

      <Section className="pt-10 md:pt-14">
        <Container className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                {[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: service.name },
                ].map((crumb, i, all) => (
                  <li key={crumb.label} className="flex items-center gap-1.5">
                    {i > 0 ? (
                      <ChevronRight className="size-3.5" aria-hidden="true" />
                    ) : null}
                    {crumb.href && i < all.length - 1 ? (
                      <Link href={crumb.href} className="link">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current={i === all.length - 1 ? "page" : undefined}>
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {category ? (
              <p className="mt-5 mb-2 text-sm font-bold tracking-[0.14em] uppercase text-primary">
                {category.label}
              </p>
            ) : null}
            <h1 className="text-3xl font-semibold text-plum md:text-4xl">
              {service.name}
            </h1>
            <div className="mt-4">
              <WeekChip weeks={service.weeks} />
            </div>
            <div className="mt-4 space-y-4 text-muted-foreground">
              {service.detail.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {SENSITIVE_IMAGE_SLUGS.has(service.slug) ? (
              <BrandImage
                slug="hands-baby-feet"
                variant="rounded"
                ratio="16/9"
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="mt-8 rounded-3xl shadow-soft"
              />
            ) : service.image ? (
              <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl shadow-soft">
                <Image
                  src={service.image}
                  alt={`${service.name} at Trichy Fetal Medicine and Fertility Centre`}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            {service.whatItChecks?.length ? (
              <DetailSection id="what-it-checks" title="What it checks">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.whatItChecks.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 size-5 shrink-0 text-teal"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </DetailSection>
            ) : null}

            {service.whoFor?.length ? (
              <DetailSection id="who-is-it-for" title="Who is it for">
                <ul className="space-y-2.5">
                  {service.whoFor.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </DetailSection>
            ) : null}

            {service.steps?.length ? (
              <DetailSection id="what-to-expect" title="What to expect on the day">
                <ol className="space-y-4">
                  {service.steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-4">
                      <span
                        aria-hidden="true"
                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-tint text-sm font-bold text-primary"
                      >
                        {i + 1}
                      </span>
                      <p className="pt-1 text-sm text-muted-foreground">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </DetailSection>
            ) : null}

            {service.preparation || service.timing ? (
              <DetailSection id="preparation" title="Preparation">
                <div className="space-y-2 text-sm text-muted-foreground">
                  {service.timing ? (
                    <p>
                      <span className="font-semibold text-ink">When: </span>
                      {service.timing}
                    </p>
                  ) : null}
                  {service.preparation ? <p>{service.preparation}</p> : null}
                </div>
              </DetailSection>
            ) : null}

            {service.reportAndNextSteps ? (
              <DetailSection id="report" title="Your report and next steps">
                <p className="text-sm text-muted-foreground">
                  {service.reportAndNextSteps}
                </p>
              </DetailSection>
            ) : null}

            {performedBy.length ? (
              <DetailSection id="your-doctors" title="Your doctors">
                <div className="grid gap-4 sm:grid-cols-2">
                  {performedBy.map((doctor) => (
                    <DoctorMiniCard key={doctor.slug} doctor={doctor} />
                  ))}
                </div>
              </DetailSection>
            ) : null}

            {service.faqs?.length ? (
              <DetailSection id="faqs" title="Common questions">
                <Accordion>
                  {service.faqs.map((faq) => (
                    <AccordionItem key={faq.question} value={faq.question}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </DetailSection>
            ) : null}
          </div>

          <aside className="hidden md:block lg:sticky lg:top-24 lg:self-start">
            <BookingCard service={service} />
          </aside>
        </Container>
      </Section>

      {/* Mobile: the booking card is replaced by a trigger pinned just above
          the sticky mobile bottom bar (min-h-14). */}
      <div className="fixed inset-x-4 bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.75rem)] z-40 md:hidden">
        <BookingCta
          source="service-page-mobile"
          service={service.slug}
          label="Book this scan"
          size="lg"
          className="w-full shadow-lift"
        />
      </div>

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
