// Parses data/guides-blogs.ts as data and runs per-guide checks.
import { readFileSync } from "node:fs";

const src = readFileSync("data/guides-blogs.ts", "utf8");
const start = src.indexOf("= [") + 2;
const end = src.lastIndexOf("]");
let json = src.slice(start, end + 1);
// strip // comments (none inside strings in this file's style? guard: only lines starting with optional ws + //)
json = json.replace(/^\s*\/\/.*$/gm, "");
const guides = JSON.parse(json);
console.log(`Parsed ${guides.length} guides`);

const BANNED = [
  "delve", "tapestry", "realm", "landscape", "navigate", "embark", "journey",
  "unlock", "elevate", "empower", "seamless", "robust", "pivotal", "crucial",
  "vital", "myriad", "testament", "holistic", "game-changer",
  "in today's fast-paced world", "it's important to note", "when it comes to",
  "whether you're", "comprehensive guide", "in conclusion", "here's the thing",
  "that said", "the reality is", "genuinely", "nuanced", "straightforward",
  "the bottom line",
];

const words = (s) => (s ?? "").split(/\s+/).filter(Boolean).length;

const out = [];
for (const g of guides) {
  const rec = {
    slug: g.slug,
    title: g.seo?.title ?? g.title,
    category: g.category,
    relatedService: g.relatedService ?? null,
    faqCount: g.faqs?.length ?? 0,
    faqAnswersOutOf40to60: (g.faqs ?? []).filter((f) => {
      const w = words(f.answer);
      return w < 40 || w > 60;
    }).map((f) => ({ q: f.question.slice(0, 60), w: words(f.answer) })),
    quickAnswer: !!g.quickAnswer,
    sourcesCount: g.sources?.length ?? 0,
    hasRelatedGuidesBlock: false,
    internalBodyLinks: new Set(),
    h2s: [],
    h3s: [],
    bannedHits: [],
    emDash: 0,
    finalThoughts: false,
    titleCaseH2: [],
    inr: false,
    tables: 0,
    blocks: g.content.length,
  };
  const scan = (t) => {
    if (!t) return;
    const low = t.toLowerCase();
    for (const b of BANNED) if (low.includes(b)) rec.bannedHits.push(b);
    rec.emDash += (t.match(/—/g) ?? []).length;
    if (/₹|INR|Rs\.? ?\d/i.test(t)) rec.inr = true;
    for (const m of t.matchAll(/\]\(([^)]+)\)/g)) {
      if (m[1].startsWith("/")) rec.internalBodyLinks.add(m[1]);
    }
  };
  const titleCase = (h) => {
    const ws = h.replace(/[^a-zA-Z ]/g, "").split(/\s+/).filter((w) => w.length > 2);
    const capped = ws.filter((w) => /^[A-Z]/.test(w)).length;
    return ws.length >= 3 && capped / ws.length > 0.7;
  };
  const walk = (blocks) => {
    for (const b of blocks ?? []) {
      switch (b.type) {
        case "h2":
          rec.h2s.push(b.text);
          if (/final thoughts/i.test(b.text)) rec.finalThoughts = true;
          if (titleCase(b.text)) rec.titleCaseH2.push(b.text);
          scan(b.text);
          break;
        case "h3": rec.h3s.push(b.text); scan(b.text); break;
        case "paragraph": case "quote": scan(b.text); break;
        case "list": b.items.forEach(scan); break;
        case "callout": scan(b.title); scan(b.text); break;
        case "table": rec.tables++; [...b.headers, ...b.rows.flat()].forEach(scan); break;
        case "cta": rec.internalBodyLinks.add(`/services/${b.service}`); break;
      }
    }
  };
  walk(g.content);
  if (g.keyTakeaways) g.keyTakeaways.forEach(scan);
  (g.faqs ?? []).forEach((f) => { scan(f.question); scan(f.answer); });
  scan(g.title); scan(g.excerpt);
  rec.internalBodyLinks = [...rec.internalBodyLinks];
  rec.guideLinks = rec.internalBodyLinks.filter((l) => l.startsWith("/guides/") && l !== `/guides/${g.slug}`);
  rec.serviceLinks = rec.internalBodyLinks.filter((l) => l.startsWith("/services/"));
  rec.doctorLinks = rec.internalBodyLinks.filter((l) => l.startsWith("/doctors"));
  out.push(rec);
}

import { writeFileSync } from "node:fs";
writeFileSync("seo-audit/guide-checks.json", JSON.stringify(out, null, 2));

// Summary
const sum = {
  total: out.length,
  noRelatedService: out.filter((r) => !r.relatedService).map((r) => r.slug),
  faqCountDist: {},
  faqAnswersOutOfRange: out.filter((r) => r.faqAnswersOutOf40to60.length).map((r) => ({ slug: r.slug, n: r.faqAnswersOutOf40to60.length, examples: r.faqAnswersOutOf40to60.slice(0, 3) })),
  noQuickAnswer: out.filter((r) => !r.quickAnswer).map((r) => r.slug),
  noSources: out.filter((r) => r.sourcesCount === 0).map((r) => r.slug),
  banned: out.filter((r) => r.bannedHits.length).map((r) => ({ slug: r.slug, hits: [...new Set(r.bannedHits)] })),
  emDash: out.filter((r) => r.emDash > 0).map((r) => ({ slug: r.slug, n: r.emDash })),
  finalThoughts: out.filter((r) => r.finalThoughts).map((r) => r.slug),
  titleCaseH2: out.filter((r) => r.titleCaseH2.length).map((r) => ({ slug: r.slug, h: r.titleCaseH2 })),
  noInr: out.filter((r) => !r.inr).length,
  withInr: out.filter((r) => r.inr).map((r) => r.slug),
  noTables: out.filter((r) => r.tables === 0).length,
  doctorLinksInBody: out.filter((r) => r.doctorLinks.length).map((r) => r.slug),
  serviceLinksInBody: Object.fromEntries(out.map((r) => [r.slug, r.serviceLinks.length])),
  guideLinkCounts: Object.fromEntries(out.map((r) => [r.slug, r.guideLinks.length])),
  byCategory: {},
};
out.forEach((r) => { sum.faqCountDist[r.faqCount] = (sum.faqCountDist[r.faqCount] ?? 0) + 1; sum.byCategory[r.category] = (sum.byCategory[r.category] ?? 0) + 1; });
console.log(JSON.stringify(sum, null, 2));
