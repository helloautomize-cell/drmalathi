import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { cn } from "cn";
import { imageBlurDataURL } from "@/lib/image-placeholder";

export type GuideCardData = {
  slug: string;
  title: string;
  /** Shorter title shown on the card; falls back to `title`. */
  cardTitle?: string;
  excerpt: string;
  cover: { src: string; alt: string };
  categoryName: string;
  categorySlug: string;
  reviewed: boolean;
  dateLabel: string;
  readTime: string;
  /** Larger layout for the featured card on the index page. */
  featured?: boolean;
};

/**
 * Guide card used on the index, category, related and home sections. The
 * whole card is one link; hover effects apply on hover-capable devices only.
 */
export function GuideCard({ guide }: { guide: GuideCardData }) {
  const card = (
    <article
      data-mobile-card="info"
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-rose-tint bg-white shadow-soft transition-shadow hover:shadow-card",
        guide.featured && "lg:grid lg:grid-cols-12"
      )}
    >
      <div
        className={cn(
          "relative aspect-video overflow-hidden",
          guide.featured ? "lg:col-span-7 lg:self-center" : ""
        )}
      >
        <Image
          src={guide.cover.src}
          alt={guide.cover.alt}
          fill
          sizes={
            guide.featured
              ? "(min-width: 1024px) 58vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          }
          placeholder="blur"
          blurDataURL={imageBlurDataURL}
          className="object-cover transition-transform duration-300 motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.03]"
        />
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col p-5",
          guide.featured && "justify-center lg:col-span-5 lg:p-10"
        )}
      >
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          {guide.categoryName}
        </p>
        <h3
          className={cn(
            "mt-2 font-heading font-semibold text-balance text-ink [@media(hover:hover)]:group-hover:underline [@media(hover:hover)]:group-hover:underline-offset-4",
            guide.featured
              ? "text-[26px]/[32px] md:text-3xl"
              : "line-clamp-3 text-[19px]/[26px]"
          )}
        >
          {guide.cardTitle ?? guide.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-base/[26px] text-pretty text-ink-muted">
          {guide.excerpt}
        </p>
        <p className="mt-auto flex items-center gap-2 pt-4 text-[13px]/[20px] text-ink-muted">
          {guide.reviewed ? (
            <span className="inline-flex items-center gap-1 font-semibold text-teal">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              Reviewed
            </span>
          ) : null}
          <span>{guide.dateLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{guide.readTime}</span>
        </p>
      </div>
    </article>
  );

  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="block h-full focus-visible:rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      aria-label={guide.title}
    >
      {card}
    </Link>
  );
}
