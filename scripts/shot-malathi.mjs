// Screenshots every page where the Dr Malathi portrait renders, scrolled to
// the photo. Usage: node scripts/shot-malathi.mjs
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

const PAGES = [
  ["home", "/"],
  ["doctors", "/doctors"],
  ["profile", "/doctors/dr-malathi-g-prasad"],
  ["about", "/about"],
  ["service", "/services/anomaly-scan"],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
});

for (const width of [1440, 390]) {
  const height = width < 768 ? 844 : 900;
  for (const [name, route] of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 60000 });
    // Scroll the first Dr Malathi image into view, centred.
    const found = await page.evaluate(() => {
      const img = document.querySelector('img[src*="doctor-malathi-900"]');
      if (!img) return false;
      img.scrollIntoView({ block: "center", behavior: "instant" });
      return true;
    });
    await new Promise((r) => setTimeout(r, 1200));
    const out = `qa-screenshots/malathi-${name}-${width}px.png`;
    await page.screenshot({ path: out });
    console.log(`${found ? "saved" : "NO IMG"} ${out}`);
    await page.close();
  }
}
await browser.close();
