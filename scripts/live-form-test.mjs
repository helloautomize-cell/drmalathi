import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR:", String(e).slice(0, 200)));
page.on("console", (m) => { const t = m.text(); if (!/Download the React DevTools/.test(t)) console.log("CONSOLE:", t.slice(0, 160)); });
page.on("requestfailed", (r) => console.log("REQFAIL:", r.url().slice(0, 90)));
page.on("request", (r) => { if (r.method() === "POST") console.log("POST ->", r.url().slice(0, 80)); });
await page.goto("https://drmalathi.vercel.app/contact", { waitUntil: "networkidle0", timeout: 60000 });
await page.waitForSelector("#qc-name", { timeout: 20000 });
await page.evaluate(() => {
  const vis = (el) => !!el && !!el.offsetParent;
  window.__form = [...document.querySelectorAll("#qc-name")].find(vis).closest("form");
});
async function fill(sel, val) {
  await page.evaluate((sel, val) => {
    const el = window.__form.querySelector(sel);
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(el, val);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, sel, val);
}
await fill("#qc-name", "Audit Test Lead");
await fill("#qc-phone", "9876543210");
await page.evaluate(() => window.__form.querySelector('[role="checkbox"], [data-slot="checkbox"]')?.click());
await new Promise((r) => setTimeout(r, 4000));
const fired = await page.evaluate(() => {
  let saw = false;
  window.__form.addEventListener("submit", () => (saw = true), { once: true });
  window.__form.requestSubmit();
  return new Promise((r) => setTimeout(() => r(saw), 500));
});
console.log("submit event fired:", fired);
await new Promise((r) => setTimeout(r, 9000));
const out = await page.evaluate(() => ({
  alert: document.querySelector('[role="alert"]')?.textContent.trim().slice(0, 250) ?? null,
  status: document.querySelector('[role="status"]')?.textContent.trim().slice(0, 150) ?? null,
  alertBtns: [...document.querySelectorAll('[role="alert"] a')].map((a) => a.textContent.trim()),
  errs: [...document.querySelectorAll(".text-destructive")].map((e) => e.textContent),
}));
console.log(JSON.stringify(out, null, 1));
await browser.close();
