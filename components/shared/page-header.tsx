import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/container";

export type Crumb = { label: string; href?: string };

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
}) {
  return (
    <header className="border-b border-rose-tint bg-blush">
      <Container className="py-12 text-center md:py-14 md:text-left">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-muted-foreground md:justify-start">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={c.label} className="flex items-center gap-1.5">
                  {i > 0 ? (
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  ) : null}
                  {c.href && !last ? (
                    <Link href={c.href} className="link">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current={last ? "page" : undefined}>{c.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        {eyebrow ? (
          <p data-eyebrow className="mt-5 mb-2 text-xs font-semibold tracking-[0.14em] uppercase text-primary md:text-sm md:font-bold">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold text-plum md:text-4xl">{title}</h1>
        {subtitle ? (
          <p className="mx-auto mt-3 line-clamp-2 max-w-sm text-muted-foreground md:mx-0 md:line-clamp-none md:max-w-2xl md:text-lg">
            {subtitle}
          </p>
        ) : null}
      </Container>
    </header>
  );
}
