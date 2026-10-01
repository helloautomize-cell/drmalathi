// Generates responsive AVIF + WebP variants and blur placeholders for the
// brand image manifest (data/image-sources.json -> public/images/brand/).
// Usage: npm run process:images
//
// LICENSING: source files are unlicensed placeholders. Recipes must never
// remove, blur, paint out or deliberately crop to hide watermarks/credits.

import { existsSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const OUT_DIR = join(ROOT, "public", "images", "brand");
const GEN_PATH = join(ROOT, "data", "images.generated.json");
const TARGET_WIDTHS = [480, 768, 1080];

const sources = JSON.parse(
  await import("node:fs").then((fs) =>
    fs.readFileSync(join(ROOT, "data", "image-sources.json"), "utf8")
  )
);

// ---------- recipe helpers (raw pixel passes) ----------

function clamp(v) {
  return v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
}

// AIRY: clamp near-whites to pure white so mix-blend-multiply disappears
// on blush/white sections. Leaves mid-tones and skin untouched.
function recipeAiry(buf, channels) {
  for (let i = 0; i < buf.length; i += channels) {
    if (buf[i] >= 242 && buf[i + 1] >= 242 && buf[i + 2] >= 242) {
      buf[i] = buf[i + 1] = buf[i + 2] = 255;
    }
  }
  return buf;
}

// WARM CREAM: saturation -5%, gentle warm shift, lifted shadows, and a nudge
// of bright backgrounds toward blush cream (#FAF3EF). Max hue shift ~3 deg.
function recipeWarmCream(buf, channels) {
  const cream = [250, 243, 239];
  for (let i = 0; i < buf.length; i += channels) {
    let [r, g, b] = [buf[i], buf[i + 1], buf[i + 2]];
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    // desaturate 5%
    r = luma + (r - luma) * 0.95;
    g = luma + (g - luma) * 0.95;
    b = luma + (b - luma) * 0.95;
    // warm shift
    r += 6;
    b -= 5;
    // lifted shadows (soft toe)
    r = r * 0.96 + 10;
    g = g * 0.96 + 10;
    b = b * 0.96 + 10;
    // nudge near-white background toward blush cream
    const l2 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (l2 > 235) {
      const t = Math.min(0.5, (l2 - 235) / 40);
      r = r + (cream[0] - r) * t;
      g = g + (cream[1] - g) * t;
      b = b + (cream[2] - b) * t;
    }
    buf[i] = clamp(r);
    buf[i + 1] = clamp(g);
    buf[i + 2] = clamp(b);
  }
  return buf;
}

// PLUM DUOTONE: grayscale, contrast +8%, then gradient map
// #1E0715 -> #3D0F2A -> #E080A0 -> #FBE1EA
const DUOTONE_STOPS = [
  { t: 0, rgb: [30, 7, 21] },
  { t: 0.35, rgb: [61, 15, 42] },
  { t: 0.7, rgb: [224, 128, 160] },
  { t: 1, rgb: [251, 225, 234] },
];

function gradientMap(luma) {
  const t = luma / 255;
  let a = DUOTONE_STOPS[0], b = DUOTONE_STOPS[DUOTONE_STOPS.length - 1];
  for (let i = 0; i < DUOTONE_STOPS.length - 1; i++) {
    if (t >= DUOTONE_STOPS[i].t && t <= DUOTONE_STOPS[i + 1].t) {
      a = DUOTONE_STOPS[i];
      b = DUOTONE_STOPS[i + 1];
      break;
    }
  }
  const f = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
  return [
    a.rgb[0] + (b.rgb[0] - a.rgb[0]) * f,
    a.rgb[1] + (b.rgb[1] - a.rgb[1]) * f,
    a.rgb[2] + (b.rgb[2] - a.rgb[2]) * f,
  ];
}

function recipePlumDuotone(buf, channels) {
  for (let i = 0; i < buf.length; i += channels) {
    const luma = 0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2];
    // contrast +8% around midpoint
    const c = 128 + (luma - 128) * 1.08;
    const [r, g, b] = gradientMap(clamp(c));
    buf[i] = clamp(r);
    buf[i + 1] = clamp(g);
    buf[i + 2] = clamp(b);
  }
  return buf;
}

const RECIPES = {
  airy: recipeAiry,
  "warm-cream": recipeWarmCream,
  "plum-duotone": recipePlumDuotone,
  neutral: (buf) => buf,
};

// CUTOUT: recover alpha from a baked-in checkerboard/white background via
// border flood-fill, so subject interiors (white clothing) stay opaque.
async function keyOutBackground(pipeline) {
  const { data, info } = await pipeline
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const isBg = (i) => {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    return Math.max(r, g, b) > 228 && Math.max(r, g, b) - Math.min(r, g, b) < 18;
  };

  const alpha = new Uint8Array(W * H).fill(255);
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    if (!isBg(p * 4)) continue;
    alpha[p] = 0;
    const x = p % W;
    const y = (p - x) / W;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - W);
    if (y < H - 1) stack.push(p + W);
  }

  // Feather: semi-transparency on edge pixels that are still near-background.
  for (let p = 0; p < W * H; p++) {
    if (alpha[p] !== 0) continue;
    const x = p % W;
    const y = (p - x) / W;
    const nbs = [
      x > 0 ? p - 1 : -1,
      x < W - 1 ? p + 1 : -1,
      y > 0 ? p - W : -1,
      y < H - 1 ? p + W : -1,
    ];
    for (const q of nbs) {
      if (q >= 0 && alpha[q] === 255 && isBg(q * 4)) alpha[q] = 140;
    }
  }

  // Despeckle: drop opaque islands too small to be the subject (keyed
  // background noise). The family is one connected mass; keep every
  // component >= 0.4% of the image, discard the rest.
  // Label at >=200 so feathered (140) pixels can't bridge specks to the
  // subject — small islands then get dropped.
  const comp = new Int32Array(W * H).fill(-1);
  const sizes = [];
  for (let p = 0; p < W * H; p++) {
    if (alpha[p] < 200 || comp[p] !== -1) continue;
    const id = sizes.length;
    const q = [p];
    comp[p] = id;
    let size = 0;
    while (q.length) {
      const c = q.pop();
      size++;
      const x = c % W;
      const y = (c - x) / W;
      const nbs = [
        x > 0 ? c - 1 : -1,
        x < W - 1 ? c + 1 : -1,
        y > 0 ? c - W : -1,
        y < H - 1 ? c + W : -1,
      ];
      for (const n of nbs) {
        if (n >= 0 && alpha[n] >= 200 && comp[n] === -1) {
          comp[n] = id;
          q.push(n);
        }
      }
    }
    sizes.push(size);
  }
  const minSize = Math.max(64, Math.round(W * H * 0.004));
  for (let p = 0; p < W * H; p++) {
    if (alpha[p] > 0 && (comp[p] === -1 || sizes[comp[p]] < minSize)) {
      alpha[p] = 0;
    }
  }

  for (let i = 0; i < W * H; i++) data[i * 4 + 3] = alpha[i];
  return { data, info };
}

// ---------- pipeline ----------

mkdirSync(OUT_DIR, { recursive: true });
const generated = {};
const warnings = [];

for (const [slug, cfg] of Object.entries(sources)) {
  if (cfg.parked) {
    console.log(`SKIP  ${slug} (parked: ${cfg.parkedNote ?? "no note"})`);
    continue;
  }
  const srcPath = join(ROOT, cfg.source);
  if (!existsSync(srcPath)) {
    console.error(`MISSING source for ${slug}: ${cfg.source}`);
    process.exitCode = 1;
    continue;
  }

  let pipeline = sharp(srcPath).rotate();
  const meta = await pipeline.metadata();
  let srcW = meta.width;
  let srcH = meta.height;

  if (cfg.crop?.leftPercent) {
    const left = Math.round((cfg.crop.leftPercent / 100) * srcW);
    pipeline = pipeline.extract({
      left,
      top: 0,
      width: srcW - left,
      height: srcH,
    });
    srcW -= left;
  }

  const isCutout = cfg.recipe === "cutout";
  const recipe = RECIPES[cfg.recipe];
  if (!isCutout && !recipe) {
    console.error(`UNKNOWN recipe "${cfg.recipe}" for ${slug}`);
    process.exitCode = 1;
    continue;
  }

  // Apply recipe as a raw pixel pass at source resolution.
  const { data, info } = isCutout
    ? await keyOutBackground(pipeline)
    : await pipeline.raw().toBuffer({ resolveWithObject: true });
  const treated = isCutout ? data : recipe(data, info.channels);
  const base = sharp(treated, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  });

  const widths = TARGET_WIDTHS.filter((w) => w <= srcW);
  if (widths.length === 0 || widths[widths.length - 1] < srcW) {
    widths.push(srcW);
  }
  const displayCap = Math.floor(srcW / 1.3);
  if (displayCap < 300) {
    warnings.push(
      `${slug}: source is only ${srcW}px wide — never display above ${displayCap}px`
    );
  }

  const files = { avif: {}, webp: {} };
  for (const w of widths) {
    const h = Math.round((srcH * w) / srcW);
    const avifPath = join(OUT_DIR, `${slug}-${w}.avif`);
    const webpPath = join(OUT_DIR, `${slug}-${w}.webp`);
    await base.clone().resize(w, h).avif({ quality: 50 }).toFile(avifPath);
    await base.clone().resize(w, h).webp({ quality: 74 }).toFile(webpPath);
    files.avif[w] = statSync(avifPath).size;
    files.webp[w] = statSync(webpPath).size;
  }

  const blurBuf = await base
    .clone()
    .resize(16, Math.max(1, Math.round((srcH * 16) / srcW)))
    .webp({ quality: 25 })
    .toBuffer();
  const blur = `data:image/webp;base64,${blurBuf.toString("base64")}`;

  generated[slug] = {
    width: srcW,
    height: srcH,
    widths,
    maxDisplayWidth: displayCap,
    hasAlpha: isCutout || Boolean(meta.hasAlpha),
    blur,
    bytes: files,
  };
  console.log(
    `OK    ${slug} ${srcW}x${srcH} [${cfg.recipe}] -> widths ${widths.join(", ")}`
  );
}

writeFileSync(GEN_PATH, JSON.stringify(generated, null, 2) + "\n");
console.log(`\nWrote ${basename(GEN_PATH)}`);
for (const w of warnings) console.warn(`WARN  ${w}`);
if (process.exitCode) process.exit(process.exitCode);
