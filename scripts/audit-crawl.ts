// Pre-launch audit crawler. Two passes over the production build served
// locally: (1) fetch-based extraction of head/meta/schema/link data for every
// sitemap URL plus probe URLs, (2) a headless-Chrome pass measuring LCP,
// resource weights and precise main-content word counts.
//
// Usage: node scripts/audit-crawl.ts
//   AUDIT_BASE_URL=http://localhost:3200 (default)  PROD_URL=https://fmctrichy.com
// Writes docs/audit-data.json.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3200";
const PROD = process.env.PROD_URL ?? "https://fmctrichy.com";

const CHROME =
  process.env.CHROME_PATH ??
  [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ].find((p) => existsSync(p));

const SECURITY_HEADERS = [
  "strict-transport-security",
  "content-security-policy",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
];

const BANNED_PATTERNS: { id: string; re: RegExp }[] = [
  { id: "em-dash", re: /—/g },
  { id: "en-dash", re: /–/g },
  { id: "marker", re: /\b(TODO|PLACEHOLDER|Lorem ipsum|Coming soon|DRAFT)\b/g },
  {
    id: "us-spelling",
    re: /\b(centres?|centers?|counseling|counselor|program(?!me)[a-z]*|organizations?|organiz(e|ed|ing)|pediatric[a-z]*|anemia|color(ed|s)?|favorite|gray|theaters?|licence[ds]?)\b/gi,
  },
  { id: "us-date", re: /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/g },
  { id: "phone-bad-format", re: /\+91\d{10}\b|(?<!\+91 )(?<!\d)\d{10}(?!\d)/g },
];

type PageRow = {
  url: string;
  status: number;
  title: string;
  titleLen: number;
  metaDesc: string;
  metaDescLen: number;
  canonical: string | null;
  robots: string | null;
  indexable: boolean;
  h1s: string[];
  h1Count: number;
  schemaTypes: string[];
  schemaIssues: string[];
  ogImage: string | null;
  linksOutMain: string[];
  linksOutChrome: string[];
  linksIn: number;
  imgsNoAlt: string[];
  htmlBytes: number;
  inlineScriptBytes: number;
  scriptSrcs: string[];
  firstLoadJs: number | null;
  lcpMs: number | null;
  lcpElement: string | null;
  totalBytes: number | null;
  mainWords: number | null;
  mainWordsRaw: number | null;
  consoleErrors: string[];
  patternHits: Record<string, string[]>;
  headers: Record<string, string>;
};

function attrsOf(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g)) {
    out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
  }
  return out;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\s+/g, " ");
}

function mainRegion(html: string): string {
  const start = html.search(/<main[\s>]/i);
  if (start < 0) return html;
  const end = html.indexOf("</main>", start);
  return end < 0 ? html.slice(start) : html.slice(start, end);
}

function chromeRegion(html: string): string {
  const m = mainRegion(html);
  const i = html.indexOf(m);
  return html.slice(0, i) + html.slice(i + m.length);
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

function validateLd(node: Record<string, unknown>, issues: string[], seen: string[]) {
  if (!node || typeof node !== "object") return;
  const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
  for (const t of types.filter(Boolean)) seen.push(t);
  const need = (cond: boolean, msg: string) => {
    if (cond) issues.push(msg);
  };
  const t0 = types[0];
  switch (t0) {
    case "MedicalClinic":
      need(!node.name, "MedicalClinic: missing name");
      need(!node.address, "MedicalClinic: missing address");
      need(!node.telephone, "MedicalClinic: missing telephone");
      break;
    case "BreadcrumbList":
      need(
        !Array.isArray(node.itemListElement) || !node.itemListElement.length,
        "BreadcrumbList: empty itemListElement"
      );
      break;
    case "FAQPage":
      need(
        !Array.isArray(node.mainEntity) || !node.mainEntity.length,
        "FAQPage: empty mainEntity"
      );
      break;
    case "MedicalProcedure":
      need(!node.name, "MedicalProcedure: missing name");
      need(!node.provider, "MedicalProcedure: missing provider");
      break;
    case "Physician":
      need(!node.name, "Physician: missing name");
      break;
    case "Course":
      need(!node.name, "Course: missing name");
      need(!node.provider, "Course: missing provider");
      break;
    case "Article":
    case "MedicalWebPage":
      need(!(node.headline || node.name), `${t0}: missing headline/name`);
      need(!node.image, `${t0}: missing image`);
      if (t0 === "Article") {
        need(!node.datePublished, "Article: missing datePublished");
        need(!node.author, "Article: missing author");
        need(!node.publisher, "Article: missing publisher");
      }
      break;
  }
  for (const v of Object.values(node)) {
    if (v && typeof v === "object") {
      if (Array.isArray(v)) v.forEach((x) => validateLd(x, issues, seen));
      else validateLd(v as Record<string, unknown>, issues, seen);
    }
    if (typeof v === "string" && /localhost|127\.0\.0\.1|undefined|NaN|\[object/.test(v)) {
      issues.push(`suspicious value: ${v.slice(0, 80)}`);
    }
  }
}

async function fetchPage(path: string): Promise<{ res: Response; body: string }> {
  const res = await fetch(`${BASE}${path}`, {
    redirect: "manual",
    headers: { "accept-encoding": "identity" },
  });
  return { res, body: await res.text() };
}

// ---------- gather URL list ----------
const sitemapXml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  .filter((u) => u.startsWith(PROD))
  .map((u) => u.slice(PROD.length) || "/");

const probes = [
  "/design-system",
  "/this-page-does-not-exist",
  "/services/nonexistent-scan",
  "/about/",
  "/About",
  "/services/NIPT",
  "/guides/page/1",
  "/guides/rss.xml",
  "/favicon.ico",
  "/manifest.json",
];

console.log(`[crawl] ${urls.length} sitemap URLs + ${probes.length} probes`);

// ---------- pass 1: fetch ----------
const rows = new Map<string, PageRow>();
const linkGraph = new Map<string, Set<string>>();

async function crawlOne(path: string) {
  const { res, body } = await fetchPage(path);
  const headers: Record<string, string> = {};
  res.headers.forEach((v, k) => (headers[k] = v));
  const html = body;
  const metas: Record<string, string> = {};
  for (const m of html.matchAll(/<meta\s[^>]*>/g)) {
    const a = attrsOf(m[0]);
    const key = a.name ?? a.property ?? a.charset;
    if (key && a.content !== undefined) metas[key] = a.content;
    else if (key) metas[key] = a[key] ?? "";
  }
  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim() ?? "";
  const canon =
    /<link[^>]*rel="canonical"[^>]*>/i.exec(html)?.[0];
  const canonical = canon ? attrsOf(canon).href ?? null : null;
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    stripTags(m[1]).trim()
  );

  const schemaTypes: string[] = [];
  const schemaIssues: string[] = [];
  for (const m of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  )) {
    try {
      validateLd(JSON.parse(m[1]), schemaIssues, schemaTypes);
    } catch {
      schemaIssues.push("JSON-LD parse error");
    }
  }

  const main = mainRegion(html);
  const chrome = chromeRegion(html);
  const linksOf = (h: string) =>
    [...h.matchAll(/<a\s[^>]*href="([^"#][^"]*)"[^>]*>/gi)]
      .map((m) => m[1])
      .filter((h) => h.startsWith("/"))
      .map((h) => h.split("#")[0].split("?")[0] || "/");
  const linksOutMain = [...new Set(linksOf(main))];
  const linksOutChrome = [...new Set(linksOf(chrome))];
  linkGraph.set(path, new Set(linksOf(html)));

  const imgsNoAlt = [...html.matchAll(/<img\s[^>]*>/gi)]
    .map((m) => m[0])
    .filter((tag) => {
      const a = attrsOf(tag);
      return a.alt === undefined;
    })
    .map((tag) => (attrsOf(tag).src ?? tag.slice(0, 80)).split("?")[0]);

  const scriptSrcs = [...html.matchAll(/<script[^>]*src="([^"]+)"/gi)].map(
    (m) => m[1]
  );
  const inlineScriptBytes = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .reduce((n, m) => n + m[1].length, 0);

  const bodyText = stripTags(html.slice(html.search(/<body[\s>]/i)));
  const patternHits: Record<string, string[]> = {};
  for (const { id, re } of BANNED_PATTERNS) {
    const hits = [...bodyText.matchAll(re)].map((m) =>
      bodyText.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30).trim()
    );
    if (hits.length) patternHits[id] = [...new Set(hits)].slice(0, 8);
  }

  const robots = metas["robots"] ?? null;
  const row: PageRow = {
    url: path,
    status: res.status,
    title,
    titleLen: title.length,
    metaDesc: metas["description"] ?? "",
    metaDescLen: (metas["description"] ?? "").length,
    canonical,
    robots,
    indexable: !(robots && /noindex/i.test(robots)),
    h1s,
    h1Count: h1s.length,
    schemaTypes: [...new Set(schemaTypes)],
    schemaIssues,
    ogImage: metas["og:image"] ?? null,
    linksOutMain,
    linksOutChrome,
    linksIn: 0,
    imgsNoAlt,
    htmlBytes: Buffer.byteLength(html),
    inlineScriptBytes,
    scriptSrcs,
    firstLoadJs: null,
    lcpMs: null,
    lcpElement: null,
    totalBytes: null,
    mainWords: wordCount(stripTags(main)),
    mainWordsRaw: null,
    consoleErrors: [],
    patternHits,
    headers,
  };
  rows.set(path, row);
  console.log(
    `[fetch] ${path}  ${res.status}  title ${row.titleLen}ch  desc ${row.metaDescLen}ch  h1x${h1s.length}  ld[${row.schemaTypes.join(",")}]  words~${row.mainWords}`
  );
}

for (const u of [...urls, ...probes]) await crawlOne(u);

// link graph: inbound counts + orphans
for (const [src, set] of linkGraph) {
  for (const target of set) {
    const r = rows.get(target);
    if (r && r.url !== src) r.linksIn++;
  }
}
const discovered = new Set<string>();
for (const set of linkGraph.values()) for (const t of set) discovered.add(t);
const inSitemap = new Set(urls);
const orphans = [...discovered].filter(
  (d) => !inSitemap.has(d) && rows.get(d)?.status !== 404
);
const sitemapNotLinked = urls.filter(
  (u) => (rows.get(u)?.linksIn ?? 0) === 0 && u !== "/"
);

// ---------- pass 2: browser ----------
if (CHROME) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  for (const u of urls) {
    const row = rows.get(u)!;
    const page = await browser.newPage();
    const consoleErrors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
    });
    page.on("pageerror", (e) =>
      consoleErrors.push(`pageerror: ${String(e).slice(0, 200)}`)
    );
    await page.evaluateOnNewDocument(() => {
      (window as unknown as { __lcp: PerformanceEntry[] }).__lcp = [];
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) (window as unknown as { __lcp: PerformanceEntry[] }).__lcp.push(e);
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    try {
      await page.goto(`${BASE}${u}`, {
        waitUntil: "networkidle0",
        timeout: 60000,
      });
    } catch {
      consoleErrors.push("navigation timeout");
    }
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.6;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 600));
    const m = await page.evaluate(() => {
      const lcp = (window as unknown as { __lcp: PerformanceEntry[] }).__lcp?.at(-1) as (PerformanceEntry & { element?: Element }) | undefined;
      const el = lcp?.element as HTMLElement | undefined;
      const elDesc = el
        ? `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${String(el.className).split(" ").slice(0, 2).join(".")}${el.tagName === "IMG" ? " src=" + (el.getAttribute("src") ?? "").slice(0, 80) : " text=" + (el.textContent ?? "").trim().slice(0, 50)}`
        : null;
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const by = (t: string) =>
        res
          .filter((r) => r.initiatorType === t)
          .reduce((n, r) => n + (r.transferSize || 0), 0);
      const scripts = by("script") + by("link");
      const total = res.reduce((n, r) => n + (r.transferSize || 0), 0);

      // Precise word count: clone main, drop hidden/shared blocks.
      const main = document.querySelector("main")?.cloneNode(true) as HTMLElement | null;
      let words = -1;
      let wordsRaw = -1;
      if (main) {
        wordsRaw = (main.innerText ?? "").split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
        main
          .querySelectorAll(
            'script,style,template,[hidden],[aria-hidden="true"],.sr-only'
          )
          .forEach((n) => n.remove());
        const dropByText = (re: RegExp) => {
          main
            .querySelectorAll("section h1, section h2, section h3, div h2")
            .forEach((h) => {
              if (re.test(h.textContent ?? "")) {
                const sec = h.closest("section") ?? h.closest("div.rounded-3xl");
                sec?.remove();
              }
            });
        };
        dropByText(/Book your appointment/i);
        dropByText(/Frequently asked questions/i);
        words = (main.innerText ?? "").split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
      }
      const visibleH1 = [...document.querySelectorAll("main h1")].filter(
        (h) => (h as HTMLElement).offsetParent !== null
      ).length;
      const emptyAlt = [...document.querySelectorAll("main img[alt=''], main img:not([alt])")]
        .map((i) => (i.getAttribute("src") ?? "").split("?")[0].slice(0, 90));
      return {
        lcpMs: lcp ? Math.round(lcp.startTime) : null,
        lcpElement: elDesc,
        firstLoadJs: scripts,
        totalBytes: total,
        mainWords: words,
        mainWordsRaw: wordsRaw,
        visibleH1,
        emptyAlt: [...new Set(emptyAlt)],
      };
    });
    row.lcpMs = m.lcpMs;
    row.lcpElement = m.lcpElement;
    row.firstLoadJs = m.firstLoadJs;
    row.totalBytes = m.totalBytes;
    row.mainWords = m.mainWords >= 0 ? m.mainWords : row.mainWords;
    row.mainWordsRaw = m.mainWordsRaw >= 0 ? m.mainWordsRaw : null;
    row.h1Count = m.visibleH1 || row.h1Count;
    row.imgsNoAlt = [...new Set([...row.imgsNoAlt, ...m.emptyAlt])];
    row.consoleErrors = consoleErrors;
    console.log(
      `[dom] ${u}  LCP ${m.lcpMs}ms ${m.lcpElement ?? ""}  js ${Math.round((m.firstLoadJs ?? 0) / 1024)}kB  all ${Math.round((m.totalBytes ?? 0) / 1024)}kB  words ${m.mainWords}  h1 ${m.visibleH1}  err ${consoleErrors.length}`
    );
    await page.close();
  }
  await browser.close();
} else {
  console.log("[dom] no Chrome/Edge found; skipping browser pass");
}

// ---------- output ----------
mkdirSync("docs", { recursive: true });
const data = {
  base: BASE,
  prod: PROD,
  generatedAt: new Date().toISOString(),
  pages: [...rows.values()],
  orphans,
  sitemapNotLinked,
  securityHeadersSeen:
    rows.get("/")?.headers &&
    Object.fromEntries(
      SECURITY_HEADERS.map((h) => [h, rows.get("/")!.headers[h] ?? null])
    ),
};
writeFileSync("docs/audit-data.json", JSON.stringify(data, null, 1));
console.log(`\nWrote docs/audit-data.json (${rows.size} pages)`);
console.log(`Orphans (linked, not in sitemap): ${JSON.stringify(orphans)}`);
console.log(`Sitemap URLs with no inbound links: ${JSON.stringify(sitemapNotLinked)}`);
