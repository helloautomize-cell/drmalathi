import type { GuideCardData } from "@/components/guides/guide-card";
import { getCategory, readingTime } from "@/lib/guides";
import type { Guide } from "@/types/guide";

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** Serializable card payload, safe to pass from server to client components. */
export function toGuideCardData(guide: Guide): GuideCardData {
  const updated =
    guide.updatedAt && new Date(guide.updatedAt) > new Date(guide.publishedAt);
  return {
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.excerpt,
    cover: guide.coverImage,
    categoryName: getCategory(guide.category)?.name ?? guide.category,
    categorySlug: guide.category,
    reviewed: Boolean(guide.reviewedBy),
    dateLabel: updated
      ? `Updated ${dateFmt(guide.updatedAt as string)}`
      : dateFmt(guide.publishedAt),
    readTime: `${readingTime(guide)} min read`,
  };
}
