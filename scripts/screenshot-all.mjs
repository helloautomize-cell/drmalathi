// Full-page screenshots of every public page.
// Usage: QA_BASE_URL=http://localhost:3002 node scripts/screenshot-all.mjs
// QA_WIDTHS=mobile only does 375px; default does desktop+mobile.
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

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3002";
const DEFAULT_ROUTES = [
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
  "/gallery",
  "/contact",
  "/faq",
  "/international-patients",
  "/privacy",
  "/terms",
];
const ROUTES = process.env.QA_ROUTES
  ? process.env.QA_ROUTES.split(",")
  : DEFAULT_ROUTES;

const WIDTHS =
  process.env.QA_WIDTHS === "mobile"
    ? [{ name: "mobile-375", w: 375, h: 812 }]
    : process.env.QA_WIDTHS === "mobile390"
      ? [{ name: "mobile-390", w: 390, h: 844 }]
    : process.env.QA_WIDTHS === "mobile767"
      ? [{ name: "mobile-767", w: 767, h: 900 }]
    : process.env.QA_WIDTHS === "desktop"
      ? [{ name: "desktop-1280", w: 1280, h: 900 }]
      : [
          { name: "desktop-1280", w: 1280, h: 900 },
          { name: "mobile-375", w: 375, h: 812 },
        ];

const OUT = process.env.QA_OUTPUT ?? "qa-screenshots";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
});

for (const { name, w, h } of WIDTHS) {
  const dir = `${OUT}/${name}`;
  mkdirSync(dir, { recursive: true });
  for (const route of ROUTES) {
    const page = await browser.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewport({ width: w, height: h });
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
    // Trigger lazy images by scrolling through the page, then back to top.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await sleep(400);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    const file = route === "/" ? "home" : route.slice(1).replace(/\//g, "__");
    await page.screenshot({ path: `${dir}/${file}.png`, fullPage: true });
    console.log(`${name} ${route} -> ${dir}/${file}.png | overflow ${overflow}px | errors ${errors.length}`);
    await page.close();
  }
}
await browser.close();
process.exit(0);
