import { notFound } from "next/navigation";
import { Baby, BadgeCheck, Clock, HeartPulse, ShieldCheck } from "lucide-react";
import { MobileShowcase } from "@/components/design-system/mobile-showcase";
import { CTABand } from "@/components/cards/cta-band";
import { DoctorCard } from "@/components/cards/doctor-card";
import { FeatureCard } from "@/components/cards/feature-card";
import { ServiceCard } from "@/components/cards/service-card";
import { StatChip } from "@/components/cards/stat-chip";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { yearsOfCare } from "@/lib/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";

const colorTokens = [
  { name: "primary", hex: "#C02060", usage: "Buttons, links, key accents" },
  { name: "primary-hover", hex: "#98154C", usage: "Hover state for primary" },
  { name: "accent-bright", hex: "#E04080", usage: "Large text, icons, shapes only" },
  { name: "accent-soft", hex: "#E080A0", usage: "Decoration only" },
  { name: "plum", hex: "#3D0F2A", usage: "Headings, footer, focus ring" },
  { name: "ink", hex: "#2A2230", usage: "Body text" },
  { name: "ink-muted", hex: "#6B5A66", usage: "Muted body text" },
  { name: "teal", hex: "#177373", usage: "Secondary buttons, badges, info" },
  { name: "teal-tint", hex: "#E6F4F3", usage: "Teal backgrounds" },
  { name: "blush", hex: "#FFF3F7", usage: "Alternate section backgrounds" },
  { name: "rose-tint", hex: "#FBE1EA", usage: "Cards, borders, icon tiles" },
];

const typeScale = [
  { className: "text-display font-heading", label: "Display", sample: "Expert fetal care" },
  { className: "text-4xl font-heading", label: "H1", sample: "Expert fetal care" },
  { className: "text-3xl font-heading", label: "H2", sample: "Expert fetal care" },
  { className: "text-2xl font-heading", label: "H3", sample: "Expert fetal care" },
  { className: "text-xl font-heading", label: "H4", sample: "Expert fetal care" },
  { className: "text-base", label: "Body", sample: "Compassionate care for every family." },
  { className: "text-sm text-muted-foreground", label: "Small", sample: "Mon - Fri, 9 AM to 9 PM" },
];

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <>
      <MobileShowcase />
      <div className="hidden md:contents">
      <Section className="bg-blush">
        <Container>
          <SectionHeader
            eyebrow="Design System"
            level="h1"
            title="Tokens and components"
            subtitle="Internal reference page. Not indexed, not available in production builds."
            align="left"
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="mb-8 text-2xl font-semibold text-ink">Colors</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {colorTokens.map((token) => (
              <div
                key={token.name}
                className="overflow-hidden rounded-xl border border-border"
              >
                <div
                  className="h-20"
                  style={{ backgroundColor: token.hex }}
                  aria-hidden="true"
                />
                <div className="p-3">
                  <p className="font-mono text-sm font-semibold">{token.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {token.hex}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {token.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-blush">
        <Container>
          <h2 className="mb-8 text-2xl font-semibold text-ink">Typography</h2>
          <div className="space-y-6">
            {typeScale.map((item) => (
              <div key={item.label} className="flex items-baseline gap-6">
                <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
                  {item.label}
                </span>
                <p className={item.className}>{item.sample}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Headings: Fraunces. Body: Nunito Sans. Tamil fallback: Noto Sans
            Tamil (அறிவுரை).
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="mb-8 text-2xl font-semibold text-ink">Buttons</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button>Primary</Button>
            <Button className="bg-primary-hover text-white hover:bg-primary">
              Primary hover
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link style</Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
          <h3 className="mt-10 mb-4 text-xl font-semibold text-ink">Badges</h3>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge className="bg-teal-tint text-teal">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              Verified
            </Badge>
            <Badge className="bg-rose-tint text-primary">Rose</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Container>
      </Section>

      <Section className="bg-blush">
        <Container>
          <SectionHeader
            eyebrow="Cards"
            title="Core card components"
            subtitle="ServiceCard, DoctorCard, StatChip, FeatureCard, and TestimonialCard."
            align="left"
          />
          <div className="mb-6 flex flex-wrap gap-3">
            <StatChip icon={Clock} label={`${yearsOfCare()} years of fetal medicine`} />
            <StatChip icon={ShieldCheck} label="In-house genetic counselling" />
            <StatChip icon={HeartPulse} label="Specialist-led scans" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ServiceCard service={services[0]} />
            <DoctorCard doctor={doctors[0]} />
            <FeatureCard
              icon={Baby}
              title="Feature card"
              description="Used for the Why choose us section with a teal icon tile."
            />
            <TestimonialCard testimonial={testimonials[0]} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="mb-8 text-2xl font-semibold text-ink">Form elements</h2>
          <Card className="max-w-xl border-rose-tint">
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <Label htmlFor="ds-name">Name</Label>
                <Input id="ds-name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ds-doctor">Preferred doctor</Label>
                <Select>
                  <SelectTrigger id="ds-doctor" className="w-full">
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.slug} value={doctor.slug}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ds-message">Message</Label>
                <Textarea id="ds-message" placeholder="How can we help?" />
              </div>
              <div className="flex items-start gap-2.5">
                <Checkbox id="ds-consent" />
                <Label
                  htmlFor="ds-consent"
                  className="text-sm leading-snug font-normal text-muted-foreground"
                >
                  I consent to being contacted about my enquiry.
                </Label>
              </div>
            </CardContent>
          </Card>

          <h3 className="mt-10 mb-4 text-xl font-semibold text-ink">
            Accordion
          </h3>
          <div className="max-w-2xl">
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger>When is the anomaly scan done?</AccordionTrigger>
                <AccordionContent>
                  Usually between 18 and 22 weeks of pregnancy.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is ultrasound safe?</AccordionTrigger>
                <AccordionContent>
                  Yes, when performed by trained professionals following medical
                  guidelines.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <CTABand />
      </Section>
      </div>
    </>
  );
}
