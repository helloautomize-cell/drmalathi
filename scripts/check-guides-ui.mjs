// Interaction + a11y check for the guides pages.
// Usage: QA_BASE_URL=http://localhost:3000 node scripts/check-guides-ui.mjs
import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const axeSrc = readFileSync(
  join(process.cwd(), "node_modules/axe-core/axe.min.js"),
  "utf8"
);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
});

let failed = false;

async function checkA11y(page, name) {
  await page.evaluate(axeSrc);
  const res = await page.evaluate(() =>
    window.axe.run({ runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] })
  );
  const v = res.violations;
  console.log(`${name}: ${v.length} axe violations`);
  for (const viol of v) {
    failed = true;
    console.log(
      `  - ${viol.id}: ${viol.nodes.length} node(s) ${viol.nodes[0]?.target ?? ""}`
    );
  }
}

// --- Mobile 390 ---
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  // Search with results
  await page.goto(`${BASE}/guides`, { waitUntil: "networkidle0" });
  await page.type("#guide-search", "nipt");
  await sleep(400);
  let count = await page.$$eval("article", (els) => els.length);
  const q = await page.evaluate(() => new URL(location.href).searchParams.get("q"));
  console.log(`search 'nipt' -> ${count} card(s), url q=${q}`);

  // Search with no results
  await page.evaluate(() => {
    const input = document.getElementById("guide-search");
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    setter.call(input, "zzzz-nothing");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await sleep(400);
  const noResults = await page.evaluate(() =>
    document.body.innerText.includes("No guides found")
  );
  console.log(`search 'zzzz-nothing' -> no-results shown: ${noResults}`);

  await checkA11y(page, "/guides (mobile)");
  await page.goto(`${BASE}/guides/category/pregnancy-scans`, {
    waitUntil: "networkidle0",
  });
  await checkA11y(page, "category (mobile)");

  // Mobile article: open "In this guide" details
  await page.goto(`${BASE}/guides/downs-screening-oscar`, {
    waitUntil: "networkidle0",
  });
  await page.evaluate(() => {
    document.querySelector("details")?.setAttribute("open", "");
  });
  await sleep(200);
  await page.screenshot({
    path: "qa-screenshots/guides/mobile-390/article-toc-open.png",
  });
  const tocLinks = await page.$$eval("details nav a", (a) => a.length);
  console.log(`mobile ToC open: ${tocLinks} links, shot saved`);
  await checkA11y(page, "article (mobile)");
  await page.close();
}

// --- Desktop 1280 ---
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${BASE}/guides`, { waitUntil: "networkidle0" });
  await checkA11y(page, "/guides (desktop)");
  await page.goto(`${BASE}/guides/downs-screening-oscar`, {
    waitUntil: "networkidle0",
  });
  // Desktop table present, mobile cards hidden
  const tableVisible = await page.evaluate(() => {
    const t = document.querySelector("article table, main table");
    return t ? getComputedStyle(t.closest("div")).display !== "none" : false;
  });
  console.log(`desktop table rendered: ${tableVisible}`);
  // ToC sidebar
  const tocVisible = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="In this guide"]');
    return nav ? getComputedStyle(nav).display !== "none" : false;
  });
  console.log(`desktop ToC sidebar: ${tocVisible}`);
  await checkA11y(page, "article (desktop)");
  await page.close();
}

await browser.close();
console.log(failed ? "FAILED: axe violations found" : "All checks passed");
process.exit(failed ? 1 : 0);
