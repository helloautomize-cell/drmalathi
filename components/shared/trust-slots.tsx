import Image from "next/image";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import Link from "next/link";
import { Award, Play, Star, StarHalf } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { trust } from "@/data/trust";

// Renders nothing until real ratings, awards, or media exist in data/trust.ts.
export function TrustSlots() {
  const { googleRating, awards, affiliations, virtualTourUrl, videoTestimonial } =
    trust;
  const hasAny =
    googleRating ||
    awards.length > 0 ||
    affiliations.length > 0 ||
    virtualTourUrl ||
    videoTestimonial;
  if (!hasAny) return null;

  return (
    <Section surface="blush" className="md:bg-white">
      <Container className="space-y-8">
        {googleRating ? (
          <a
            href={googleRating.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex w-fit items-center gap-3 rounded-2xl border border-rose-tint bg-white px-5 py-3 shadow-soft transition-shadow hover:shadow-card"
          >
            <span className="flex items-center gap-0.5 text-primary" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
              {googleRating.score >= 4.5 ? (
                <StarHalf className="size-4 fill-current" />
              ) : (
                <Star className="size-4 fill-current" />
              )}
            </span>
            <span className="text-sm font-semibold text-ink">
              {googleRating.score} on Google
            </span>
            <span className="text-sm text-muted-foreground">
              {googleRating.count} reviews
            </span>
          </a>
        ) : null}

        {awards.length > 0 || affiliations.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {awards.map((a) => (
              <span
                key={a.title}
                className="inline-flex items-center gap-2 rounded-full border border-rose-tint bg-blush px-4 py-2 text-sm font-semibold text-ink"
              >
                <Award className="size-4 text-primary" aria-hidden="true" />
                {a.title}
                <span className="text-muted-foreground font-normal">
                  {a.org}
                </span>
              </span>
            ))}
            {affiliations.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal-tint px-4 py-2 text-sm font-semibold text-teal"
              >
                {a}
              </span>
            ))}
          </div>
        ) : null}

        {virtualTourUrl ? (
          <Link
            href={virtualTourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex w-fit items-center gap-2 rounded-full bg-plum px-5 py-2.5 text-sm font-semibold text-white hover:bg-plum/90"
          >
            Take the virtual tour
          </Link>
        ) : null}

        {videoTestimonial ? (
          <figure className="mx-auto max-w-2xl overflow-hidden rounded-3xl shadow-card">
            <div className="relative aspect-video bg-plum">
              <Image
                src={videoTestimonial.poster}
                alt={videoTestimonial.caption}
                fill
                sizes="(min-width: 768px) 672px, 100vw"
                placeholder="blur"
                blurDataURL={imageBlurDataURL}
                className="object-cover"
              />
              <button
                type="button"
                aria-label={`Play video: ${videoTestimonial.caption}`}
                className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-card transition-transform hover:scale-105"
              >
                <Play className="size-7 fill-current" aria-hidden="true" />
              </button>
            </div>
            <figcaption className="bg-white px-5 py-3 text-sm text-muted-foreground">
              {videoTestimonial.caption}
            </figcaption>
          </figure>
        ) : null}
      </Container>
    </Section>
  );
}
