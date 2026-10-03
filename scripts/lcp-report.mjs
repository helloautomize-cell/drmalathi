import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3100";
const ROUTES = (process.env.QA_ROUTES ??
  "/,/services/anomaly-scan,/services/nipt,/doctors,/about,/contact").split(",");

let port = 9230;
for (const route of ROUTES) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", `--remote-debugging-port=${port}`],
  });
  try {
    const r = await lighthouse(`${BASE}${route}`, {
      port,
      formFactor: "mobile",
      screenEmulation: { mobile: true },
      onlyCategories: ["performance"],
    });
    const a = r.lhr.audits;
    const breakdown = a["lcp-breakdown-insight"]?.details?.items ?? [];
    const node = breakdown.find((i) => i.type === "node") ?? {};
    const phaseItem = breakdown.find((i) => i.type === "table");
    const discovery = a["lcp-discovery-insight"]?.details?.items?.[0]?.items ?? {};
    const snippet = node.snippet ?? "";
    const isImg = /<img/i.test(snippet);
    const src = snippet.match(/src="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&") ?? "";
    const nets = a["network-requests"]?.details?.items ?? [];
    const req = src ? nets.find((n) => n.url === src) : null;
    const phases = Object.fromEntries(
      (phaseItem?.items ?? []).map((p) => [p.subpart, Math.round(p.duration)])
    );
    console.log(`== ${route} ==`);
    console.log(`  LCP ${a["largest-contentful-paint"].displayValue} | ${isImg ? "IMAGE" : "TEXT/other"} | ${node.nodeLabel ?? node.selector ?? "?"}`);
    if (isImg) {
      console.log(
        `  served: w=${req?.url.match(/[?&]w=(\d+)/)?.[1] ?? "?"} mime=${req?.mimeType ?? "?"} transfer=${req ? Math.round(req.transferSize / 1024) + " kB" : "?"}`
      );
      console.log(
        `  fetchpriority=${discovery.priorityHinted?.value} eager=${discovery.eagerlyLoaded?.value} discoverable=${discovery.requestDiscoverable?.value}`
      );
      console.log(`  sizes="${snippet.match(/sizes="([^"]*)"/)?.[1] ?? "?"}"`);
    }
    console.log(`  phases: ${JSON.stringify(phases)}`);
  } catch (err) {
    console.log(route, "FAILED:", err.message?.slice(0, 200));
  }
  await browser.close();
  port += 1;
}
process.exit(0);
