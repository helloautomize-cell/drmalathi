import { Brain, Dna, Zap } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CountUp } from "@/components/shared/count-up";
import { HeartbeatLine } from "@/components/shared/heartbeat-line";

const firsts = [
  {
    icon: Zap,
    title: "Fetoscopic procedures",
    description:
      "The first centre in South Tamil Nadu to perform minimally invasive surgery inside the womb.",
  },
  {
    icon: Brain,
    title: "Fetal neurosonogram",
    description:
      "The first centre in Tamil Nadu to offer detailed scanning of the baby's brain and spine.",
  },
  {
    icon: Dna,
    title: "In-house genetic counselling",
    description:
      "The first centre with in-house genetic counselling and fetal postmortem evaluation.",
  },
];

const stats = [
  { end: 13, suffix: "", label: "years of fetal medicine care" },
  { end: 3, suffix: "", label: "regional firsts" },
  { end: 3, suffix: "", label: "specialist doctors" },
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
        <div className="mb-12 grid grid-cols-3 gap-6 text-center md:gap-10">
          {stats.map((s) => (
            <div key={s.label} className="reveal">
              <p className="font-heading text-4xl font-semibold text-white md:text-5xl">
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs tracking-wide text-white/70 uppercase sm:text-sm">
                {s.label}
              </p>
            </div>
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
                  First in the region
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
