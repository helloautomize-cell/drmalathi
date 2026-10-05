// Live PageSpeed Insights (mobile) for the production site via the PSI API.
// Saves raw JSON + the captured mobile screenshot per page under
// qa-screenshots/pagespeed/ and prints a summary table.
// Usage: node scripts/pagespeed-live.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = "https://fmctrichy.com";
const PAGES = [
  ["home", "/"],
  ["anomaly-scan", "/services/anomaly-scan"],
  ["nipt", "/services/nipt"],
  ["dr-malathi", "/doctors/dr-malathi-g-prasad"],
  ["contact", "/contact"],
  ["about", "/about"],
];

const OUT = "qa-screenshots/pagespeed";
mkdirSync(OUT, { recursive: true });

const metric = (audits, id) => audits?.[id]?.numericValue;
const rows = [];

for (const [name, path] of PAGES) {
  const url = encodeURIComponent(`${BASE}${path}`);
  const api =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}` +
    `&strategy=mobile&category=performance&category=accessibility` +
    `&category=best-practices&category=seo`;
  process.stdout.write(`${name}: running… `);
  const res = await fetch(api);
  const json = await res.json();
  if (!res.ok || json.error) {
    console.log(`FAILED ${res.status} ${json.error?.message ?? ""}`);
    continue;
  }
  writeFileSync(`${OUT}/${name}.json`, JSON.stringify(json, null, 1));
  const shot = json.lighthouseResult?.audits?.["final-screenshot"]?.details?.data;
  if (shot) {
    const b64 = shot.replace(/^data:image\/\w+;base64,/, "");
    writeFileSync(`${OUT}/${name}.png`, Buffer.from(b64, "base64"));
  }
  const lh = json.lighthouseResult;
  const cats = lh.categories;
  const field = json.loadingExperience?.metrics ?? {};
  const fieldVal = (m) =>
    m?.percentile != null ? `${Math.round(m.percentile)}` : "n/a";
  rows.push({
    name,
    perf: Math.round((cats.performance?.score ?? 0) * 100),
    a11y: Math.round((cats.accessibility?.score ?? 0) * 100),
    bp: Math.round((cats["best-practices"]?.score ?? 0) * 100),
    seo: Math.round((cats.seo?.score ?? 0) * 100),
    fcp: ((metric(lh.audits, "first-contentful-paint") ?? 0) / 1000).toFixed(1),
    lcp: ((metric(lh.audits, "largest-contentful-paint") ?? 0) / 1000).toFixed(1),
    tbt: Math.round(metric(lh.audits, "total-blocking-time") ?? 0),
    cls: (metric(lh.audits, "cumulative-layout-shift") ?? 0).toFixed(3),
    si: ((metric(lh.audits, "speed-index") ?? 0) / 1000).toFixed(1),
    fieldLcp: fieldVal(field.LARGEST_CONTENTFUL_PAINT_MS),
    fieldInp: fieldVal(field.INTERACTION_TO_NEXT_PAINT),
    fieldCls: field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile != null
      ? (field.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100).toFixed(2)
      : "n/a",
  });
  console.log(`${rows.at(-1).perf}`);
}

console.log("\n== Lab (mobile, simulated) ==");
console.log("page\tperf\ta11y\tbp\tseo\tfcp\tlcp\ttbt\tcls\tsi");
for (const r of rows) {
  console.log(
    `${r.name}\t${r.perf}\t${r.a11y}\t${r.bp}\t${r.seo}\t${r.fcp}s\t${r.lcp}s\t${r.tbt}ms\t${r.cls}\t${r.si}s`
  );
}
console.log("\n== Field data (CrUX p75, real users) ==");
console.log("page\tLCP\tINP\tCLS");
for (const r of rows) {
  console.log(`${r.name}\t${r.fieldLcp}\t${r.fieldInp}\t${r.fieldCls}`);
}
