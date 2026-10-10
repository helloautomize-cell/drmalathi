// Above-the-fold hero screenshots at given widths.
// Usage: QA_BASE_URL=http://localhost:3101 node scripts/shot-hero.mjs
import { existsSync, mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ??
  [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].find((p) => existsSync(p));
const BASE = process.env.QA_BASE_URL ?? "http://localhost:3101";
mkdirSync("qa-screenshots", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
});

const WIDTHS = (process.env.QA_WIDTHS ?? "1440,390")
  .split(",")
  .map((w) => [`${w.trim()}px`, Number(w.trim()), Number(w.trim()) < 768 ? 844 : 900]);

for (const [name, width, height] of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1800));
  await page.screenshot({ path: `qa-screenshots/hero-${name}.png` });
  console.log(`saved hero-${name}.png`);
  await page.close();
}
await browser.close();
