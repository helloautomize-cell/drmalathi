import { CalendarCheck, ClipboardList, MessagesSquare, ScanLine } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { StepsList } from "@/components/shared/steps-list";
import { SectionHeader } from "@/components/shared/section-header";

const steps = [
  {
    icon: CalendarCheck,
    title: "Book",
    text: "Call, WhatsApp, or send a request online. Our team helps you pick the right scan for your stage.",
  },
  {
    icon: ScanLine,
    title: "Scan by a specialist",
    text: "Your scan is performed or supervised by a fetal medicine specialist, not a technician alone.",
  },
  {
    icon: MessagesSquare,
    title: "Your findings, explained straight away",
    text: "We walk you through what we see on the screen and what it means, in words that make sense.",
  },
  {
    icon: ClipboardList,
    title: "Report and plan",
    text: "You leave with your report and a clear next step. Complex findings are reviewed by our specialist panel if needed.",
  },
] as const;

export function VisitSteps() {
  return (
    <Section surface="blush" className="md:bg-blush">
      <Container>
        <SectionHeader
          eyebrow="Your visit"
          title="What to expect at your visit"
          subtitle="Every appointment follows the same flow, so you always know what comes next."
        />
        {/* Mobile: vertical stepper, numbered circles joined by a rose line. */}
        <div className="md:hidden">
          <StepsList steps={steps} />
        </div>
        {/* Desktop: original card grid, unchanged. */}
        <ol className="hidden gap-5 sm:grid-cols-2 md:grid lg:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.title}
              data-mobile-card="info"
              className="reveal relative rounded-2xl border border-rose-tint bg-blush p-5 shadow-soft md:bg-white md:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-rose-tint text-primary md:size-12">
                  <s.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="font-heading text-3xl font-semibold text-primary/75">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-base text-muted-foreground md:text-sm">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
