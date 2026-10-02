import { Brain, Calendar, Dna, TrendingUp, Zap } from "lucide-react";
import { StatChip } from "@/components/cards/stat-chip";
import { Container } from "@/components/shared/container";
import { HeartbeatLine } from "@/components/shared/heartbeat-line";
import { stats as metricSlots } from "@/data/trust";
import { foundedYear } from "@/lib/site";

const firsts = [
  {
    icon: Zap,
    title: "Fetoscopic procedures",
    pill: "South Tamil Nadu",
    description:
      "The first centre in South Tamil Nadu to perform minimally invasive surgery inside the womb.",
  },
  {
    icon: Brain,
    title: "Fetal neurosonogram",
    pill: "Tamil Nadu",
    description:
      "The first centre in Tamil Nadu to offer detailed scanning of the baby's brain and spine.",
  },
  {
    icon: Dna,
    title: "In-house genetic counselling",
    pill: "In-house",
    description:
      "The first centre with in-house genetic counselling and fetal postmortem evaluation.",
  },
];

const chips = [
  { icon: Calendar, label: `Since ${foundedYear}` },
  {
    icon: Zap,
    label: "First in south Tamil Nadu for fetoscopic procedures",
  },
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
    <section className="relative overflow-hidden bg-plum text-white">
      <HeartbeatLine className="absolute top-0 left-0 h-10 w-full text-accent-soft/50" />
      <div
        className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-accent-bright/15 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative py-16 md:py-20">
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {chips.map((chip) => (
            <StatChip key={chip.label} icon={chip.icon} label={chip.label} />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {firsts.map((item) => (
            <div
              key={item.title}
              className="reveal rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent-bright/20 text-accent-soft">
                  <item.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <span className="rounded-full border border-white/30 px-3 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
                  {item.pill}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
