// Visual QA + axe-core audit using the system Chrome (puppeteer-core).
// Usage: node scripts/qa.mjs [path]
// Saves screenshots to qa-screenshots/ and prints an axe violation report.

import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME =
  process.env.CHROME_PATH ??
  [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].find((p) => existsSync(p));

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = "qa-screenshots";
const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 900 },
];

const targetPath = process.argv[2] ?? "/";

if (!CHROME) {
  console.error("No Chrome or Edge executable found.");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
});

const axeSource = createRequire(import.meta.url).resolve("axe-core");

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1,
  });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  const url = `${BASE}${targetPath}`;
  console.log(`navigating to ${url}`);
  await page.goto(url, {
    waitUntil: "load",
    timeout: 60000,
  });
  await page.evaluate(async () => {
    const step = 600;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 1500));
  const file = join(OUT_DIR, `${vp.name}${targetPath === "/" ? "-home" : targetPath.replaceAll("/", "-")}.png`);

  // Wait for lazy images to finish so scrollHeight stops shifting.
  // Skip non-rendered images (display:none); lazy ones never load.
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map((img) => {
        if (img.complete || img.getClientRects().length === 0) return null;
        return Promise.race([
          img.decode().catch(() => {}),
          new Promise((r) => setTimeout(r, 3000)),
        ]);
      })
    );
  });

  // Chrome repaints the top of the page past ~16,384px during fullPage
  // capture. For very tall pages, capture viewport tiles and stitch.
  await page.addStyleTag({
    content: `.fixed,.sticky{position:absolute !important}`,
  });
  const docH = await page.evaluate(
    () => document.documentElement.scrollHeight
  );
  if (docH > 15000) {
    const shots = [];
    for (let y = 0; y < docH; y += vp.height) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await new Promise((r) => setTimeout(r, 150));
      shots.push({
        input: await page.screenshot({ type: "png" }),
        top: y,
      });
    }
    // If scroll clamped before the last tile, pin it to the true bottom.
    shots[shots.length - 1].top = docH - vp.height;
    await sharp({
      create: {
        width: vp.width,
        height: docH,
        channels: 3,
        background: "#ffffff",
      },
    })
      .composite(
        shots.map((s) => ({ input: s.input, top: s.top, left: 0 }))
      )
      .png()
      .toFile(file);
    console.log(`saved ${file} (stitched ${shots.length} tiles)`);
  } else {
    await page.screenshot({ path: file, fullPage: true });
    console.log(`saved ${file}`);
  }

  if (vp.width === 375) {
    await page.addScriptTag({ path: axeSource });
    const results = await page.evaluate(async () => {
      const axe = window.axe;
      return axe.run(document, {
        resultTypes: ["violations"],
        rules: { "color-contrast": { enabled: true } },
      });
    });
    const v = results.violations;
    if (v.length === 0) {
      console.log("axe: 0 violations");
    } else {
      console.log(`axe: ${v.length} violation type(s)`);
      for (const rule of v) {
        console.log(`\n[${rule.impact}] ${rule.id}: ${rule.help}`);
        for (const node of rule.nodes.slice(0, 6)) {
          console.log(`  - ${node.target.join(" ")}`);
          console.log(`    ${node.failureSummary?.split("\n")[0] ?? ""}`);
        }
      }
    }
  }
  await page.close();
}

await browser.close();
