// Audit crawler for Prompt 1: fetches every page raw (no JS) with bot UAs
// and extracts SEO/AEO/GEO signals into seo-audit/crawl-results.json.
// Usage: node seo-audit/crawl.mjs  (expects server on localhost:3101)

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = "http://localhost:3101";
const OUT_DIR = "seo-audit/html";
mkdirSync(OUT_DIR, { recursive: true });

const BOTS = {
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  gptbot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
  claudebot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
  perplexitybot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
};

async function fetchPage(path, ua = BOTS.googlebot) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "User-Agent": ua },
    redirect: "manual",
  });
  const text = await res.text();
  return { status: res.status, headers: res.headers, body: text };
}

const strip = (s) => (s ?? "").replace(/\s+/g, " ").trim();

function extract(html) {
  const title = strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const metaDesc = strip(
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i)?.[1] ??
    html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["']/i)?.[1]
  );
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
  const robotsMeta = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1].replace(/<[^>]+>/g, "")));
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1].replace(/<[^>]+>/g, "")));
  const jsonLdScripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const schemaTypes = [];
  const schemaGraphs = [];
  for (const raw of jsonLdScripts) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed["@graph"]) {
        schemaGraphs.push(parsed["@graph"].map((n) => n["@type"]));
        schemaTypes.push(...parsed["@graph"].map((n) => n["@type"]));
      } else {
        schemaTypes.push(parsed["@type"]);
        schemaGraphs.push([parsed["@type"]]);
      }
    } catch {
      schemaTypes.push("INVALID_JSON");
    }
  }
  const ogTitle = html.match(/property=["']og:title["'][^>]+content=["']([^"']*)/i)?.[1];
  const ogUrl = html.match(/property=["']og:url["'][^>]+content=["']([^"']*)/i)?.[1];
  const ogImage = html.match(/property=["']og:image["'][^>]+content=["']([^"']*)/i)?.[1];
  const twitterCard = html.match(/name=["']twitter:card["'][^>]+content=["']([^"']*)/i)?.[1];
  const imgs = [...html.matchAll(/<img[^>]*>/gi)].map((m) => m[0]);
  const emptyAltImgs = imgs.filter((t) => /alt=["']["']/.test(t) || /alt=["']\s*["']/.test(t));
  const noAltImgs = imgs.filter((t) => !/alt=/.test(t));
  const imgsMissingDims = imgs.filter((t) => !/width=/.test(t) || !/height=/.test(t));
  const internalLinks = [...new Set(
    [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)]
      .map((m) => m[1])
      .filter((h) => h.startsWith("/") && !h.startsWith("//") && !h.startsWith("/api"))
      .map((h) => h.split("#")[0].split("?")[0])
      .filter(Boolean)
  )];
  const externalLinks = [...new Set(
    [...html.matchAll(/<a[^>]+href=["'](https?:\/\/[^"']+)["']/gi)].map((m) => m[1])
  )];
  return {
    title, titleLen: title.length,
    metaDesc, metaLen: metaDesc.length,
    canonical, robotsMeta,
    h1s, h1Count: h1s.length, h2s,
    jsonLdCount: jsonLdScripts.length, schemaTypes, schemaGraphs,
    ogTitle: !!ogTitle, ogUrl: ogUrl ?? null, ogImage: !!ogImage, twitterCard: twitterCard ?? null,
    imgCount: imgs.length, emptyAltImgs: emptyAltImgs.length, noAltImgs: noAltImgs.length, imgsMissingDims: imgsMissingDims.length,
    internalLinks, externalLinks,
    hasBreadcrumb: /aria-label=["']Breadcrumb["']/i.test(html) || /BreadcrumbList/.test(html),
    hasFaqSchema: schemaTypes.includes("FAQPage"),
    bylineReviewed: /Medically reviewed by/i.test(html),
    bylineTeam: /clinical team/i.test(html),
    bytes: html.length,
  };
}

// 1. Sitemap URLs
const sm = await fetchPage("/sitemap.xml");
const sitemapUrls = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace("https://fmctrichy.com", "")
);
const lastmods = {};
for (const m of sm.body.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?(?:<lastmod>([^<]+)<\/lastmod>)?[\s\S]*?<\/url>/g)) {
  lastmods[m[1].replace("https://fmctrichy.com", "")] = m[2] ?? null;
}

// Extra URLs worth probing that are not in the sitemap
const extraPaths = [
  "/nonexistent-page-xyz-404",
  "/guides/page/1",
  "/guides/category/pregnancy-health",
  "/guides/rss.xml",
  "/llms.txt",
  "/llms-full.txt",
  "/manifest.webmanifest",
  "/book",
  "/q/test-location",
];

const results = { base: BASE, fetchedAt: new Date().toISOString(), sitemapCount: sitemapUrls.length, pages: {} };

const allPaths = [...sitemapUrls, ...extraPaths];
console.log(`Crawling ${allPaths.length} paths (${sitemapUrls.length} from sitemap)...`);

for (const path of allPaths) {
  try {
    const { status, headers, body } = await fetchPage(path);
    const rec = {
      status,
      xRobotsTag: headers.get("x-robots-tag"),
      location: headers.get("location"),
      lastmod: lastmods[path] ?? null,
    };
    if (status === 200 && headers.get("content-type")?.includes("text/html")) {
      Object.assign(rec, extract(body));
      const safe = path === "/" ? "_root" : path.replace(/^\//, "").replace(/\//g, "__");
      writeFileSync(join(OUT_DIR, `${safe}.html`), body);
    } else {
      rec.contentType = headers.get("content-type");
      if (body.length < 2000) rec.bodySnippet = strip(body).slice(0, 300);
    }
    results.pages[path] = rec;
    console.log(`${status} ${path}`);
  } catch (e) {
    results.pages[path] = { error: String(e) };
    console.log(`ERR ${path} ${e}`);
  }
}

// 2. Bot UA spot-checks on representative pages
const uaChecks = {};
for (const [name, ua] of Object.entries(BOTS)) {
  for (const p of ["/", "/guides", "/services/anomaly-scan", "/guides/nipt-in-pregnancy-test-accuracy-high-risk-result", "/doctors/dr-malathi-g-prasad"]) {
    const r = await fetchPage(p, ua);
    uaChecks[`${name} ${p}`] = { status: r.status, xRobotsTag: r.headers.get("x-robots-tag"), bytes: r.body.length };
  }
}
results.uaChecks = uaChecks;

// 3. Host-variant checks (apex vs www via Host header is a server-side
// concern; here we verify the proxy's own redirects)
for (const p of ["/Services/Anomaly-Scan", "/GUIDES"]) {
  const r = await fetchPage(p);
  results.pages[p] = { status: r.status, location: r.headers.get("location") };
}

writeFileSync("seo-audit/crawl-results.json", JSON.stringify(results, null, 2));
console.log(`\nDone. ${Object.keys(results.pages).length} pages -> seo-audit/crawl-results.json, raw HTML in seo-audit/html/`);
