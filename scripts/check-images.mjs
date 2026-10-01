// License gate for brand imagery.
//   npm run check:images                      -> lists placeholders, exits 0
//   REQUIRE_LICENSED_IMAGES=1 npm run check:images -> exits non-zero if any
//   image is still license:"placeholder" or parked (wire into deploy).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const sources = JSON.parse(
  readFileSync(join(ROOT, "data", "image-sources.json"), "utf8")
);
const generated = JSON.parse(
  readFileSync(join(ROOT, "data", "images.generated.json"), "utf8")
);

const placeholders = [];
const parked = [];

for (const [slug, cfg] of Object.entries(sources)) {
  if (cfg.parked) {
    parked.push(slug);
    continue;
  }
  const g = generated[slug];
  const kb = g
    ? Math.max(...Object.values(g.bytes?.avif ?? { 0: 0 })) / 1024
    : null;
  const status = cfg.license === "licensed" ? "LICENSED" : "PLACEHOLDER";
  console.log(
    `${status.padEnd(11)} ${slug.padEnd(24)} ${g ? `${g.width}x${g.height}` : "unprocessed"} ${kb ? `~${kb.toFixed(1)}KB avif` : ""}`
  );
  if (cfg.license !== "licensed") placeholders.push(slug);
}

if (parked.length) {
  console.log(`\nParked (never rendered): ${parked.join(", ")}`);
}

if (process.env.REQUIRE_LICENSED_IMAGES === "1" && placeholders.length) {
  console.error(
    `\nFAIL: ${placeholders.length} placeholder image(s) require licensing: ${placeholders.join(", ")}`
  );
  process.exit(1);
}
console.log(
  `\n${placeholders.length} placeholder(s) — LICENSE REQUIRED before launch.`
);
