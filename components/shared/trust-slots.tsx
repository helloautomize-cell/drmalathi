import Link from "next/link";
import { Award } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { trust } from "@/data/trust";

// Renders nothing until real awards, affiliations, or media exist in
// data/trust.ts.
export function TrustSlots() {
  const { awards, affiliations, virtualTourUrl } = trust;
  const hasAny =
    awards.length > 0 || affiliations.length > 0 || virtualTourUrl;
  if (!hasAny) return null;

  return (
    <Section surface="blush" className="md:bg-white">
      <Container className="space-y-8">
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
      </Container>
    </Section>
  );
}
