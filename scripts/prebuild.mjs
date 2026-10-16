#!/usr/bin/env node
import { execFileSync } from "node:child_process";

/**
 * Prebuild gate.
 * Guides and content checks run on every build. The launch gate runs only
 * on Vercel production deploys (VERCEL_ENV=production), where missing
 * blockers fail the build; preview and local builds skip it entirely.
 * Run it manually any time with LAUNCH_GATE=1 npm run check:launch.
 */

const node = process.execPath;
const opts = { stdio: "inherit" };

execFileSync(node, ["scripts/check-guides.mjs"], opts);
execFileSync(node, ["scripts/check-content.mjs"], opts);

if (process.env.VERCEL_ENV === "production") {
  try {
    execFileSync(node, ["scripts/check-launch.mjs"], {
      ...opts,
      env: { ...process.env, LAUNCH_GATE: "1" },
    });
  } catch (err) {
    // The gate already printed its report; fail the build without a trace.
    process.exit(err.status ?? 1);
  }
}
