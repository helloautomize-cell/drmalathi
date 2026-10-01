import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--remote-debugging-port=9223"],
});
const r = await lighthouse("http://localhost:3000", {
  port: 9223,
  formFactor: "mobile",
  screenEmulation: { mobile: true },
  onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
});
for (const k in r.lhr.categories) console.log(k, Math.round(r.lhr.categories[k].score * 100));
const a = r.lhr.audits;
console.log("LCP", a["largest-contentful-paint"].displayValue, "| CLS", a["cumulative-layout-shift"].displayValue);
await browser.close();
process.exit(0);
