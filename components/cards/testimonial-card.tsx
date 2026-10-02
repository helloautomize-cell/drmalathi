"use client";

import { useState } from "react";
import { Languages, Quote } from "lucide-react";
import { cn } from "cn";
import { Card, CardContent } from "@/components/ui/card";
import type { Testimonial } from "@/data/testimonials";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const hasTranslation =
    testimonial.language === "ta" && Boolean(testimonial.translation);
  const translated = hasTranslation && showTranslation;

  return (
    <Card className="h-full border-rose-tint shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
      <CardContent className="flex h-full flex-col gap-5 p-7">
        <Quote
          className="size-8 text-accent-bright/60"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <blockquote className="flex-1">
          <p
            lang={translated ? "en" : testimonial.language}
            className={cn(
              "text-base leading-relaxed text-ink",
              testimonial.language === "ta" &&
                !translated &&
                "[font-family:var(--font-tamil),sans-serif]"
            )}
          >
            {translated ? testimonial.translation : testimonial.quote}
          </p>
        </blockquote>
        {hasTranslation ? (
          <button
            type="button"
            onClick={() => setShowTranslation((v) => !v)}
            className="inline-flex min-h-11 w-fit items-center gap-1.5 rounded-lg text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Languages className="size-4" aria-hidden="true" />
            {showTranslation ? "Show original Tamil" : "Read in English"}
          </button>
        ) : null}
        <div className="flex items-center gap-3 border-t border-rose-tint pt-4">
          <div
            className="flex size-11 items-center justify-center rounded-full bg-rose-tint font-heading text-sm font-semibold text-primary"
            aria-hidden="true"
          >
            {initials(testimonial.name)}
          </div>
          <div>
            <p className="font-semibold text-ink">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground">Patient family</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
