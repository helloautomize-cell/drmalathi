// Aggregates crawl-results.json into checklist signals.
import { readFileSync, readdirSync } from "node:fs";

const r = JSON.parse(readFileSync("seo-audit/crawl-results.json", "utf8"));
const pages = r.pages;

// Sitemap lastmods straight from the XML
const sm = await (await fetch("http://localhost:3101/sitemap.xml")).text();
const lastmods = {};
for (const m of sm.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?\s*<\/url>/g)) {
  lastmods[m[1].replace("https://fmctrichy.com", "")] = m[2] ?? "MISSING";
}

const report = { titles: [], meta: [], h1: [], canonical: [], robotsMeta: [], schema: [], noindexInSitemap: [], lastmodMissing: [], images: [], byline: [], faqs: [], breadcrumbs: [], og: [] };

for (const [path, p] of Object.entries(pages)) {
  if (p.status !== 200 || !p.title && !p.h1s) continue;
  if (p.titleLen < 50 || p.titleLen > 60) report.titles.push({ path, len: p.titleLen, title: p.title });
  if (p.metaLen < 140 || p.metaLen > 160) report.meta.push({ path, len: p.metaLen });
  if (p.h1Count !== 1) report.h1.push({ path, count: p.h1Count, h1s: p.h1s });
  if (!p.canonical) report.canonical.push(path);
  if (p.robotsMeta) report.robotsMeta.push({ path, robots: p.robotsMeta });
  if (p.robotsMeta?.includes("noindex") && lastmods[path] !== undefined) report.noindexInSitemap.push(path);
  if (lastmods[path] === "MISSING") report.lastmodMissing.push(path);
  if (p.emptyAltImgs || p.noAltImgs || p.imgsMissingDims) report.images.push({ path, emptyAlt: p.emptyAltImgs, noAlt: p.noAltImgs, missingDims: p.imgsMissingDims });
  report.schema.push({ path, scripts: p.jsonLdCount, types: [...new Set(p.schemaTypes)] });
  if (path.startsWith("/guides/") && !path.includes("category") && !path.includes("page")) {
    report.byline.push({ path, namedReviewer: p.bylineReviewed, teamByline: p.bylineTeam, faqSchema: p.hasFaqSchema });
  }
  if (!p.hasBreadcrumb && path !== "/") report.breadcrumbs.push(path);
  if (!p.ogTitle || !p.ogImage || !p.twitterCard) report.og.push({ path, ogTitle: p.ogTitle, ogImage: p.ogImage, tw: p.twitterCard });
}

// Broken internal links: union of all internal links across pages, test each
const allLinks = new Set();
for (const p of Object.values(pages)) if (p.internalLinks) p.internalLinks.forEach((l) => allLinks.add(l));
const broken = [];
for (const l of allLinks) {
  const res = await fetch(`http://localhost:3101${l}`, { redirect: "manual" });
  if (res.status !== 200) broken.push({ link: l, status: res.status, loc: res.headers.get("location") });
}

// Orphan check: which sitemap URLs have no inbound internal link
const inbound = new Set();
for (const p of Object.values(pages)) if (p.internalLinks) p.internalLinks.forEach((l) => inbound.add(l));
const orphans = Object.keys(lastmods).filter((u) => !inbound.has(u) && u !== "");

console.log(JSON.stringify({
  sitemapCount: Object.keys(lastmods).length,
  titlesOutOfRange: report.titles,
  metaOutOfRange: report.meta,
  h1Issues: report.h1,
  missingCanonical: report.canonical,
  robotsMetaPages: report.robotsMeta,
  noindexInSitemap: report.noindexInSitemap,
  lastmodMissing: report.lastmodMissing,
  imageIssues: report.images,
  guideBylines: report.byline.filter((b) => !b.namedReviewer).length + " guides without named reviewer",
  guideFaqMissing: report.byline.filter((b) => !b.faqSchema),
  missingBreadcrumbs: report.breadcrumbs,
  ogIssues: report.og,
  uniqueInternalLinks: allLinks.size,
  brokenLinks: broken,
  orphanSitemapUrls: orphans,
}, null, 2));
