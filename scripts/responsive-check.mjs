// Responsive overflow check + screenshots at 375 / 768 / 1280.
// Usage: QA_BASE_URL=http://localhost:3100 node scripts/responsive-check.mjs
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

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3100";
const ROUTES = [
  "/services/anomaly-scan",
  "/services",
  "/about",
  "/contact",
  "/due-date-calculator",
  "/gallery",
  "/cme-activities",
  "/international-patients",
  "/doctors/dr-malathi-g-prasad",
];
const WIDTHS = [375, 768, 1280];
const OUT = "qa-screenshots/responsive";

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
});

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return {
        extra: de.scrollWidth - de.clientWidth,
        clientWidth: de.clientWidth,
      };
    });
    const name = `${route.replace(/\//g, "_") || "_home"}-${width}.png`;
    await page.screenshot({ path: `${OUT}/${name}`, fullPage: false });
    console.log(
      `${route} @${width}: overflow ${overflow.extra}px`
    );
    await page.close();
  }
}
await browser.close();
process.exit(0);
