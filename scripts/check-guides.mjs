#!/usr/bin/env node
/**
 * Editorial check for guide content. Fails if data/guides.ts contains an
 * em dash or en dash, or any PCPNDT-banned phrase defined in
 * lib/content-rules.ts. Runs as `npm run check:guides` and via `prebuild`.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const guidesSrc = readFileSync(join(root, "data/guides.ts"), "utf8");
const rulesSrc = readFileSync(join(root, "lib/content-rules.ts"), "utf8");

// Pull the phrase list out of BANNED_PHRASES so the script and the app share
// a single source of truth.
const phraseBlock = rulesSrc.match(/BANNED_PHRASES\s*=\s*\[([\s\S]*?)\]/);
const phrases = phraseBlock
  ? [...phraseBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
  : [];

const failures = [];

if (/[—–]/.test(guidesSrc)) {
  failures.push(
    'data/guides.ts contains an em dash or en dash; replace it with a comma or "to".'
  );
}

const lower = guidesSrc.toLowerCase();
for (const phrase of phrases) {
  if (lower.includes(phrase)) {
    failures.push(`data/guides.ts contains banned phrase "${phrase}" (PCPNDT).`);
  }
}

if (failures.length) {
  console.error("Guide content check failed:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `Guide content check passed (${phrases.length} phrases + dash rules, 0 violations).`
);
