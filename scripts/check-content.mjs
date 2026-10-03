#!/usr/bin/env node
/**
 * Editorial check over all rendered copy, not just guides. Scans the
 * comment-stripped TypeScript source of app/, components/, data/ and lib/
 * for:
 *
 *   - em dashes / en dashes (lib/content-rules.ts BANNED_DASHES)
 *   - PCPNDT-banned phrases (BANNED_PHRASES), except inside legal
 *     prohibition wording such as "sex determination is prohibited"
 *   - invisible characters and unusual spaces (INVISIBLE_CHARS)
 *   - markers that must never render: PLACEHOLDER, TODO, DRAFT,
 *     "coming soon", lorem (MARKER_WORDS inside copy-like strings or JSX
 *     text only, so placeholder.svg, data-placeholder and Tailwind
 *     placeholder: classes are skipped)
 *
 * Counsel-pending items in KNOWN_PENDING print as warnings and do not
 * fail the build; check:launch still gates them for production deploys.
 *
 * Runs as `npm run check:content` and via `prebuild`.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rulesSrc = readFileSync(join(root, "lib/content-rules.ts"), "utf8");

const phrases = [
  ...(rulesSrc.match(/BANNED_PHRASES\s*=\s*\[([\s\S]*?)\]/)?.[1] ?? "").matchAll(
    /"([^"]+)"/g
  ),
].map((m) => m[1]);

const DASHES = /[—–]/;
const INVISIBLE =
  /[\u200B\u200C\u200D\u2060\uFEFF\u00AD\u00A0\u202F]/;
// Words that must be surrounded by copy-like boundaries to count as markers:
// whitespace/quotes/edges around them, and any trailing colon must be
// followed by whitespace ("PLACEHOLDER: text" flags; "placeholder:text" does
// not).
const MARKERS =
  /(?:^|[\s"'])(placeholder|todo|draft|coming soon|lorem)(?=$|[\s"',.!?]|:(?:\s|$))/i;
// Banned phrases are allowed where the same line states a legal prohibition.
const LEGAL_CONTEXT =
  /\b(prohibit|illegal|unlawful|offence|punishable|banned|\bact\b|law|never|not (?:offer|perform|do)|cannot|can't)\b/i;

// Counsel-pending rendered copy that stays until legal review returns.
const KNOWN_PENDING = [
  {
    file: "app/privacy/page.tsx",
    contains: "draft pending legal and client review",
    note: "B-02 privacy draft line, counsel review pending",
  },
  {
    file: "app/terms/page.tsx",
    contains: "draft pending legal and client review",
    note: "B-02 terms draft line, counsel review pending",
  },
  {
    file: "app/editorial-policy/page.tsx",
    contains: "draft pending legal and client review",
    note: "editorial policy draft line, counsel review pending",
  },
  {
    file: "app/accessibility/page.tsx",
    contains: "draft pending legal and client review",
    note: "accessibility statement draft line, counsel review pending",
  },
];

const SCAN_DIRS = ["app", "components", "data", "lib"];
const SKIP_FILES = new Set([
  "lib/content-rules.ts", // rule definitions themselves contain dashes
]);

function* walk(dir) {
  const abs = join(root, dir);
  if (!existsSync(abs)) return;
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      yield* walk(rel);
    } else {
      yield rel;
    }
  }
}

// Strip // and /* */ comments while respecting string literals.
function stripComments(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  let inString = null;
  while (i < n) {
    const c = src[i];
    const next = src[i + 1];
    if (inString) {
      if (c === "\\") {
        out += c + next;
        i += 2;
        continue;
      }
      out += c;
      i += 1;
      if (c === inString) inString = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inString = c;
      out += c;
      i += 1;
      continue;
    }
    if (c === "/" && next === "/") {
      while (i < n && src[i] !== "\n") i += 1;
      continue;
    }
    if (c === "/" && next === "*") {
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) {
        if (src[i] === "\n") out += "\n";
        i += 1;
      }
      i += 2;
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

// Segments that count as rendered copy: string literals (excluding
// code-like single tokens and Tailwind-style class lists) and JSX text.
// Runs on the whole stripped source so multi-line text is caught.
function copySegments(src) {
  const segments = [];
  const push = (inner, index) => {
    if (/^[\w\-./:@]+$/.test(inner)) return; // filenames, slugs, module paths
    if (!/\s/.test(inner) && !/[A-Z]/.test(inner)) return; // code tokens
    const tokens = inner.trim().split(/\s+/).filter(Boolean);
    if (
      tokens.length > 1 &&
      tokens.every((t) => /^!?[\w\-./:%()[\]@#]+$/.test(t)) &&
      tokens.some((t) => /[:[\]-]/.test(t))
    ) {
      return; // Tailwind class list
    }
    const line = src.slice(0, index).split("\n").length;
    segments.push({ text: inner, line });
  };
  const stringRe =
    /"([^"\\\n]|\\.)*"|'([^'\\\n]|\\.)*'|`([^`\\]|\\.)*`/gs;
  for (const m of src.matchAll(stringRe)) {
    push(m[0].slice(1, -1), m.index + 1);
  }
  // JSX text after ">" or after an inline "}" expression.
  const jsxRe = /[>}]([^<>{}]+)</gs;
  for (const m of src.matchAll(jsxRe)) {
    const inner = m[1].trim();
    if (inner) push(inner, m.index + 1);
  }
  return segments;
}

const failures = [];
const warnings = [];

for (const dir of SCAN_DIRS) {
  for (const rel of walk(dir)) {
    if (SKIP_FILES.has(rel)) continue;
    if (!/\.tsx?$/.test(rel) || rel.endsWith(".d.ts")) continue;
    const raw = readFileSync(join(root, rel), "utf8");
    const stripped = stripComments(raw);
    const lines = stripped.split("\n");

    lines.forEach((line, idx) => {
      const where = `${rel}:${idx + 1}`;
      if (DASHES.test(line)) {
        failures.push(`${where}: em/en dash in source (use a comma or "to")`);
      }
      if (INVISIBLE.test(line)) {
        failures.push(`${where}: invisible or unusual space character`);
      }
    });

    for (const seg of copySegments(stripped)) {
      const where = `${rel}:${seg.line}`;
      const lower = seg.text.toLowerCase();
      for (const phrase of phrases) {
        const at = lower.indexOf(phrase);
        if (at === -1) continue;
        // Allowed inside prohibition wording: a legal keyword in the same
        // copy segment, or a negation ("No", "never", "not") right before
        // the phrase.
        const before = lower.slice(0, at);
        if (
          LEGAL_CONTEXT.test(seg.text) ||
          /\b(no|never|not)\s*$/.test(before)
        )
          continue;
        failures.push(`${where}: banned phrase "${phrase}" (PCPNDT)`);
      }
      const m = seg.text.match(MARKERS);
      if (!m) continue;
      const flat = lower.replace(/\s+/g, " ");
      const pending = KNOWN_PENDING.find(
        (p) => rel === p.file && flat.includes(p.contains)
      );
      const msg = `${where}: marker "${m[1]}" in rendered copy`;
      if (pending) warnings.push(`${msg} (${pending.note})`);
      else failures.push(msg);
    }
  }
}

for (const w of warnings) console.warn(`warn: ${w}`);
if (failures.length) {
  console.error("Content check failed:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `Content check passed (${warnings.length} counsel-pending warnings, 0 violations).`
);
