import type { Metadata } from "next";
import Image from "next/image";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Phone,
} from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { CTABand } from "@/components/cards/cta-band";
import { DoctorMiniCard } from "@/components/cards/doctor-mini-card";
import { GuideCard } from "@/components/guides/guide-card";
import { ServiceCard } from "@/components/cards/service-card";
import { WeekChip } from "@/components/home/week-chip";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceBookingBar } from "@/components/services/service-booking-bar";
import { BrandImage } from "@/components/shared/brand-image";
import { ChipNav, type ChipNavItem } from "@/components/shared/chip-nav";
import { Container } from "@/components/shared/container";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { StepsList } from "@/components/shared/steps-list";
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
import { toGuideCardData } from "@/lib/guide-card-data";
import { getGuidesByService } from "@/lib/guides";
import {
  breadcrumbNode,
  faqNode,
  pageGraph,
  serviceNode,
  webPageNode,
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
    description: service.seoDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { url: `${site.url}/services/${service.slug}` },
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
    <section id={id} className="mt-10 scroll-mt-24 max-md:scroll-mt-32">
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
  const serviceGuides = getGuidesByService(service.slug).map(toGuideCardData);
  const chipNavItems: ChipNavItem[] = [
    service.whatItChecks?.length
      ? { id: "what-it-checks", label: "What it checks" }
      : null,
    service.steps?.length ? { id: "what-to-expect", label: "What to expect" } : null,
    service.preparation || service.timing
      ? { id: "preparation", label: "Preparation" }
      : null,
    service.reportAndNextSteps || service.resultsDetail?.length
      ? { id: "report", label: "Report" }
      : null,
    service.visitNotes?.length
      ? { id: "visit-notes", label: "Your visit" }
      : null,
    service.limits?.length ? { id: "limits", label: "What it cannot show" } : null,
    service.followUp?.length
      ? { id: "follow-up", label: "Follow-up" }
      : null,
    service.performedBy?.length
      ? { id: "your-doctors", label: "Your doctors" }
      : null,
    service.faqs?.length ? { id: "faqs", label: "FAQs" } : null,
  ].filter((item): item is ChipNavItem => Boolean(item));
  const performedBy = (service.performedBy ?? [])
    .map((doctorSlug) => doctors.find((d) => d.slug === doctorSlug))
    .filter((d): d is (typeof doctors)[number] => Boolean(d));

  return (
    <>
      <JsonLd
        data={pageGraph([
          webPageNode(
            `/services/${service.slug}`,
            service.name,
            service.shortDescription
          ),
          serviceNode(service),
          breadcrumbNode([
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: service.name, href: `/services/${service.slug}` },
          ]),
          ...(service.faqs?.length
            ? [faqNode(service.faqs, `/services/${service.slug}`)]
            : []),
        ])}
      />

      <Section className="pt-10 md:pt-14">
        <Container className="grid min-w-0 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="min-w-0 overflow-hidden">
              <ol className="flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground md:flex-wrap md:text-sm">
                {[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: service.name },
                ].map((crumb, i, all) => (
                  <li
                    key={crumb.label}
                    className={`flex items-center gap-1.5 ${i === 0 ? "shrink-0" : "min-w-0"}`}
                  >
                    {i > 0 ? (
                      <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
                    ) : null}
                    {crumb.href && i < all.length - 1 ? (
                      <Link
                        href={crumb.href}
                        className="link truncate max-md:inline-flex max-md:min-h-11 max-md:min-w-11 max-md:items-center max-md:justify-center"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={i === all.length - 1 ? "page" : undefined}
                        className="truncate"
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {category ? (
              <p className="mt-5 mb-2 hidden text-sm font-bold tracking-[0.14em] uppercase text-primary md:block">
                {category.label}
              </p>
            ) : null}
            <h1 className="text-balance text-[34px]/[40px] font-semibold text-plum md:text-4xl">
              {service.name}
            </h1>
            {/* Mobile: one-line intro under the title. */}
            <p className="mt-3 line-clamp-2 text-base/[26px] text-pretty text-ink-muted md:hidden">
              {service.shortDescription}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <WeekChip weeks={service.weeks} />
              {category ? (
                <span className="inline-flex min-h-11 items-center rounded-full bg-teal-tint px-3 py-1 text-xs font-semibold text-teal md:hidden">
                  {category.label}
                </span>
              ) : null}
            </div>
            {/* Mobile: detail copy moves below the image; desktop keeps it here. */}
            <div className="mt-4 hidden space-y-4 text-muted-foreground md:block">
              {service.detail.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {SENSITIVE_IMAGE_SLUGS.has(service.slug) ? (
              <BrandImage
                slug="hands-baby-feet"
                variant="rounded"
                ratio="16/9"
                priority
                reveal={false}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="mt-8 rounded-3xl shadow-soft"
              />
            ) : service.image ? (
              <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-3xl shadow-soft md:aspect-video">
                <Image
                  src={service.image}
                  alt={`${service.name} at Trichy Fetal Medicine and Fertility Centre`}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  placeholder="blur"
                  blurDataURL={imageBlurDataURL}
                  className="object-cover"
                />
              </div>
            ) : null}

            {/* Mobile: key facts row, Timing and Preparation side by side. */}
            {service.timing || service.preparation ? (
              <div className="mt-6 grid grid-cols-2 gap-3 md:hidden">
                {service.timing ? (
                  <div className="rounded-2xl border border-rose-tint bg-blush p-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                      <Clock className="size-3.5" aria-hidden="true" />
                      Timing
                    </p>
                    <p className="mt-2 text-sm/[20px] text-ink">{service.timing}</p>
                  </div>
                ) : null}
                {service.preparation ? (
                  <div className="rounded-2xl border border-rose-tint bg-blush p-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                      <ClipboardList className="size-3.5" aria-hidden="true" />
                      Preparation
                    </p>
                    <p className="mt-2 text-sm/[20px] text-ink">
                      {service.preparation}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Mobile: sticky in-page nav under the header. */}
            <ChipNav items={chipNavItems} />

            {/* Mobile: the full intro paragraphs lead the content. */}
            <div className="mt-8 space-y-4 text-base/[26px] text-ink-muted md:hidden">
              {service.detail.map((para, i) => (
                <p key={i} className="text-pretty">{para}</p>
              ))}
            </div>

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
                <div className="md:hidden">
                  <StepsList
                    steps={service.steps.map((step) => ({ text: step }))}
                  />
                </div>
                <ol className="hidden space-y-4 md:block">
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

            {service.reportAndNextSteps || service.resultsDetail?.length ? (
              <DetailSection id="report" title="Your report and next steps">
                <div className="space-y-2 text-sm text-muted-foreground">
                  {service.reportAndNextSteps ? (
                    <p>{service.reportAndNextSteps}</p>
                  ) : null}
                  {service.resultsDetail?.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </DetailSection>
            ) : null}

            {service.visitNotes?.length ? (
              <DetailSection id="visit-notes" title="Your visit">
                <ul className="space-y-2.5">
                  {service.visitNotes.map((item) => (
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

            {service.limits?.length ? (
              <DetailSection id="limits" title="What it cannot show">
                <ul className="space-y-2.5">
                  {service.limits.map((item) => (
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

            {service.followUp?.length ? (
              <DetailSection id="follow-up" title="Follow-up and referrals">
                <ul className="space-y-2.5">
                  {service.followUp.map((item) => (
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
                      <AccordionTrigger className="max-md:min-h-14">
                        {faq.question}
                      </AccordionTrigger>
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

      {/* Mobile: the desktop sticky booking card is replaced by a slim bar
          pinned just above the shared bottom bar. */}
      <ServiceBookingBar service={service} />

      {related.length > 0 ? (
        <Section className="bg-blush">
          <Container>
            <SectionHeader title="Related services" className="md:hidden" />
            <h2 className="mb-8 hidden text-2xl font-semibold text-ink md:block">
              Related services
            </h2>
            <MobileCarousel
              label="Related services"
              className="md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3"
              items={related.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            />
            <Button
              variant="outline"
              nativeButton={false}
              className="mt-8 md:hidden"
              render={<Link href="/services" />}
            >
              View all
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Link
              href="/services"
              className="mt-8 hidden items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline md:inline-flex"
            >
              View all services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Container>
        </Section>
      ) : null}

      {serviceGuides.length > 0 ? (
        <Section surface="white">
          <Container>
            <SectionHeader title="Related guides" className="md:hidden" />
            <h2 className="mb-8 hidden text-2xl font-semibold text-ink md:block">
              Related guides
            </h2>
            <MobileCarousel
              label="Related guides"
              className="md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3"
              items={serviceGuides.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            />
          </Container>
        </Section>
      ) : null}

      <Section
        surface={serviceGuides.length > 0 ? "blush" : "white"}
        className="pt-0 md:bg-white"
      >
        <Container>
          <p className="mx-auto mb-8 max-w-3xl rounded-2xl border border-rose-tint bg-white p-4 text-xs/[20px] text-muted-foreground md:hidden">
            In keeping with the PCPNDT Act, 1994, this service does not involve
            determination or disclosure of the sex of the fetus. This is a
            criminal offence in India and is never performed at this centre.
          </p>
        </Container>
        <CTABand />
      </Section>
    </>
  );
}
