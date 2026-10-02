import Image from "next/image";
import Link from "next/link";
import { ScanFinder } from "@/components/home/scan-finder";
import { BookingCta } from "@/components/booking/booking-sheet";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { yearsOfCare } from "@/lib/site";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(118deg, var(--color-plum) 0%, var(--color-primary-hover) 42%, var(--color-primary) 74%, var(--color-accent-bright) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -top-40 left-1/3 size-[28rem] rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-accent-soft/25 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative grid gap-8 pt-10 pb-12 lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-center lg:gap-12 lg:py-14">
        <div>
          <p className="mb-3 text-xs font-bold tracking-[0.16em] text-white/80 uppercase sm:text-sm">
            Fetal medicine specialists in Trichy
          </p>
          <h1 className="text-display font-heading text-white">
            Specialist care for your baby, before birth
          </h1>
          <p className="mt-4 max-w-lg text-base text-white/85 sm:text-lg">
            {yearsOfCare()} years of specialist scans, diagnostics and genetic
            counselling for families across south Tamil Nadu.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <BookingCta
              source="hero"
              label="Book a consultation"
              variant="light"
              size="lg"
            />
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              render={<Link href="/#services" />}
            >
              Explore our care
            </Button>
          </div>
          <div className="mt-7">
            <ScanFinder />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-[26rem] xl:max-w-md">
          <div className="overflow-hidden rounded-t-[10rem] rounded-b-3xl bg-white shadow-card">
            {/* Raw asset, no image pipeline treatment (user request) */}
            <Image
              src="/images/family-cutout.webp"
              alt="Parents in white cradling their sleeping newborn"
              width={1024}
              height={1536}
              priority
              sizes="(min-width: 1280px) 448px, (min-width: 1024px) 416px, (min-width: 640px) 384px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
