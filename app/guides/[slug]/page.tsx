import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ScanLine } from "lucide-react";
import { CTABand } from "@/components/cards/cta-band";
import { InfoCard } from "@/components/cards/mobile-cards";
import { ArticleToc, MobileToc } from "@/components/guides/article-toc";
import { GuideBlockRenderer } from "@/components/guides/guide-blocks";
import { GuideCard } from "@/components/guides/guide-card";
import { GuideCtaBlock } from "@/components/guides/guide-cta-block";
import { ReadingProgress } from "@/components/guides/reading-progress";
import { ShareRow } from "@/components/guides/share-row";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionShell } from "@/components/shared/section-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { toGuideCardData } from "@/lib/guide-card-data";
import {
  getAllGuides,
  getCategory,
  getGuideBySlug,
  getRelatedGuides,
  guideToc,
  readingTime,
} from "@/lib/guides";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import type { GuideBlock } from "@/types/guide";

export function generateStaticParams() {
  return getAllGuides().guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  const title = guide.seo?.title ?? guide.title;
  const description = guide.seo?.description ?? guide.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt ?? guide.publishedAt,
      images: [`${site.url}${guide.coverImage.src}`],
    },
  };
}

function renderBlocks(guide: {
  content: GuideBlock[];
}): React.ReactNode[] {
  return guide.content.map((block, i) => {
    if (block.type === "cta") {
      const service = services.find((s) => s.slug === block.service);
      return service ? <GuideCtaBlock key={i} service={service} /> : null;
    }
    return <GuideBlockRenderer key={i} block={block} />;
  });
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "page" || slug === "category" || slug === "rss.xml") notFound();
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const category = getCategory(guide.category);
  const reviewer = guide.reviewedBy
    ? doctors.find((d) => d.slug === guide.reviewedBy)
    : undefined;
  const relatedService = guide.relatedService
    ? services.find((s) => s.slug === guide.relatedService)
    : undefined;
  const related = getRelatedGuides(guide).map(toGuideCardData);
  const toc = guideToc(guide);
  const readTime = `${readingTime(guide)} min read`;

  const dateFmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const showUpdated =
    guide.updatedAt && new Date(guide.updatedAt) > new Date(guide.publishedAt);
  const dateLabel = showUpdated
    ? `Updated ${dateFmt(guide.updatedAt as string)}`
    : dateFmt(guide.publishedAt);

  const articleJsonLd = reviewer
    ? {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: guide.title,
        description: guide.excerpt,
        url: `${site.url}/guides/${guide.slug}`,
        image: `${site.url}${guide.coverImage.src}`,
        lastReviewed: guide.reviewedAt,
        reviewedBy: {
          "@type": "Physician",
          name: reviewer.name,
          ...(reviewer.hasProfile
            ? { url: `${site.url}/doctors/${reviewer.slug}` }
            : {}),
        },
        about: { "@type": "MedicalClinic", "@id": `${site.url}/#clinic` },
      }
    : {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description: guide.excerpt,
        image: `${site.url}${guide.coverImage.src}`,
        datePublished: guide.publishedAt,
        dateModified: guide.updatedAt ?? guide.publishedAt,
        author: { "@type": "MedicalClinic", "@id": `${site.url}/#clinic` },
        publisher: { "@type": "MedicalClinic", "@id": `${site.url}/#clinic` },
      };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Patient guides", href: "/guides" },
          ...(category
            ? [
                {
                  label: category.name,
                  href: `/guides/category/${category.slug}`,
                },
              ]
            : []),
          { label: guide.title, href: `/guides/${guide.slug}` },
        ])}
      />
      {guide.faqs?.length ? (
        <JsonLd
          data={faqSchema(
            guide.faqs.map((f) => ({ question: f.question, answer: f.answer }))
          )}
        />
      ) : null}
      <ReadingProgress />

      {/* Header (white) */}
      <SectionShell surface="white" className="py-10! md:py-14!">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-1.5 text-xs text-ink-muted"
          >
            <Link href="/" className="shrink-0 max-md:inline-flex max-md:min-h-11 max-md:min-w-11 max-md:items-center max-md:justify-center hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/guides" className="shrink-0 max-md:inline-flex max-md:min-h-11 max-md:min-w-11 max-md:items-center max-md:justify-center hover:text-ink">
              Patient guides
            </Link>
            {category ? (
              <>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/guides/category/${category.slug}`}
                  className="shrink-0 max-md:inline-flex max-md:min-h-11 max-md:min-w-11 max-md:items-center max-md:justify-center hover:text-ink"
                >
                  {category.name}
                </Link>
              </>
            ) : null}
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="truncate font-semibold text-ink">
              {guide.title}
            </span>
          </nav>

          {category ? (
            <Link
              href={`/guides/category/${category.slug}`}
              className="mt-5 inline-block text-xs font-semibold tracking-[0.14em] text-primary uppercase hover:underline"
            >
              {category.name}
            </Link>
          ) : null}
          <h1 className="mt-2 max-w-3xl font-heading text-[34px]/[40px] font-semibold text-balance text-ink md:text-[48px]/[56px]">
            {guide.title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-xl/[30px] text-ink-muted">
            {guide.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm/[20px] text-ink-muted">
            {reviewer ? (
              <Link
                href={
                  reviewer.hasProfile ? `/doctors/${reviewer.slug}` : "/doctors"
                }
                className="flex items-center gap-2.5 text-ink"
              >
                <span className="relative size-10 overflow-hidden rounded-full bg-blush">
                  <Image
                    src={reviewer.photo}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </span>
                <span>
                  <span className="block font-semibold">
                    Medically reviewed by {reviewer.name}
                  </span>
                  <span className="block text-ink-muted">
                    {reviewer.qualifications.join(", ")}
                  </span>
                </span>
              </Link>
            ) : (
              <span className="font-semibold text-ink">
                By the FMC Trichy team
              </span>
            )}
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>{dateLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{readTime}</span>
          </div>

          <figure className="mt-8">
            <div className="relative aspect-video overflow-hidden rounded-3xl">
              <Image
                src={guide.coverImage.src}
                alt={guide.coverImage.alt}
                fill
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                placeholder="blur"
                blurDataURL={imageBlurDataURL}
                className="object-cover"
              />
            </div>
            {guide.coverImage.caption ? (
              <figcaption className="mt-2 text-center text-[13px]/[20px] text-ink-muted">
                {guide.coverImage.caption}
              </figcaption>
            ) : null}
          </figure>

          <MobileToc items={toc} />
        </Container>
      </SectionShell>

      {/* Body */}
      <SectionShell surface="white" className="py-0! pb-12! md:py-0! md:pb-16!">
        <Container>
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
            <div className="hidden lg:block">
              <ArticleToc items={toc} />
            </div>
            <div className="max-w-[68ch]">
              {guide.quickAnswer ? (
                <aside className="rounded-2xl bg-rose-tint p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                    Quick answer
                  </p>
                  <p className="mt-2 text-[17px]/[28px] text-pretty text-ink">
                    {guide.quickAnswer}
                  </p>
                </aside>
              ) : null}

              {renderBlocks(guide)}

              {guide.keyTakeaways?.length ? (
                <aside className="mt-10 rounded-2xl bg-blush p-5">
                  <p className="font-heading text-[19px]/[26px] font-semibold text-ink">
                    Key takeaways
                  </p>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-base/[26px] text-ink marker:font-semibold marker:text-primary">
                    {guide.keyTakeaways.map((t) => (
                      <li key={t} className="pl-1">
                        {t}
                      </li>
                    ))}
                  </ol>
                </aside>
              ) : null}

              {guide.faqs?.length ? (
                <section className="mt-12">
                  <h2 className="font-heading text-[24px]/[30px] font-semibold text-ink md:text-[28px]/[36px]">
                    Common questions
                  </h2>
                  <Accordion className="mt-4 divide-y divide-rose-tint rounded-2xl border border-rose-tint bg-white">
                    {guide.faqs.map((faq) => (
                      <AccordionItem
                        key={faq.question}
                        value={faq.question}
                        className="border-none px-4"
                      >
                        <AccordionTrigger className="min-h-14 text-left text-base font-semibold text-ink">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base/[26px] text-ink-muted">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              ) : null}

              <div className="mt-10 rounded-2xl border border-rose-tint bg-blush/50 p-5 text-sm/[22px] text-ink-muted">
                <p>
                  This guide is for general information and does not replace a
                  consultation with a fetal medicine specialist.
                </p>
                <p className="mt-2">
                  In line with the PCPNDT Act, we do not perform or support sex
                  determination.
                </p>
              </div>

              {reviewer ? (
                <div className="mt-6 flex items-center gap-4 rounded-2xl border border-rose-tint bg-white p-5">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-blush">
                    <Image
                      src={reviewer.photo}
                      alt={`Portrait of ${reviewer.name}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[13px] font-semibold text-teal">
                      <BadgeCheck className="size-4" aria-hidden="true" />
                      Medically reviewed
                    </p>
                    <p className="mt-0.5 font-heading text-[19px]/[26px] font-semibold text-ink">
                      {reviewer.name}
                    </p>
                    <p className="text-sm/[20px] text-ink-muted">
                      {reviewer.qualifications.join(", ")}
                      {guide.reviewedAt ? ` · Reviewed ${dateFmt(guide.reviewedAt)}` : ""}
                    </p>
                  </div>
                </div>
              ) : null}

              <ShareRow title={guide.title} path={`/guides/${guide.slug}`} />
            </div>
          </div>
        </Container>
      </SectionShell>

      {related.length > 0 ? (
        <SectionShell surface="blush">
          <Container>
            <h2 className="font-heading text-[26px]/[32px] font-semibold text-balance text-ink">
              Related guides
            </h2>
            <div className="mt-6 md:hidden">
              <MobileCarousel
                label="Related guides"
                items={related.map((g) => <GuideCard key={g.slug} guide={g} />)}
              />
            </div>
            <div className="mt-6 hidden gap-6 md:grid md:grid-cols-3">
              {related.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </Container>
        </SectionShell>
      ) : null}

      {relatedService ? (
        <SectionShell surface={related.length > 0 ? "white" : "blush"}>
          <Container className="max-w-2xl">
            <InfoCard
              icon={ScanLine}
              tone="scan"
              title={relatedService.name}
              href={`/services/${relatedService.slug}`}
              linkLabel="Learn more"
            >
              {relatedService.shortDescription}
            </InfoCard>
          </Container>
        </SectionShell>
      ) : null}

      <Section surface="blush">
        <Container>
          <CTABand />
        </Container>
      </Section>
    </>
  );
}
