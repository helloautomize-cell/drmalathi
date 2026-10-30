import { getImageProps } from "next/image";
import Link from "next/link";
import { firsts } from "@/components/home/firsts-strip";
import { ScanFinder } from "@/components/home/scan-finder";
import { BookingCta } from "@/components/booking/booking-sheet";
import { Container } from "@/components/shared/container";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { Button } from "@/components/ui/button";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import { foundedYear, yearsOfCare } from "@/lib/site";

const heroImage = {
  src: "/images/brand/family-cutout-1024.webp",
  alt: "Parents cradling their sleeping newborn",
};

/**
 * LCP image. One <img> serves both frames: the <source> swaps the srcset
 * below md so exactly one candidate downloads (art direction via
 * getImageProps). Eager + fetchPriority=high restores preload-speed
 * discovery without emitting a second preload for the hidden frame variant.
 */
function HeroImage() {
  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({
    ...heroImage,
    fill: true,
    sizes: "(max-width: 767px) calc(100vw - 2rem)",
  });
  const { props: desktopProps } = getImageProps({
    ...heroImage,
    width: 1024,
    height: 1536,
    sizes:
      "(min-width: 1280px) 448px, (min-width: 1024px) 416px, (min-width: 640px) 384px, 100vw",
  });
  const { srcSet: desktopSrcSet, ...imgProps } = desktopProps;
  return (
    <picture>
      <source
        media="(max-width: 767px)"
        srcSet={mobileSrcSet}
        sizes="(max-width: 767px) calc(100vw - 2rem)"
      />
      <img
        {...imgProps}
        srcSet={desktopSrcSet}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[50%_32%] md:static md:h-auto"
        style={{
          color: "transparent",
          backgroundImage: `url("${imageBlurDataURL}")`,
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
        }}
      />
    </picture>
  );
}

export function Hero() {
  return (
    <section
      data-section-shell
      data-surface="plum"
      data-ga-location="hero"
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

      <Container className="relative grid gap-8 pt-6 pb-10 md:pt-10 md:pb-12 lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-center lg:gap-12 lg:py-14">
        <div className="max-lg:contents">
          <div className="max-lg:order-1">
            <p data-eyebrow className="mb-3 text-xs font-bold tracking-[0.16em] text-white/80 uppercase sm:text-sm">
              Fetal medicine specialists in Trichy
            </p>
            <h1 className="text-display font-heading text-balance text-white max-md:text-[34px]/[40px]">
              Specialist care for your baby, before birth
            </h1>
            <p className="mt-4 text-base/[26px] text-pretty text-white/85 md:hidden">
              Specialist scans, diagnostics and genetic counselling in Trichy
              since {foundedYear}.
            </p>
            <p className="mt-4 hidden max-w-lg text-base text-white/85 md:block sm:text-lg">
              {yearsOfCare()} years of specialist scans, diagnostics and genetic
              counselling for families across south Tamil Nadu.
            </p>
            <div className="mt-6 hidden flex-wrap items-center gap-3 md:flex">
              <BookingCta
                source="hero"
                label="Book appointment"
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
          </div>
          <div className="max-lg:order-3 lg:mt-7">
            <ScanFinder />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md max-lg:order-2 lg:max-w-[26rem] xl:max-w-md">
          {/* Mobile: 4/3 white panel with 120px arch; md+: 10rem arch frame. */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-[120px] rounded-b-3xl bg-white shadow-card md:aspect-auto md:rounded-t-[10rem]">
            {/* Raw asset, no image pipeline treatment (user request) */}
            <HeroImage />
          </div>
        </div>

        {/* Mobile trust carousel: the three regional firsts on plum. */}
        <MobileCarousel
          label="Regional firsts"
          className="max-md:order-4 md:hidden"
          items={firsts.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/10 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-rose-tint">
                  <item.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="rounded-full border border-white/30 px-3 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
                  {item.pill}
                </span>
              </div>
              <h3 className="mt-4 text-[19px]/[26px] font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm/[20px] text-pretty text-white/75">
                {item.description}
              </p>
            </article>
          ))}
        />
      </Container>
    </section>
  );
}
