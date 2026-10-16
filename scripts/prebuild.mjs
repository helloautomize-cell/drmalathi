#!/usr/bin/env node
import { execFileSync } from "node:child_process";

/**
 * Prebuild gate.
 * Guides and content checks run on every build. The launch gate report
 * prints on every build so blockers stay visible, but it only fails the
 * build on launch day: a Vercel production deploy with ENFORCE_LAUNCH_GATE=1
 * set in the environment.
 */

const node = process.execPath;
const opts = { stdio: "inherit" };

execFileSync(node, ["scripts/check-guides.mjs"], opts);
execFileSync(node, ["scripts/check-content.mjs"], opts);

const enforced =
  process.env.VERCEL_ENV === "production" &&
  process.env.ENFORCE_LAUNCH_GATE === "1";

try {
  execFileSync(node, ["scripts/check-launch.mjs"], {
    ...opts,
    env: { ...process.env, LAUNCH_GATE: enforced ? "1" : "0" },
  });
} catch (err) {
  // The gate already printed its report; fail the build without a trace.
  process.exit(err.status ?? 1);
}

if (!enforced) {
  console.log(
    "Launch gate not enforced (set ENFORCE_LAUNCH_GATE=1 on launch day)"
  );
}
