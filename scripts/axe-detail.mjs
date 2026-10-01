import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";
const require = createRequire(import.meta.url);
const b = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox"],
});
const pg = await b.newPage();
await pg.setViewport({ width: 375, height: 812 });
await pg.goto("http://localhost:3000/", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 1200));
await pg.addScriptTag({ path: require.resolve("axe-core") });
const results = await pg.evaluate(async () => {
  const r = await window.axe.run(document, { resultTypes: ["violations"] });
  return r.violations.map((v) => ({
    id: v.id,
    nodes: v.nodes.map((n) => ({ html: n.html.slice(0, 300), summary: (n.failureSummary || "").split("\n").slice(0, 3).join(" | ") })),
  }));
});
console.log(JSON.stringify(results, null, 1));
await b.close();
