import generated from "./images.generated.json";
import sourceConfig from "./image-sources.json";

/**
 * Single manifest for swappable brand imagery.
 *
 * - `source` files live in /assets/source-images (never served directly).
 * - Run `npm run process:images` to regenerate variants in /public/images/brand.
 * - `license: "placeholder"` = unlicensed temp art. LICENSE REQUIRED before
 *   launch; replace the source file, set `licenseSource` to record where the
 *   licence came from (stock site + asset ID, or photographer name and date),
 *   flip `license` to "licensed", re-run the script.
 * - Never crop, blur or paint over embedded watermarks/credits.
 */

export type ImageRecipe =
  | "airy"
  | "warm-cream"
  | "plum-duotone"
  | "neutral"
  | "cutout";
export type ImageLicense = "placeholder" | "licensed";

export type BrandImageSlug =
  | "hands-baby-feet"
  | "baby-overhead"
  | "pregnancy-test-stork"
  | "doctor-glowing-fetus"
  | "family-bw-newborn"
  | "family-airy-newborn"
  | "family-cutout"
  | "doctor-malathi"
  | "doctor-revathy"
  | "doctor-nivethitha"
  | "icsi-illustration";

type Focal = { x: number; y: number }; // 0-100, percent position for object-position

type Editorial = {
  alt: string;
  focal: Focal;
};

const EDITORIAL: Record<BrandImageSlug, Editorial> = {
  "hands-baby-feet": {
    alt: "Newborn baby's feet held gently in a parent's cupped hands",
    focal: { x: 50, y: 60 },
  },
  "baby-overhead": {
    alt: "Baby in a nappy photographed from above on a cream blanket",
    focal: { x: 50, y: 50 },
  },
  "pregnancy-test-stork": {
    alt: "Hand holding a positive pregnancy test with a stork perched on it",
    focal: { x: 38, y: 42 },
  },
  "doctor-glowing-fetus": {
    alt: "Doctor's hands cradling a softly glowing image of a developing baby",
    focal: { x: 50, y: 50 },
  },
  "family-bw-newborn": {
    alt: "New parents holding their newborn close in a quiet portrait",
    focal: { x: 50, y: 45 },
  },
  "family-airy-newborn": {
    alt: "Mother and father cradling their sleeping newborn against a white backdrop",
    focal: { x: 55, y: 45 },
  },
  "family-cutout": {
    alt: "Parents cradling their sleeping newborn",
    focal: { x: 50, y: 50 },
  },
  "doctor-malathi": {
    alt: "Dr Malathi G. Prasad, Lead Consultant in Fetal Medicine",
    focal: { x: 50, y: 15 },
  },
  "doctor-revathy": {
    alt: "Dr Revathy Chandrasekharan, maternal-fetal medicine specialist",
    focal: { x: 50, y: 40 },
  },
  "doctor-nivethitha": {
    alt: "Dr Nivethitha, fetal medicine specialist",
    focal: { x: 50, y: 40 },
  },
  "icsi-illustration": {
    alt: "Illustration of an ICSI fertility procedure",
    focal: { x: 50, y: 50 },
  },
};

type GeneratedEntry = {
  width: number;
  height: number;
  widths: number[];
  maxDisplayWidth: number;
  hasAlpha?: boolean;
  blur: string;
  bytes: { avif: Record<string, number>; webp: Record<string, number> };
};

type SourceEntry = {
  source: string;
  recipe: ImageRecipe;
  license: ImageLicense;
  /** Where the licence came from (stock site + asset ID, or photographer). */
  licenseSource?: string;
  /** Free-text licence terms/note, e.g. "Standard licence, web use OK". */
  licenseNote?: string;
  parked?: boolean;
  parkedNote?: string;
  creditNote?: string;
  crop?: {
    leftPercent?: number;
    rectPercent?: { left: number; top: number; width: number; height: number };
  };
};

const sources = sourceConfig as Record<BrandImageSlug, SourceEntry>;
const gen = generated as Partial<Record<BrandImageSlug, GeneratedEntry>>;

export type BrandImage = {
  slug: BrandImageSlug;
  alt: string;
  focal: Focal;
  recipe: ImageRecipe;
  license: ImageLicense;
  parked: boolean;
  parkedNote?: string;
  /** Largest generated width; never display wider than maxDisplayWidth. */
  width: number;
  height: number;
  /** Generated widths available (<= source width). */
  widths: number[];
  /** Hard cap: source width / 1.3, to respect low-res sources. */
  maxDisplayWidth: number;
  /** True when the asset carries transparency (blur placeholder skipped). */
  hasAlpha: boolean;
  blur: string;
  src: string; // largest webp
  srcSetAvif: string;
  srcSetWebp: string;
};

function buildEntry(slug: BrandImageSlug): BrandImage {
  const src = sources[slug];
  const g = gen[slug];
  const ed = EDITORIAL[slug];
  const parked = Boolean(src.parked);
  const base = {
    slug,
    alt: ed.alt,
    focal: ed.focal,
    recipe: src.recipe,
    license: src.license,
    parked,
    parkedNote: src.parkedNote,
  };
  if (!g) {
    // Parked or unprocessed: render nothing until processed.
    return {
      ...base,
      width: 0,
      height: 0,
      widths: [],
      maxDisplayWidth: 0,
      hasAlpha: false,
      blur: "",
      src: "",
      srcSetAvif: "",
      srcSetWebp: "",
    };
  }
  const max = Math.max(...g.widths);
  const srcSet = (ext: "avif" | "webp") =>
    g.widths
      .map((w) => `/images/brand/${slug}-${w}.${ext} ${w}w`)
      .join(", ");
  return {
    ...base,
    width: g.width,
    height: g.height,
    widths: g.widths,
    maxDisplayWidth: g.maxDisplayWidth,
    hasAlpha: Boolean(g.hasAlpha),
    blur: g.blur,
    src: `/images/brand/${slug}-${max}.webp`,
    srcSetAvif: srcSet("avif"),
    srcSetWebp: srcSet("webp"),
  };
}

export const brandImages = Object.fromEntries(
  (Object.keys(sources) as BrandImageSlug[]).map((slug) => [
    slug,
    buildEntry(slug),
  ])
) as Record<BrandImageSlug, BrandImage>;

export function getBrandImage(slug: BrandImageSlug): BrandImage {
  return brandImages[slug];
}
