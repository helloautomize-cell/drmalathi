import { MessageCircle, ScanSearch, Stethoscope } from "lucide-react";
import { BrandImage } from "@/components/shared/brand-image";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const benefits = [
  {
    icon: ScanSearch,
    title: "Earlier answers",
    description:
      "Specialist scans can identify concerns sooner in pregnancy, when there is more time and more options to plan care.",
  },
  {
    icon: Stethoscope,
    title: "Doctors who focus only on fetal medicine",
    description:
      "Your scan is performed and explained by specialists whose entire practice is the health of babies before birth.",
  },
  {
    icon: MessageCircle,
    title: "Counselling under one roof",
    description:
      "In-house genetic counselling means your questions are answered clearly, without being sent from place to place.",
  },
];

export function WhyFetalMedicine() {
  return (
    <Section>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <BrandImage
            slug="hands-baby-feet"
            variant="arch"
            ratio="4/5"
            sizes="(min-width: 1024px) 352px, 100vw"
            className="mx-auto w-full max-w-sm shadow-soft"
          />
          <div>
            <p className="mb-3 text-sm font-bold tracking-[0.14em] uppercase text-primary">
              Why it matters
            </p>
            <h2 className="text-3xl font-semibold text-ink md:text-4xl">
              Why see a fetal medicine specialist?
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Most pregnancies are healthy. When a closer look is needed,
              specialist care makes the difference.
            </p>
            <ul className="mt-8 space-y-6">
              {benefits.map((benefit) => (
                <li key={benefit.title} className="reveal flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-rose-tint text-primary">
                    <benefit.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground md:text-base">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
