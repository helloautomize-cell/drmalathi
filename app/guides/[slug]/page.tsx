import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ScanLine } from "lucide-react";
import { CTABand } from "@/components/cards/cta-band";
import { InfoCard } from "@/components/cards/mobile-cards";
import { ArticleToc, MobileToc } from "@/components/guides/article-toc";
import {
  GuideBlockRenderer,
  renderInline,
} from "@/components/guides/guide-blocks";
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
import {
  breadcrumbNode,
  faqNode,
  guideArticleNode,
  pageGraph,
  personNode,
  webPageNode,
} from "@/lib/schema";
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
      url: `${site.url}/guides/${guide.slug}`,
      title,
      description,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt ?? guide.publishedAt,
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
  // A review badge requires a completed review: status "reviewed" plus a
  // reviewedAt date. reviewedBy alone never shows the badge.
  const reviewer =
    guide.reviewStatus === "reviewed" && guide.reviewedAt && guide.reviewedBy
      ? doctors.find((d) => d.slug === guide.reviewedBy)
      : undefined;
  const relatedService = guide.relatedService
    ? services.find((s) => s.slug === guide.relatedService)
    : undefined;
  const related = getRelatedGuides(guide).map(toGuideCardData);
  const toc = [
    ...guideToc(guide),
    ...(guide.keyTakeaways?.length
      ? [{ id: "key-takeaways", text: "Key takeaways" }]
      : []),
    ...(guide.faqs?.length ? [{ id: "faqs", text: "Common questions" }] : []),
    ...(guide.sources?.length ? [{ id: "sources", text: "Sources" }] : []),
  ];
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

  const articleJsonLd = pageGraph([
    webPageNode(`/guides/${guide.slug}`, guide.title, guide.excerpt),
    guideArticleNode({
      slug: guide.slug,
      title: guide.title,
      excerpt: guide.excerpt,
      coverImageSrc: guide.coverImage.src,
      publishedAt: guide.publishedAt,
      updatedAt: guide.updatedAt,
      reviewedAt:
        guide.reviewStatus === "reviewed" ? guide.reviewedAt : undefined,
      reviewedBy: guide.reviewedBy,
    }),
    ...(reviewer ? [personNode(reviewer)] : []),
    breadcrumbNode([
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
    ]),
    ...(guide.faqs?.length
      ? [
          faqNode(
            guide.faqs.map((f) => ({ question: f.question, answer: f.answer })),
            `/guides/${guide.slug}`
          ),
        ]
      : []),
  ]);

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <ReadingProgress />

      {/* Header (white) */}
      <SectionShell surface="white" className="py-10! md:py-14!">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="min-w-0 lg:col-span-5">
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
          <h1 className="mt-2 max-w-3xl font-heading text-[34px]/[40px] font-semibold text-balance text-ink md:text-[48px]/[56px] lg:text-[40px]/[48px]">
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
                    alt={reviewer.photoAlt ?? ""}
                    fill
                    sizes="40px"
                    className="object-cover"
                    style={{
                      objectPosition: `${reviewer.photoFocus.x}% ${reviewer.photoFocus.y}%`,
                    }}
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
              <Link
                href="/doctors"
                className="font-semibold text-ink underline-offset-4 hover:underline"
              >
                Written and medically reviewed by the FMC Trichy clinical team
              </Link>
            )}
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>{dateLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{readTime}</span>
          </div>
          <MobileToc items={toc} />
            </div>

          <figure className="mt-8 lg:col-span-7 lg:mt-0">
            <div className="relative aspect-video overflow-hidden rounded-3xl">
              <Image
                src={guide.coverImage.src}
                alt={guide.coverImage.alt}
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 58vw, 100vw"
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
          </div>
        </Container>
      </SectionShell>

      {/* Body */}
      <SectionShell surface="white" className="py-0! pb-12! md:py-0! md:pb-16!">
        <Container>
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)_280px]">
            <div className="hidden lg:block">
              <ArticleToc items={toc} />
            </div>
            <div className="min-w-0 max-w-[68ch]">
              {guide.quickAnswer ? (
                <aside className="rounded-2xl bg-rose-tint p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                    Quick answer
                  </p>
                  <p className="mt-2 text-[17px]/[28px] text-pretty text-ink">
                    {renderInline(guide.quickAnswer)}
                  </p>
                </aside>
              ) : null}

              {renderBlocks(guide)}

              {guide.keyTakeaways?.length ? (
                <aside
                  id="key-takeaways"
                  className="mt-10 scroll-mt-24 rounded-2xl bg-blush p-5"
                >
                  <p className="font-heading text-[19px]/[26px] font-semibold text-ink">
                    Key takeaways
                  </p>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-base/[26px] text-ink marker:font-semibold marker:text-primary">
                    {guide.keyTakeaways.map((t) => (
                      <li key={t} className="pl-1">
                        {renderInline(t)}
                      </li>
                    ))}
                  </ol>
                </aside>
              ) : null}

              {guide.faqs?.length ? (
                <section id="faqs" className="mt-12 scroll-mt-24">
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
                          {renderInline(faq.answer)}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              ) : null}

              {guide.sources?.length ? (
                <section id="sources" className="mt-12 scroll-mt-24">
                  <h2 className="font-heading text-[24px]/[30px] font-semibold text-ink md:text-[28px]/[36px]">
                    Sources
                  </h2>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-base/[26px] text-ink-muted marker:font-semibold marker:text-primary">
                    {guide.sources.map((s) => (
                      <li key={`${s.title}-${s.url ?? ""}`} className="pl-1">
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener"
                            className="font-medium text-primary underline underline-offset-4 focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                          >
                            {s.title}
                          </a>
                        ) : (
                          s.title
                        )}
                        {s.publisher ? (
                          <span> · {s.publisher}</span>
                        ) : null}
                      </li>
                    ))}
                  </ol>
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
                <div className="mt-6 flex items-center gap-4 rounded-2xl border border-rose-tint bg-white p-5 xl:hidden">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-blush">
                    <Image
                      src={reviewer.photo}
                      alt={reviewer.photoAlt ?? `Portrait of ${reviewer.name}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                      style={{
                        objectPosition: `${reviewer.photoFocus.x}% ${reviewer.photoFocus.y}%`,
                      }}
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
            <div className="hidden xl:block">
              {relatedService || reviewer ? (
                <div className="sticky top-24 space-y-6">
                  {relatedService ? (
                    <GuideCtaBlock
                      service={relatedService}
                      className="mt-0"
                    />
                  ) : null}
                  {reviewer ? (
                    <div className="rounded-2xl border border-rose-tint bg-white p-5">
                      <p className="flex items-center gap-1.5 text-[13px] font-semibold text-teal">
                        <BadgeCheck className="size-4" aria-hidden="true" />
                        Medically reviewed
                      </p>
                      <p className="mt-2 font-heading text-[19px]/[26px] font-semibold text-ink">
                        {reviewer.name}
                      </p>
                      <p className="text-sm/[20px] text-ink-muted">
                        {reviewer.qualifications.join(", ")}
                        {guide.reviewedAt
                          ? ` · Reviewed ${dateFmt(guide.reviewedAt)}`
                          : ""}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
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
        <SectionShell
          surface={related.length > 0 ? "white" : "blush"}
          className="xl:hidden"
        >
          <Container className="max-w-2xl">
            <InfoCard
              icon={ScanLine}
              tone="scan"
              title={relatedService.name}
              href={`/services/${relatedService.slug}`}
              linkLabel={`About ${relatedService.name}`}
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
