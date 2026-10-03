"use client";

import { Baby, CalendarCheck, Phone, ScanLine, ShieldCheck } from "lucide-react";
import { ImageTile, InfoCard, ListRow, PlumCard } from "@/components/cards/mobile-cards";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { MobileSectionHeader } from "@/components/shared/mobile-section-header";
import { SectionShell } from "@/components/shared/section-shell";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MobileShowcase() {
  const cards = [
    <InfoCard key="one" icon={ShieldCheck} title="Specialist-led care" surface="white">
      Clear explanations and a plan you can understand.
    </InfoCard>,
    <InfoCard key="two" icon={Baby} title="Care for every stage" surface="white">
      The right scan or consultation for your pregnancy.
    </InfoCard>,
    <InfoCard key="three" icon={ScanLine} title="Reports explained" surface="white">
      Findings are discussed with you before you leave.
    </InfoCard>,
  ];

  return (
    <Tabs defaultValue="mobile" className="md:hidden">
      <div className="sticky top-[60px] z-30 border-b border-rose-tint bg-white px-4 py-3">
        <TabsList className="h-11 w-full rounded-full bg-blush p-1">
          <TabsTrigger value="mobile" className="rounded-full text-base">Mobile</TabsTrigger>
          <TabsTrigger value="foundations" className="rounded-full text-base">Foundations</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="mobile">
        <SectionShell surface="white">
          <div className="px-4">
            <MobileSectionHeader eyebrow="Mobile system" title="A calm, continuous story" subline="Shared spacing, surfaces, cards and actions for every page." level="h1" />
            <div className="grid grid-cols-4 gap-3 text-center text-[13px]/[20px] text-ink-muted">
              {["16 gutter", "48 section", "12 gap", "20 card"].map((item) => (
                <div key={item} className="rounded-xl bg-blush p-3">{item}</div>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell surface="blush">
          <div className="px-4">
            <MobileSectionHeader eyebrow="Type" title="Clear at every size" subline="Balanced headings and readable body copy." />
            <div className="space-y-4 rounded-2xl border border-rose-tint bg-white p-5">
              <h1>Heading one</h1>
              <h2>Heading two</h2>
              <h3>Heading three</h3>
              <p>Body copy is always comfortable to read on a phone.</p>
              <p className="text-sm/[20px] text-ink-muted">Small text and metadata</p>
            </div>
          </div>
        </SectionShell>

        <SectionShell surface="white">
          <div className="px-4">
            <MobileSectionHeader eyebrow="Surfaces" title="White, blush, plum" />
            <div className="grid gap-3">
              <div className="rounded-2xl border border-rose-tint bg-white p-5">White</div>
              <div className="rounded-2xl border border-rose-tint bg-blush p-5">Blush</div>
              <div className="rounded-2xl bg-plum p-5 text-white">Plum</div>
            </div>
          </div>
        </SectionShell>

        <SectionShell surface="blush">
          <div className="px-4">
            <MobileSectionHeader eyebrow="Cards" title="Four reusable card types" />
            <div className="space-y-3">
              <ImageTile
                src="/images/services/NIPT.webp"
                alt="NIPT blood test consultation"
                icon={ScanLine}
                tone="blood"
                chip="From 10 weeks"
                title="NIPT"
                description="A screening blood test explained clearly."
                href="/services/nipt"
              />
              <InfoCard icon={ShieldCheck} title="InfoCard" surface="white" href="/about">
                One focused idea, one short explanation and one next link.
              </InfoCard>
              <div className="overflow-hidden rounded-2xl border border-rose-tint bg-white px-4">
                <ListRow label="ListRow" meta="Meta" href="/services" />
                <ListRow label="Another destination" href="/contact" />
              </div>
              <PlumCard title="PlumCard">
                Reserved for a focused call to action or information for doctors.
              </PlumCard>
            </div>
          </div>
        </SectionShell>

        <SectionShell surface="white">
          <div className="px-4">
            <MobileSectionHeader eyebrow="Actions" title="One clear next step" />
            <div className="space-y-3">
              <Button size="lg">Book appointment</Button>
              <Button size="lg" variant="outline">View all</Button>
              <a href="/about" className="inline-flex items-center font-semibold text-primary">Learn more</a>
            </div>
          </div>
        </SectionShell>

        <SectionShell surface="blush">
          <div className="px-4">
            <MobileSectionHeader eyebrow="Carousel" title="A gentle horizontal rhythm" />
            <MobileCarousel label="Example cards" items={cards} />
          </div>
        </SectionShell>

        <SectionShell surface="white">
          <div className="px-4">
            <MobileSectionHeader eyebrow="Shell" title="Menu and bottom sheet" />
            <div className="grid gap-3">
              <Sheet>
                <SheetTrigger render={<Button size="lg" variant="outline" />}>Open menu example</SheetTrigger>
                <SheetContent side="right" mobileSide="right" className="w-full gap-0 p-0 sm:max-w-sm">
                  <SheetHeader className="border-b border-rose-tint">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="px-4">
                    <ListRow label="About" href="/about" />
                    <ListRow label="Services" href="/services" current />
                    <ListRow label="Contact" href="/contact" />
                  </nav>
                </SheetContent>
              </Sheet>
              <Sheet>
                <SheetTrigger render={<Button size="lg" />}>Open bottom sheet</SheetTrigger>
                <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Book appointment</SheetTitle>
                    <SheetDescription>Mobile sheets keep the next action close and clear.</SheetDescription>
                  </SheetHeader>
                  <div className="p-5">
                    <Button size="lg">Continue</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-rose-tint bg-white shadow-soft">
              <span className="flex h-16 flex-col items-center justify-center text-[13px]/[20px] font-semibold"><Phone className="size-5" />Call</span>
              <span className="flex h-16 flex-col items-center justify-center text-[13px]/[20px] font-semibold"><WhatsAppIcon className="size-5" />WhatsApp</span>
              <span className="flex h-16 flex-col items-center justify-center bg-primary text-[13px]/[20px] font-semibold text-white"><CalendarCheck className="size-5" />Book</span>
            </div>
          </div>
        </SectionShell>
      </TabsContent>

      <TabsContent value="foundations">
        <SectionShell surface="white">
          <div className="px-4">
            <MobileSectionHeader eyebrow="Foundations" title="Responsive by default" subline="The mobile layer ends at 767px. Existing desktop layouts begin at 768px." />
          </div>
        </SectionShell>
      </TabsContent>
    </Tabs>
  );
}
