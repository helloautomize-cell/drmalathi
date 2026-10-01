import { ScanFinder } from "@/components/home/scan-finder";
import { BrandImage } from "@/components/shared/brand-image";
import { Container } from "@/components/shared/container";

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

      <Container className="relative grid gap-8 pt-10 pb-12 lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-end lg:gap-12 lg:pt-14 lg:pb-0">
        <div className="lg:pb-14">
          <p className="mb-3 text-xs font-bold tracking-[0.16em] text-white/80 uppercase sm:text-sm">
            Specialist fetal medicine centre
          </p>
          <h1 className="text-display font-heading text-white">
            Advanced fetal medicine care in Trichy
          </h1>
          <p className="mt-4 max-w-lg text-base text-white/85 sm:text-lg">
            13 years of specialist scans, diagnostics and genetic counselling
            for families across south Tamil Nadu.
          </p>
          <div className="mt-7">
            <ScanFinder />
          </div>
        </div>

        <div className="relative -mx-4 sm:mx-0 lg:self-end">
          <BrandImage
            slug="family-cutout"
            variant="bleed"
            priority
            reveal={false}
            sizes="(min-width: 1280px) 448px, (min-width: 1024px) 416px, (min-width: 640px) 384px, 100vw"
            className="relative mx-auto w-full max-w-sm lg:max-w-[26rem] xl:max-w-md"
          />
        </div>
      </Container>
    </section>
  );
}
