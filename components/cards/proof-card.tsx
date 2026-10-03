import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type ProofCardData = {
  icon: LucideIcon;
  title: string;
  body: string;
  /** Short, verbatim-trimmed line from a real review. Never reworded. */
  quote?: { text: string; name: string };
  href?: string;
  linkLabel?: string;
};

export function ProofCard({
  icon: Icon,
  title,
  body,
  quote,
  href,
  linkLabel,
}: ProofCardData) {
  return (
    <Card data-mobile-card="info" className="h-full border-rose-tint shadow-soft transition-shadow hover:shadow-card">
      <CardContent className="flex h-full flex-col gap-3 p-5 md:p-6">
        <div className="flex size-11 items-center justify-center rounded-xl bg-rose-tint text-primary md:size-12">
          <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <p className="text-base text-muted-foreground md:text-sm">{body}</p>
        {quote || href ? (
          <div className="mt-auto flex flex-col gap-3 pt-3">
            {quote ? (
              <blockquote>
                <p className="text-sm text-ink/80 italic">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <footer className="mt-1 text-xs font-semibold text-muted-foreground">
                  {quote.name}
                </footer>
              </blockquote>
            ) : null}
            {href ? (
              <Link
                href={href}
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {linkLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
