// One-off: Dr Shriharini's portrait cut out (rembg/u2net, run once into
// .tmp-check) and exported at 640x800 (4:5) as WebP + AVIF + PNG, matching
// the other doctor portraits. The kurta's ivory base is the same colour
// range as the mottled backdrop, so chroma keying cannot separate them.
// Usage: node scripts/make-shriharini-cutout.mjs
// Re-matte: python -c "from rembg import remove; from PIL import Image; \
//   remove(Image.open('assets/source-images/doctors/shriharini-kurta-cutout.png'))\
//   .save('.tmp-check/shriharini-rembg.png')"

import { existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const SRC = join(ROOT, "assets", "source-images", "doctors", "shriharini-kurta-cutout.png");
const MATTED = join(ROOT, ".tmp-check", "shriharini-rembg.png");
const OUT_DIR = join(ROOT, "public", "images", "doctors");
const TARGET_W = 640;
const TARGET_H = 800; // 4:5, same as the other portraits

if (!existsSync(MATTED)) {
  mkdirSync(join(ROOT, ".tmp-check"), { recursive: true });
  execFileSync("python", [
    "-c",
    `from rembg import remove; from PIL import Image; remove(Image.open(r"${SRC}")).save(r"${MATTED}")`,
  ]);
}

// Slightly zoom the subject out (transparent pad, top + sides) so the head
// size and position match the other portraits; bust stays on the bottom edge.
const meta = await sharp(MATTED).metadata();
const PAD_X = 140;
const PAD_TOP = 160;
const paddedW = meta.width + PAD_X;
const paddedH = meta.height + PAD_TOP;
const padded = await sharp(MATTED)
  .extend({
    top: PAD_TOP,
    bottom: 0,
    left: Math.floor(PAD_X / 2),
    right: Math.ceil(PAD_X / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .toBuffer();

const cropW = Math.min(paddedW, Math.round(paddedH * (TARGET_W / TARGET_H)));
const left = Math.round((paddedW - cropW) / 2);
const base = sharp(padded).extract({ left, top: 0, width: cropW, height: paddedH });

await base.clone().resize(TARGET_W, TARGET_H)
  .webp({ quality: 75, alphaQuality: 60, effort: 6, smartSubsample: true })
  .toFile(join(OUT_DIR, "shriharini-cutout.webp"));
await base.clone().resize(TARGET_W, TARGET_H)
  .avif({ quality: 50 })
  .toFile(join(OUT_DIR, "shriharini-cutout.avif"));
await base.clone().resize(TARGET_W, TARGET_H)
  .png()
  .toFile(join(OUT_DIR, "shriharini-cutout.png"));

for (const ext of ["webp", "avif", "png"]) {
  const f = join(OUT_DIR, `dr-shriharini-sg.${ext}`);
  console.log(`OK  ${f} ${(statSync(f).size / 1024).toFixed(1)}KB`);
}
