import Link from "next/link";
import { Compass, FileSearch, HeartHandshake, HeartPlus } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";

const paths = [
  {
    icon: HeartPlus,
    title: "I'm newly pregnant",
    mobileTitle: "I'm newly pregnant",
    mobileLine: "Confirm your pregnancy and plan screening.",
    text: "Confirm your pregnancy is on track with a viability scan, then plan your first trimester screening.",
    href: "/services/viability-scan",
    cta: "See early pregnancy scans",
  },
  {
    icon: Compass,
    title: "I need a scan or test",
    mobileTitle: "I need a scan or test",
    mobileLine: "Find the right scan or test for your week.",
    text: "Browse every screening scan, diagnostic test, and specialty clinic we offer, with what to expect.",
    href: "/services",
    cta: "View all services",
  },
  {
    icon: FileSearch,
    title: "I have a concern or want a second opinion",
    mobileTitle: "I have a concern",
    mobileLine: "Get a specialist review of your reports.",
    text: "A specialist second opinion scan or genetic counselling can review your reports and explain your options.",
    href: "/services/second-opinion-scan",
    cta: "Get a specialist review",
  },
  {
    icon: HeartHandshake,
    title: "I've had a loss or want to plan my next pregnancy",
    mobileTitle: "I've had a loss",
    mobileLine: "Understand what happened and plan ahead.",
    text: "Our recurrent miscarriages clinic and genetic counsellors help you understand what happened and plan ahead.",
    href: "/services/recurrent-miscarriages-clinic",
    cta: "Plan with our clinic",
  },
] as const;

export function HelpRow() {
  return (
    <Section surface="white" overlapHero>
      <Container>
        <SectionHeader
          eyebrow="Start here"
          title="How can we help you?"
          subtitle="Choose the situation closest to yours. Each path leads to the right scan, test, or clinic."
        />
        {/* Mobile: compact 2x2 link tiles. */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {paths.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              data-mobile-card="info"
              className="reveal flex h-full flex-col rounded-2xl border border-rose-tint bg-blush p-5 shadow-soft focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-rose-tint text-primary">
                <p.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="mt-3 block text-base/[22px] font-semibold text-ink text-balance">
                {p.mobileTitle}
              </span>
              <span className="mt-1 block text-sm/[20px] text-ink-muted text-pretty">
                {p.mobileLine}
              </span>
            </Link>
          ))}
        </div>
        {/* Desktop: original four-card row, unchanged. */}
        <div className="hidden gap-5 sm:grid-cols-2 md:grid lg:grid-cols-4">
          {paths.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              data-mobile-card="info"
              className="group reveal flex h-full flex-col rounded-2xl border border-rose-tint bg-white p-5 shadow-soft transition-all md:p-6 hover:-translate-y-1 hover:shadow-card focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-rose-tint text-primary md:size-12">
                <p.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 flex-1 text-base text-muted-foreground md:text-sm">
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
