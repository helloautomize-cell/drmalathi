// axe-core audit across every route at desktop width.
// Usage: node scripts/axe-all.mjs
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
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

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/viability-scan",
  "/services/downs-screening-oscar",
  "/services/first-trimester-anomaly-scan",
  "/services/anomaly-scan",
  "/services/growth-scan-doppler",
  "/services/nipt",
  "/services/fetal-echo",
  "/services/fetal-neurosonogram",
  "/services/second-opinion-scan",
  "/services/genetic-counselling",
  "/services/fetal-postmortem",
  "/services/recurrent-miscarriages-clinic",
  "/services/twin-specialised-clinic",
  "/fellowship",
  "/cme-activities",
  "/doctors",
  "/doctors/dr-malathi-g-prasad",
  "/doctors/dr-revathy-chandrasekharan",
  "/doctors/dr-shriharini-sg",
  "/gallery",
  "/contact",
  "/faq",
  "/international-patients",
  "/privacy",
  "/terms",
  "/editorial-policy",
  "/accessibility",
];

if (!CHROME) {
  console.error("No Chrome or Edge executable found.");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
});
const axeSource = createRequire(import.meta.url).resolve("axe-core");

let failures = 0;
for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  const res = await page.goto(`${BASE}${route}`, {
    waitUntil: "load",
    timeout: 60000,
  });
  if (!res || res.status() >= 400) {
    console.log(`${route}: HTTP ${res?.status() ?? "no response"}`);
    failures++;
    await page.close();
    continue;
  }
  await page.addScriptTag({ path: axeSource });
  const results = await page.evaluate(async () =>
    window.axe.run(document, { resultTypes: ["violations"] })
  );
  const v = results.violations;
  if (v.length === 0) {
    console.log(`${route}: 0 violations`);
  } else {
    failures++;
    console.log(`${route}: ${v.length} violation type(s)`);
    for (const rule of v) {
      console.log(`  [${rule.impact}] ${rule.id}: ${rule.help}`);
      for (const node of rule.nodes.slice(0, 4)) {
        console.log(`    - ${node.target.join(" ")}`);
      }
    }
  }
  await page.close();
}

await browser.close();
console.log(failures === 0 ? "ALL ROUTES CLEAN" : `${failures} route(s) with issues`);
process.exit(failures === 0 ? 0 : 1);
