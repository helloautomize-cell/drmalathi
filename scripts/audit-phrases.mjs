// Cross-page repeated-phrase analysis: fetch every sitemap URL from the prod
// build, extract main-region text, count which 5-word phrases appear on 3+
// distinct pages (excluding known shared chrome), and list sibling card-title
// patterns. Output: docs/audit-phrases.json + console summary.
import { writeFileSync } from "node:fs";

const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3200";
const PROD = "https://fmctrichy.com";

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  .filter((u) => u.startsWith(PROD))
  .map((u) => u.slice(PROD.length) || "/")
  .filter((u) => !/placeholder|rss|\.xml/.test(u));

const SHARED = [
  /in keeping with the pcpndt act[^.]*\./gi,
  /determination or disclosure of the sex of the fetus[^.]*\./gi,
  /book your appointment/gi,
  /call us,? message us on whatsapp[^.]*/gi,
  /frequently asked questions/gi,
];

function mainText(html) {
  const start = html.search(/<main[\s>]/i);
  const end = html.indexOf("</main>", start);
  let t = end < 0 ? html.slice(start) : html.slice(start, end);
  t = t
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"').replace(/&nbsp;|&#x27;/g, " ")
    .replace(/<[^>]+>/g, " ");
  for (const re of SHARED) t = t.replace(re, " ");
  return t.toLowerCase().replace(/[^a-z0-9'\s]/g, " ").replace(/\s+/g, " ").trim();
}

const pageWords = new Map();
for (const u of urls) {
  const html = await (await fetch(`${BASE}${u}`)).text();
  const words = mainText(html).split(" ").filter(Boolean);
  pageWords.set(u, words);
}

// 5-gram -> set of pages
const gramPages = new Map();
for (const [u, words] of pageWords) {
  const seen = new Set();
  for (let i = 0; i + 5 <= words.length; i++) seen.add(words.slice(i, i + 5).join(" "));
  for (const g of seen) {
    if (!gramPages.has(g)) gramPages.set(g, new Set());
    gramPages.get(g).add(u);
  }
}

const repeats = [...gramPages.entries()]
  .filter(([, pages]) => pages.size >= 3)
  // drop fragments that are just a longer repeated phrase shifted by 1 word
  .sort((a, b) => b[1].size - a[1].size);

// de-dup overlapping n-grams: keep longest runs by merging contiguous hits
const merged = [];
const used = new Set();
for (const [g, pages] of repeats) {
  if (used.has(g)) continue;
  merged.push({ phrase: g, count: pages.size, pages: [...pages].slice(0, 12) });
  // mark overlapping neighbours as consumed (same page set, shifted by a word)
  for (const [g2, p2] of repeats) {
    if (g !== g2 && p2.size === pages.size && [...p2].every((p) => pages.has(p))) {
      const w1 = g.split(" "), w2 = g2.split(" ");
      if (w1.slice(1).join(" ") === w2.slice(0, 4).join(" ") || w1.slice(0, 4).join(" ") === w2.slice(1).join(" ")) used.add(g2);
    }
  }
}

console.log(`pages analysed: ${pageWords.size}`);
console.log(`5-word phrases on 3+ pages (after merge): ${merged.length}`);
for (const m of merged.slice(0, 40)) {
  console.log(`  ${m.count}x "${m.phrase}"  -> ${m.pages.slice(0, 4).join(", ")}${m.pages.length > 4 ? "…" : ""}`);
}
writeFileSync("docs/audit-phrases.json", JSON.stringify({ pages: urls.length, repeats: merged }, null, 1));
console.log("wrote docs/audit-phrases.json");
