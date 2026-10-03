"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { GuideCard, type GuideCardData } from "@/components/guides/guide-card";
import { cn } from "cn";

type Category = { slug: string; name: string };

/**
 * Index/category grid with a client-side search over all published guides.
 * Search matches title, excerpt and category name, debounced, and keeps
 * `?q=` in the URL for sharing. When a query is active the server's page
 * slice is replaced by matches across every guide.
 *
 * The search input is the first child so the page can float it up onto the
 * hero boundary with a negative margin.
 */
export function GuideBrowser({
  pageItems,
  allItems,
  categories,
  page,
  pageCount,
  basePath,
  featured,
}: {
  /** Guides for the current page (already paginated by the server). */
  pageItems: GuideCardData[];
  /** Every published guide in scope for client-side search. */
  allItems: GuideCardData[];
  categories: Category[];
  page: number;
  pageCount: number;
  /** "/guides" or "/guides/category/x"; pagination links hang off this. */
  basePath: string;
  /** Featured card rendered between the search input and the grid. */
  featured?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);

  // Seed from ?q= after mount (URL APIs are client-only; deferred to a task
  // so hydration output matches the server render).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (!q) return;
    const t = setTimeout(() => setQuery(q), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (deferred.trim()) url.searchParams.set("q", deferred.trim());
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, [deferred]);

  const searching = deferred.trim().length > 0;
  const q = deferred.trim().toLowerCase();
  const shown = searching
    ? allItems.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.excerpt.toLowerCase().includes(q) ||
          g.categoryName.toLowerCase().includes(q)
      )
    : pageItems;

  return (
    <div>
      <div className="relative max-w-md">
        <label htmlFor="guide-search" className="sr-only">
          Search guides
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
        <input
          id="guide-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search guides"
          className="min-h-12 w-full rounded-full border border-rose-tint bg-white pr-4 pl-11 text-base text-ink shadow-soft placeholder:text-ink-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        />
      </div>

      {!searching && featured ? <div className="mt-6 md:mt-8">{featured}</div> : null}

      {shown.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-rose-tint bg-white p-8 text-center">
          <p className="font-heading text-xl font-semibold text-ink">
            No guides found
          </p>
          <p className="mt-2 text-base/[26px] text-ink-muted">
            Try a different term, or browse a category below.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/guides/category/${c.slug}`}
                className="inline-flex min-h-11 items-center rounded-full border border-rose-tint px-4 text-sm font-semibold text-ink hover:bg-blush"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {shown.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      )}

      {!searching && pageCount > 1 ? (
        <nav
          aria-label="Guides pages"
          className="mt-8 flex items-center justify-center gap-2"
        >
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={n === 1 ? basePath : `${basePath}/page/${n}`}
              aria-current={n === page ? "page" : undefined}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full text-sm font-semibold",
                n === page
                  ? "bg-primary text-white"
                  : "border border-rose-tint text-ink hover:bg-blush"
              )}
            >
              {n}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
