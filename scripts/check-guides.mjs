#!/usr/bin/env node
/**
 * Editorial check for guide content. Fails if the guide data files contain
 * an em dash or en dash, or any PCPNDT-banned phrase defined in
 * lib/content-rules.ts. Banned phrases are allowed on lines that state a
 * legal prohibition, matching scripts/check-content.mjs. Runs as
 * `npm run check:guides` and via `prebuild`.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const guideFiles = ["data/guides.ts", "data/guides-blogs.ts"];
const rulesSrc = readFileSync(join(root, "lib/content-rules.ts"), "utf8");

// Pull the phrase list out of BANNED_PHRASES so the script and the app share
// a single source of truth.
const phraseBlock = rulesSrc.match(/BANNED_PHRASES\s*=\s*\[([\s\S]*?)\]/);
const phrases = phraseBlock
  ? [...phraseBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
  : [];

// Banned phrases are allowed where the same line states a legal prohibition.
const LEGAL_CONTEXT =
  /\b(prohibit|illegal|unlawful|offence|punishable|banned|\bact\b|law|never|not (?:offer|perform|do)|cannot|can't)\b/i;

// AI-generation fingerprints that must never ship in guide copy.
const FINGERPRINTS = [
  { name: "utm_ tracking parameter", re: /utm_[a-z]+=/i },
  { name: "chatgpt.com", re: /chatgpt\.com/i },
  { name: "oaicite", re: /oaicite/i },
  { name: "contentReference", re: /contentreference/i },
  { name: "turn0 citation marker", re: /turn0/i },
  { name: "【】 citation bracket", re: /[【】]/ },
];

// Fields rendered as plain text: markdown link syntax would show raw to the
// reader. Paragraphs, list items, callouts, table cells, quick answers, key
// takeaways and FAQ answers go through renderInline, so links there are fine.
const PLAIN_FIELDS = [
  "title",
  "cardTitle",
  "excerpt",
  "question",
  "alt",
  "caption",
];
const PLAIN_BLOCK_TYPES = new Set(["h2", "h3", "quote", "image"]);

function* plainStrings(guide) {
  for (const f of PLAIN_FIELDS) {
    if (typeof guide[f] === "string") yield [`guide.${f}`, guide[f]];
  }
  if (guide.seo) {
    for (const f of ["title", "description"]) {
      if (typeof guide.seo[f] === "string")
        yield [`guide.seo.${f}`, guide.seo[f]];
    }
  }
  if (guide.coverImage) {
    for (const f of ["alt", "caption"]) {
      if (typeof guide.coverImage[f] === "string")
        yield [`guide.coverImage.${f}`, guide.coverImage[f]];
    }
  }
  for (const [i, b] of (guide.content ?? []).entries()) {
    if (PLAIN_BLOCK_TYPES.has(b.type)) {
      for (const f of ["text", "alt", "caption"]) {
        if (typeof b[f] === "string")
          yield [`content[${i}].${f}`, b[f]];
      }
    }
  }
  for (const [i, s] of (guide.sources ?? []).entries()) {
    for (const f of ["title", "publisher"]) {
      if (typeof s[f] === "string") yield [`sources[${i}].${f}`, s[f]];
    }
  }
}

const failures = [];

for (const rel of guideFiles) {
  const src = readFileSync(join(root, rel), "utf8");

  if (/[—–]/.test(src)) {
    failures.push(
      `${rel} contains an em dash or en dash; replace it with a comma or "to".`
    );
  }

  for (const { name, re } of FINGERPRINTS) {
    if (re.test(src)) {
      failures.push(`${rel} contains an AI fingerprint: ${name}.`);
    }
  }

  // Raw markdown links in plain-text fields (parsed from the JSON literal).
  const jsonMatch = src.match(/=\s*(\[[\s\S]*\]);?\s*$/);
  if (jsonMatch) {
    let guides;
    try {
      guides = JSON.parse(jsonMatch[1]);
    } catch {
      guides = null;
    }
    if (Array.isArray(guides)) {
      for (const g of guides) {
        for (const [path, value] of plainStrings(g)) {
          if (/\]\(/.test(value)) {
            failures.push(
              `${rel}: ${g.slug ?? "?"} ${path} contains raw markdown link syntax.`
            );
          }
        }
      }
    }
  }


  for (const [i, line] of src.split("\n").entries()) {
    const lower = line.toLowerCase();
    for (const phrase of phrases) {
      if (lower.includes(phrase) && !LEGAL_CONTEXT.test(line)) {
        failures.push(
          `${rel}:${i + 1} contains banned phrase "${phrase}" (PCPNDT).`
        );
      }
    }
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
