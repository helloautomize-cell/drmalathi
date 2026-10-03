// Replace the implementation with the CMS later; keep these signatures.
// Pages and components must read guides only through this module.

import { guideCategories } from "@/data/guide-categories";
import { guides } from "@/data/guides";
import type { Guide, GuideBlock, GuideCategory } from "@/types/guide";

export const GUIDES_PER_PAGE = 12;

const now = () => Date.now();

function isPublished(guide: Guide): boolean {
  return new Date(guide.publishedAt).getTime() <= now();
}

function sortNewest(list: Guide[]): Guide[] {
  return [...list].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getAllGuides(options?: {
  category?: string;
  page?: number;
  query?: string;
}): { guides: Guide[]; total: number; pages: number; page: number } {
  let list = guides.filter(isPublished);
  if (options?.category) {
    list = list.filter((g) => g.category === options.category);
  }
  if (options?.query) {
    const q = options.query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.excerpt.toLowerCase().includes(q) ||
          getCategory(g.category)?.name.toLowerCase().includes(q)
      );
    }
  }
  list = sortNewest(list);
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / GUIDES_PER_PAGE));
  const page = Math.min(Math.max(options?.page ?? 1, 1), pages);
  return {
    guides: list.slice((page - 1) * GUIDES_PER_PAGE, page * GUIDES_PER_PAGE),
    total,
    pages,
    page,
  };
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug && isPublished(g));
}

export function getFeaturedGuide(): Guide | undefined {
  const list = sortNewest(guides.filter(isPublished));
  return list.find((g) => g.featured) ?? list[0];
}

export function getRelatedGuides(guide: Guide, n = 3): Guide[] {
  return sortNewest(
    guides.filter(
      (g) => isPublished(g) && g.slug !== guide.slug && g.category === guide.category
    )
  ).slice(0, n);
}

export function getNewestGuides(n = 3): Guide[] {
  return sortNewest(guides.filter(isPublished)).slice(0, n);
}

export function getGuidesByService(serviceSlug: string): Guide[] {
  return sortNewest(
    guides.filter((g) => isPublished(g) && g.relatedService === serviceSlug)
  );
}

export function getCategory(slug: string): GuideCategory | undefined {
  return guideCategories.find((c) => c.slug === slug);
}

/** All categories; callers filter to those that have published guides. */
export function getCategories(): GuideCategory[] {
  return guideCategories;
}

export function categoriesInUse(): GuideCategory[] {
  const used = new Set(
    guides.filter(isPublished).map((g) => g.category)
  );
  return guideCategories.filter((c) => used.has(c.slug));
}

function allText(guide: Guide): string {
  const blocks = (block: GuideBlock): string => {
    switch (block.type) {
      case "h2":
      case "h3":
      case "paragraph":
      case "quote":
        return block.text;
      case "list":
        return block.items.join(" ");
      case "image":
        return block.caption ?? "";
      case "callout":
        return `${block.title ?? ""} ${block.text}`;
      case "table":
        return `${block.caption} ${block.headers.join(" ")} ${block.rows.flat().join(" ")}`;
      case "cta":
        return "";
    }
  };
  return [
    guide.title,
    guide.excerpt,
    guide.quickAnswer ?? "",
    ...guide.content.map(blocks),
    ...(guide.keyTakeaways ?? []),
    ...(guide.faqs ?? []).flatMap((f) => `${f.question} ${f.answer}`),
  ].join(" ");
}

/** Estimated reading time in minutes, rounded up, at 200 wpm. */
export function readingTime(guide: Guide): number {
  const words = allText(guide).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function guideToc(guide: Guide): { id: string; text: string }[] {
  return guide.content
    .filter(
      (b): b is Extract<GuideBlock, { type: "h2" | "h3" }> => b.type === "h2"
    )
    .map((b) => ({ id: b.id ?? slugifyHeading(b.text), text: b.text }));
}
