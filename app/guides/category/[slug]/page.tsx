import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABand } from "@/components/cards/cta-band";
import { GuideBrowser } from "@/components/guides/guide-browser";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { toGuideCardData } from "@/lib/guide-card-data";
import {
  categoriesInUse,
  getAllGuides,
  getCategory,
  hasPublishedGuides,
} from "@/lib/guides";
import { breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return categoriesInUse().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name}: Patient Guides`,
    description: category.description,
    alternates: { canonical: `/guides/category/${slug}` },
  };
}

export default async function GuideCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!hasPublishedGuides()) notFound();
  const { slug } = await params;
  const category = getCategory(slug);
  const { guides: categoryGuides } = getAllGuides({ category: slug });
  if (!category || categoryGuides.length === 0) notFound();

  const categories = categoriesInUse();
  const cards = categoryGuides.map(toGuideCardData);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Patient guides", href: "/guides" },
          { label: category.name, href: `/guides/category/${category.slug}` },
        ])}
      />
      <GuideBrowser
        pageItems={cards}
        allItems={cards}
        categories={categories}
        page={1}
        pageCount={1}
        basePath={`/guides/category/${category.slug}`}
        hero={
          <>
            <nav aria-label="Breadcrumb" className="text-xs text-ink-muted">
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link href="/" className="max-md:inline-flex max-md:min-h-11 max-md:min-w-11 max-md:items-center max-md:justify-center hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/guides" className="max-md:inline-flex max-md:min-h-11 max-md:min-w-11 max-md:items-center max-md:justify-center hover:text-ink">
                    Patient guides
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-semibold text-ink">
                  {category.name}
                </li>
              </ol>
            </nav>
            <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              Patient guides
            </p>
            <h1 className="mt-2 font-heading text-[34px]/[40px] font-semibold text-balance text-ink md:text-5xl">
              {category.name}
            </h1>
            <p className="mt-3 max-w-xl text-base/[26px] text-pretty text-ink-muted">
              {category.description}
            </p>
            <div
              className="mt-5 flex flex-nowrap gap-2 overflow-x-auto pb-1 md:flex-wrap"
              aria-label="Guide categories"
            >
              <Link
                href="/guides"
                className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-rose-tint bg-white px-4 text-sm font-semibold whitespace-nowrap text-ink hover:bg-blush"
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/guides/category/${c.slug}`}
                  aria-current={c.slug === slug ? "page" : undefined}
                  className={
                    c.slug === slug
                      ? "inline-flex min-h-11 shrink-0 items-center rounded-full bg-primary px-4 text-sm font-semibold whitespace-nowrap text-white"
                      : "inline-flex min-h-11 shrink-0 items-center rounded-full border border-rose-tint bg-white px-4 text-sm font-semibold whitespace-nowrap text-ink hover:bg-blush"
                  }
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </>
        }
      />

      <Section surface="blush">
        <Container>
          <CTABand />
        </Container>
      </Section>
    </>
  );
}
