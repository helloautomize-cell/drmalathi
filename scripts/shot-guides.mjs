import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "node:fs";
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));
const base = process.env.BASE || "http://localhost:3201";
const tag = process.argv[2] || "before";
const dir = `docs/screenshots/${tag}`;
mkdirSync(dir, { recursive: true });
const shots = [
  ["/guides", "guides-index"],
  ["/guides/anomaly-scan-tiffa-scan-pregnancy", "guide-article"],
];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  for (const [route, name] of shots) {
    await page.goto(base + route, { waitUntil: "networkidle0", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: `${dir}/${name}-${w}px.png`, fullPage: true });
    console.log(`${dir}/${name}-${w}px.png`);
  }
  await page.close();
}
await browser.close();
