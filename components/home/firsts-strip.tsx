import { Brain, Calendar, Dna, TrendingUp, Zap } from "lucide-react";
import { StatChip } from "@/components/cards/stat-chip";
import { Container } from "@/components/shared/container";
import { stats as metricSlots } from "@/data/trust";
import { foundedYear } from "@/lib/site";

// Factual descriptions only — comparative "first in the region" claims were
// removed for NMC compliance and must not be re-added without independent,
// documented evidence.
export const firsts: {
  icon: typeof Zap;
  title: string;
  pill: string;
  description: string;
}[] = [
  {
    icon: Zap,
    title: "Fetoscopic procedures",
    pill: "South Tamil Nadu",
    description:
      "Minimally invasive surgery inside the womb, performed at our Trichy centre.",
  },
  {
    icon: Brain,
    title: "Fetal neurosonogram",
    pill: "Tamil Nadu",
    description:
      "Detailed scanning of the baby's brain and spine at our Trichy centre.",
  },
  {
    icon: Dna,
    title: "In-house genetic counselling",
    pill: "In-house",
    description:
      "Genetic counselling and fetal postmortem evaluation inside the centre.",
  },
];

const chips = [
  { icon: Calendar, label: `Since ${foundedYear}` },
  { icon: Dna, label: "In-house genetic counselling" },
  // Real-figure slots populate automatically from data/trust.ts once the
  // client supplies verified numbers (scans performed, fellows trained, CME).
  ...Object.values(metricSlots)
    .filter((m): m is { value: number; label: string } => m !== null)
    .map((m) => ({
      icon: TrendingUp,
      label: `${m.value.toLocaleString("en-IN")} ${m.label}`,
    })),
];

export function FirstsStrip() {
  return (
    <section className="relative z-10 -mt-6 hidden overflow-hidden rounded-t-3xl bg-white text-ink md:mt-0 md:block md:rounded-none md:bg-plum md:text-white">
      <div
        className="pointer-events-none absolute -top-24 -right-24 hidden size-96 rounded-full bg-accent-bright/15 blur-3xl md:block"
        aria-hidden="true"
      />
      <Container className="relative py-12 md:py-20">
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {chips.map((chip) => (
            <StatChip key={chip.label} icon={chip.icon} label={chip.label} />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {firsts.map((item) => (
            <div
              key={item.title}
              className="reveal rounded-2xl border border-rose-tint bg-blush p-5 shadow-soft md:border-white/10 md:bg-white/5 md:p-6 md:shadow-none md:backdrop-blur-sm md:transition-colors md:hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent-bright/20 text-accent-soft">
                  <item.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <span className="rounded-full border border-primary/25 px-3 py-1 text-[13px]/[20px] font-semibold tracking-wide text-primary uppercase md:border-white/30 md:text-[11px] md:text-white">
                  {item.pill}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-ink md:text-white">
                {item.title}
              </h2>
              <p className="mt-2 text-base text-ink-muted md:text-sm md:text-white/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
