"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  faqCategories,
  faqs,
  type FaqCategoryId,
} from "@/data/faqs";

type Filter = "all" | FaqCategoryId;

const chips: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...faqCategories.map((c) => ({ id: c.id, label: c.label })),
];

export function FaqBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      if (filter !== "all" && faq.category !== filter) return false;
      if (!q) return true;
      return `${faq.question} ${faq.answer}`.toLowerCase().includes(q);
    });
  }, [filter, query]);

  return (
    <>
      {/* Mobile: search + sticky category chips. */}
      <div className="mb-4 md:hidden">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions"
            aria-label="Search questions"
            className="h-12 w-full rounded-full border border-rose-tint bg-white pr-4 pl-11 text-base shadow-soft outline-none placeholder:text-ink-muted focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
      <div
        role="group"
        aria-label="Filter questions by topic"
        className="mb-6 flex gap-2 max-md:sticky max-md:top-[60px] max-md:z-30 max-md:-mx-4 max-md:overflow-x-auto max-md:border-b max-md:border-rose-tint max-md:bg-white/95 max-md:px-4 max-md:py-2 max-md:backdrop-blur max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:mb-8 md:flex-wrap"
      >
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            aria-pressed={filter === chip.id}
            onClick={() => setFilter(chip.id)}
            className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
              filter === chip.id
                ? "border-primary bg-primary text-white"
                : "border-rose-tint bg-white text-ink hover:bg-blush"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <Accordion>
        {visible.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="text-left text-base font-semibold text-ink max-md:min-h-14">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {visible.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-blush px-4 py-3 text-sm text-muted-foreground">
          No questions match your search. Call us and we will answer directly.
        </p>
      ) : null}
    </>
  );
}
