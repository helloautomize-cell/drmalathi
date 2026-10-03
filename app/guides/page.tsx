import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABand } from "@/components/cards/cta-band";
import { GuideBrowser } from "@/components/guides/guide-browser";
import { GuideCard } from "@/components/guides/guide-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionShell } from "@/components/shared/section-shell";
import { toGuideCardData } from "@/lib/guide-card-data";
import {
  categoriesInUse,
  getAllGuides,
  getFeaturedGuide,
  hasPublishedGuides,
} from "@/lib/guides";
import { breadcrumbSchema } from "@/lib/schema";

export function generateMetadata(): Metadata {
  return {
    title: "Patient Guides",
    description:
      "Clear, practical guides to pregnancy scans, screening tests and fetal medicine, written by our clinical team for families in Trichy and nearby districts.",
    alternates: { canonical: "/guides" },
  };
}

export default function GuidesPage() {
  // While every guide is a draft in production the section is 404, not an
  // empty state; preview deploys keep rendering drafts.
  if (!hasPublishedGuides()) notFound();
  const featured = getFeaturedGuide();
  const { guides: pageGuides, pages } = getAllGuides({ page: 1 });
  const allCards = getAllGuides().guides.map(toGuideCardData);
  const pageCards = pageGuides
    .filter((g) => g.slug !== featured?.slug)
    .map(toGuideCardData);
  const categories = categoriesInUse();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Patient guides", href: "/guides" },
        ])}
      />
      {/* Hero (blush). The search input in the section below floats up onto
          the hero boundary. */}
      <Section surface="blush" className="pt-10 pb-20 md:pt-14">
        <Container>
          <nav aria-label="Breadcrumb" className="text-xs text-ink-muted">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="max-md:inline-flex max-md:min-h-11 max-md:min-w-11 max-md:items-center max-md:justify-center hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-ink">
                Patient guides
              </li>
            </ol>
          </nav>
          <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Patient guides
          </p>
          <h1 className="mt-2 font-heading text-[34px]/[40px] font-semibold text-balance text-ink md:text-5xl">
            Pregnancy questions, answered clearly
          </h1>
          <p className="mt-3 max-w-xl text-base/[26px] text-pretty text-ink-muted">
            Clear, practical guides from our fetal medicine team.
          </p>
          <div
            className="mt-5 flex flex-nowrap gap-2 overflow-x-auto pb-1 md:flex-wrap"
            aria-label="Guide categories"
          >
            <Link
              href="/guides"
              aria-current="page"
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-primary px-4 text-sm font-semibold whitespace-nowrap text-white"
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/guides/category/${c.slug}`}
                className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-rose-tint bg-white px-4 text-sm font-semibold whitespace-nowrap text-ink hover:bg-blush"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <SectionShell surface="white" className="py-0! pb-12! md:py-0! md:pb-16!">
        <Container>
          <div className="relative z-10 -mt-10">
            <GuideBrowser
              pageItems={pageCards}
              allItems={allCards}
              categories={categories}
              page={1}
              pageCount={pages}
              basePath="/guides"
              featured={
                featured ? (
                  <GuideCard
                    guide={{ ...toGuideCardData(featured), featured: true }}
                  />
                ) : undefined
              }
            />
          </div>
        </Container>
      </SectionShell>

      <Section surface="blush">
        <Container>
          <CTABand />
        </Container>
      </Section>
    </>
  );
}
