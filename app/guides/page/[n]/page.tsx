import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABand } from "@/components/cards/cta-band";
import { GuideBrowser } from "@/components/guides/guide-browser";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionShell } from "@/components/shared/section-shell";
import { toGuideCardData } from "@/lib/guide-card-data";
import { categoriesInUse, getAllGuides } from "@/lib/guides";
import { breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  const { pages } = getAllGuides();
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({
    n: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}): Promise<Metadata> {
  const { n } = await params;
  return {
    title: `Patient Guides, page ${n}`,
    description:
      "Clear, practical guides to pregnancy scans, screening tests and fetal medicine, written by the FMC Trichy team.",
    alternates: { canonical: `/guides/page/${n}` },
  };
}

export default async function GuidesPageN({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const page = Number.parseInt(n, 10);
  const { guides: pageGuides, pages } = getAllGuides({ page });
  if (!Number.isFinite(page) || page < 2 || page > pages) notFound();

  const allCards = getAllGuides().guides.map(toGuideCardData);
  const categories = categoriesInUse();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Patient guides", href: "/guides" },
          { label: `Page ${page}`, href: `/guides/page/${page}` },
        ])}
      />
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
              <li>
                <Link href="/guides" className="max-md:inline-flex max-md:min-h-11 max-md:min-w-11 max-md:items-center max-md:justify-center hover:text-ink">
                  Patient guides
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-ink">
                Page {page}
              </li>
            </ol>
          </nav>
          <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Patient guides
          </p>
          <h1 className="mt-2 font-heading text-[34px]/[40px] font-semibold text-balance text-ink md:text-5xl">
            Pregnancy questions, answered clearly
          </h1>
        </Container>
      </Section>

      <SectionShell surface="white" className="py-0! pb-12! md:py-0! md:pb-16!">
        <Container className="relative z-10 -mt-10">
          <GuideBrowser
            pageItems={pageGuides.map(toGuideCardData)}
            allItems={allCards}
            categories={categories}
            page={page}
            pageCount={pages}
            basePath="/guides"
          />
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
