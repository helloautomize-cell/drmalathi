// Phase 4 QA audit: structure + a11y checks on every route at three mobile
// widths. Prints a per-route report; exits 1 if any hard failure remains.
// Usage: QA_BASE_URL=http://localhost:3000 node scripts/qa-phase4.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ??
  [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].find((p) => existsSync(p));

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const OUT = "qa-screenshots/phase-4";

const ROUTES = [
  "/", "/about", "/services",
  "/services/viability-scan", "/services/downs-screening-oscar",
  "/services/first-trimester-anomaly-scan", "/services/anomaly-scan",
  "/services/growth-scan-doppler", "/services/nipt", "/services/fetal-echo",
  "/services/fetal-neurosonogram", "/services/second-opinion-scan",
  "/services/genetic-counselling", "/services/fetal-postmortem",
  "/services/recurrent-miscarriages-clinic", "/services/twin-specialised-clinic",
  "/doctors", "/doctors/dr-malathi-g-prasad",
  "/doctors/dr-revathy-chandrasekharan",
  "/fellowship", "/cme-activities", "/gallery", "/contact", "/faq",
  "/international-patients",
  "/privacy", "/terms",
  "/guides", "/guides/category/pregnancy-scans",
  "/guides/category/screening-and-tests",
  "/guides/category/twins-and-high-risk", "/guides/category/pregnancy-health",
  "/guides/downs-screening-oscar", "/guides/anomaly-scan-what-to-expect",
];

const WIDTHS = [
  { name: "360x780", w: 360, h: 780 },
  { name: "390x844", w: 390, h: 844 },
  { name: "414x896", w: 414, h: 896 },
];

const axeSrc = readFileSync(
  join(process.cwd(), "node_modules/axe-core/axe.min.js"),
  "utf8"
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
});

const report = {};
const failures = [];

const AUDIT_JS = () => {
  const out = {};
  out.overflow =
    document.documentElement.scrollWidth - document.documentElement.clientWidth;

  // Reveals that never fired
  out.pendingReveals = [
    ...document.querySelectorAll('[data-reveal-state="pending"], .reveal:not([data-reveal-state])'),
  ]
    .map((el) => el.textContent.trim().slice(0, 60))
    .slice(0, 8);

  // Also catch any element still at opacity ~0
  out.invisible = [];
  for (const el of document.querySelectorAll("main *")) {
    const cs = getComputedStyle(el);
    if (
      cs.opacity !== "1" &&
      parseFloat(cs.opacity) < 0.05 &&
      cs.display !== "none" &&
      el.getBoundingClientRect().height > 4 &&
      !el.closest('[data-reveal-state="visible"]')
    ) {
      out.invisible.push(
        `${el.tagName.toLowerCase()}.${(el.className + "").split(" ").slice(0, 2).join(".")}: ${el.textContent.trim().slice(0, 50)}`
      );
      if (out.invisible.length >= 8) break;
    }
  }

  // Tap targets under 44px (excluding inline text links, WCAG-exempt)
  out.smallTargets = [];
  for (const el of document.querySelectorAll(
    'main a[href], main button, main [role="button"], main input, main select, main textarea, main summary, footer a[href]'
  )) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    // Sub-3px elements are visually-hidden form inputs (e.g. sr-only
    // checkbox proxies), not real tap targets.
    if (r.width <= 2 || r.height < 1) continue;
    if (r.width >= 44 && r.height >= 44) continue;
    const inline = cs.display.startsWith("inline");
    out.smallTargets.push(
      `${el.tagName.toLowerCase()} ${Math.round(r.width)}x${Math.round(r.height)}${inline ? " (inline)" : ""}: ${el.textContent.trim().slice(0, 45) || el.getAttribute("aria-label") || ""}`
    );
    if (out.smallTargets.length >= 12) break;
  }

  // Bottom bar coverage: body must pad for the fixed bar
  const bar = [...document.querySelectorAll("nav, footer, div")].find((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return (
      cs.position === "fixed" &&
      r.bottom >= window.innerHeight - 2 &&
      r.height >= 48 &&
      r.height <= 120
    );
  });
  out.bottomBar = bar
    ? {
        height: Math.round(bar.getBoundingClientRect().height),
        bodyPad: Math.round(
          parseFloat(getComputedStyle(document.body).paddingBottom)
        ),
      }
    : null;

  // Sections: SectionShell usage + adjacent same-surface pairs
  const shells = [...document.querySelectorAll("main [data-section-shell]")].filter(
    (el) => getComputedStyle(el).display !== "none"
  );
  out.nonShellSections = [
    ...document.querySelectorAll("main section:not([data-section-shell])"),
  ]
    .filter(
      (el) =>
        getComputedStyle(el).display !== "none" &&
        !el.closest("[data-section-shell]") // nested anchor subsections inside a shell are fine
    )
    .map((el) => (el.className + "").split(" ").slice(0, 3).join("."))
    .slice(0, 10);
  out.adjacentSameSurface = [];
  for (let i = 1; i < shells.length; i++) {
    if (shells[i].dataset.surface === shells[i - 1].dataset.surface) {
      out.adjacentSameSurface.push(
        `${shells[i - 1].dataset.surface}: ${(shells[i - 1].className + "").slice(0, 40)} -> ${(shells[i].className + "").slice(0, 40)}`
      );
    }
  }

  // Card-like elements missing data-mobile-card (audit aid)
  out.nonTypeCards = [];
  for (const el of document.querySelectorAll(
    'main [class*="rounded-2xl"][class*="shadow"], main [class*="rounded-3xl"][class*="shadow"]'
  )) {
    if (el.closest("[data-mobile-card]") && !el.hasAttribute("data-mobile-card"))
      continue;
    if (el.hasAttribute("data-mobile-card")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none") continue;
    out.nonTypeCards.push(
      `${el.tagName.toLowerCase()}: ${(el.className + "").split(" ").slice(0, 4).join(" ")} | ${el.textContent.trim().slice(0, 40)}`
    );
    if (out.nonTypeCards.length >= 10) break;
  }

  // Primary-looking buttons per section
  out.primaryPerSection = [];
  for (const sec of document.querySelectorAll("main section, main [data-section-shell]")) {
    if (getComputedStyle(sec).display === "none") continue;
    const primaries = [
      ...sec.querySelectorAll(
        'a[class*="bg-primary"], button[class*="bg-primary"], [role="button"][class*="bg-primary"]'
      ),
    ].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.display !== "none" && el.getBoundingClientRect().width > 0;
    });
    if (primaries.length > 1) {
      out.primaryPerSection.push(
        `${primaries.length} primary in ${sec.id || (sec.className + "").slice(0, 50)}`
      );
    }
  }
  return out;
};

for (const { name, w, h } of WIDTHS) {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    await page.setViewport({ width: w, height: h });
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
    // slow scroll so reveals fire
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.5;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
    });
    await sleep(400);
    const audit = await page.evaluate(AUDIT_JS);
    await page.evaluate(axeSrc);
    const axe = await page.evaluate(() =>
      window.axe.run({ runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] })
    );
    audit.axe = axe.violations.map(
      (v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target?.join(" ") ?? ""}`
    );
    audit.consoleErrors = consoleErrors.slice(0, 4);
    report[`${name} ${route}`] = audit;

    const hard =
      audit.overflow > 0 ||
      audit.pendingReveals.length > 0 ||
      audit.invisible.length > 0 ||
      audit.axe.length > 0 ||
      consoleErrors.length > 0 ||
      (audit.bottomBar && audit.bottomBar.bodyPad < audit.bottomBar.height - 8);
    if (hard) failures.push(`${name} ${route}`);
    console.log(
      `${name} ${route} | ovf ${audit.overflow} | rev ${audit.pendingReveals.length} | inv ${audit.invisible.length} | tgt ${audit.smallTargets.length} | sect ${audit.nonShellSections.length}/${audit.adjacentSameSurface.length} | card ${audit.nonTypeCards.length} | prim ${audit.primaryPerSection.length} | axe ${audit.axe.length} | err ${consoleErrors.length}${hard ? "  <== FAIL" : ""}`
    );
    await page.close();
  }
}

// Desktop axe pass
for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
  await page.evaluate(axeSrc);
  const axe = await page.evaluate(() =>
    window.axe.run({ runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] })
  );
  if (axe.violations.length) {
    failures.push(`desktop-axe ${route}`);
    console.log(
      `desktop-axe ${route}: ${axe.violations.length} violations: ${axe.violations
        .map((v) => v.id)
        .join(", ")}`
    );
  }
  await page.close();
}
console.log("desktop axe sweep done");

await browser.close();
writeFileSync(join(OUT, "qa-report.json"), JSON.stringify(report, null, 1));
console.log(`\nReport -> ${OUT}/qa-report.json`);
console.log(failures.length ? `FAILURES:\n${failures.join("\n")}` : "ALL CLEAN");
process.exit(failures.length ? 1 : 0);
