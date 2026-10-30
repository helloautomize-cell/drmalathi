import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import type { Crumb } from "@/components/shared/page-header";
import { imageBlurDataURL } from "@/lib/image-placeholder";

/**
 * Inner-page hero: white on mobile (blush at md, matching the old
 * PageHeader), one-line breadcrumb that truncates in the middle, eyebrow,
 * H1, a short intro, optional chips and an optional 16:10 image (mobile
 * only). Desktop layout mirrors the previous PageHeader.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  chips,
  image,
  imageAlt = "",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs: Crumb[];
  chips?: React.ReactNode;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <header className="border-b border-rose-tint bg-white md:bg-blush">
      <Container className="py-10 text-left md:py-14">
        <nav aria-label="Breadcrumb" className="min-w-0 overflow-hidden">
          <ol className="flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground md:text-sm">
            {crumbs.map((crumb, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li
                  key={crumb.label}
                  className={`flex items-center gap-1.5 ${i === 0 ? "shrink-0" : "min-w-0"}`}
                >
                  {i > 0 ? (
                    <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
                  ) : null}
                  {crumb.href && !last ? (
                    <Link
                      href={crumb.href}
                      className="link truncate max-md:inline-flex max-md:min-h-11 max-md:min-w-11 max-md:items-center max-md:justify-center"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={last ? "page" : undefined}
                      className="truncate"
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        {eyebrow ? (
          <p
            data-eyebrow
            className="mt-5 mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase md:text-sm md:font-bold"
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-balance text-[34px]/[40px] font-semibold text-plum md:text-4xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-3 line-clamp-2 max-w-sm text-base/[26px] text-pretty text-ink-muted md:line-clamp-none md:max-w-2xl md:text-lg">
            {intro}
          </p>
        ) : null}
        {chips ? <div className="mt-4 flex flex-wrap gap-2">{chips}</div> : null}
        {image ? (
          <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-3xl shadow-soft md:hidden">
            <Image
              src={image}
              alt={imageAlt}
              fill
              fetchPriority="high"
              sizes="100vw"
              placeholder="blur"
              blurDataURL={imageBlurDataURL}
              className="object-cover"
            />
          </div>
        ) : null}
      </Container>
    </header>
  );
}
