import Link from "next/link";
import { ArrowRight, Compass, FileSearch, HeartHandshake, HeartPlus } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";

const paths = [
  {
    icon: HeartPlus,
    title: "I'm newly pregnant",
    text: "Confirm your pregnancy is on track with a viability scan, then plan your first trimester screening.",
    href: "/services/viability-scan",
    cta: "See early pregnancy scans",
  },
  {
    icon: Compass,
    title: "I need a scan or test",
    text: "Browse every screening scan, diagnostic test, and specialty clinic we offer, with what to expect.",
    href: "/services",
    cta: "Explore all services",
  },
  {
    icon: FileSearch,
    title: "I have a concern or want a second opinion",
    text: "A specialist second opinion scan or genetic counselling can review your reports and explain your options.",
    href: "/services/second-opinion-scan",
    cta: "Get a specialist review",
  },
  {
    icon: HeartHandshake,
    title: "I've had a loss or want to plan my next pregnancy",
    text: "Our recurrent miscarriages clinic and genetic counsellors help you understand what happened and plan ahead.",
    href: "/services/recurrent-miscarriages-clinic",
    cta: "Plan with our clinic",
  },
] as const;

export function HelpRow() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Start here"
          title="How can we help you?"
          subtitle="Choose the situation closest to yours. Each path leads to the right scan, test, or clinic."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group reveal flex h-full flex-col rounded-2xl border border-rose-tint bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-rose-tint text-primary">
                <p.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {p.text}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {p.cta}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
