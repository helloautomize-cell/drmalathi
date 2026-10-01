// Above-the-fold screenshots of the hero at 375 / 768 / 1280, with the finder
// expanded on desktop. Usage: node scripts/hero-shot.mjs
import { existsSync, mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ??
  [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ].find((p) => existsSync(p));
const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
mkdirSync("qa-screenshots", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
});

for (const [name, width, height] of [
  ["mobile-375", 375, 1100],
  ["tablet-768", 768, 1100],
  ["desktop-1280", 1280, 900],
]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `qa-screenshots/hero-${name}.png` });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  if (width === 1280) {
    await page.click("#scan-stage");
    await new Promise((r) => setTimeout(r, 400));
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: `qa-screenshots/hero-${name}-selected.png` });
  }
  console.log(`saved hero-${name}`, errors.length ? errors : "");
  await page.close();
}
await browser.close();
