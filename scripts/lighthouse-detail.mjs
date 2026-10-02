import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3100";
const ROUTE = process.argv[2] ?? "/";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--remote-debugging-port=9224"],
});

const r = await lighthouse(`${BASE}${ROUTE}`, {
  port: 9224,
  formFactor: "mobile",
  screenEmulation: { mobile: true },
  onlyCategories: ["seo", "performance", "accessibility", "best-practices"],
});

console.log("--- failing audits ---");
for (const [k, a] of Object.entries(r.lhr.audits)) {
  if (a.score !== null && a.score < 1)
    console.log("FAIL", k, a.score, "|", a.title, "|", a.displayValue ?? "");
}
const a = r.lhr.audits;
console.log(
  "LCP", a["largest-contentful-paint"].displayValue,
  "| TBT", a["total-blocking-time"].displayValue,
  "| FCP", a["first-contentful-paint"].displayValue,
  "| SI", a["speed-index"].displayValue
);

await browser.close();
process.exit(0);
