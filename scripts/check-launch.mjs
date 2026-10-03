#!/usr/bin/env node
/**
 * Launch gate. Prints two lists:
 *
 *   BLOCKERS     must be resolved before a production deploy
 *   POST-LAUNCH  client/counsel decisions that can follow launch
 *
 * Exits non-zero when blockers exist AND VERCEL_ENV=production, so a
 * production build cannot ship with a known blocker. Locally it prints
 * the same lists and exits 0.
 *
 * Mirrors LAUNCH-CHECKLIST.md; update both together.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const blockers = [];
const postLaunch = [];

// --- env vars (process env plus .env / .env.local if present) -------------
const envText = [".env", ".env.local", ".env.production"]
  .map((f) => (existsSync(join(root, f)) ? readFileSync(join(root, f), "utf8") : ""))
  .join("\n");
const hasEnv = (name) => Boolean(process.env[name]) || new RegExp(`^${name}=`, "m").test(envText);
for (const name of ["RESEND_API_KEY", "LEADS_EMAIL_TO", "LEADS_EMAIL_FROM"]) {
  if (!hasEnv(name)) {
    blockers.push(`Missing env var ${name}: lead forms cannot deliver email`);
  }
}

// --- confirmation flags in lib/site.ts ------------------------------------
const siteLib = read("lib/site.ts");
const flag = (name) =>
  new RegExp(`export const ${name} = true`).test(siteLib);
if (!flag("whatsappNumberConfirmed")) {
  blockers.push(
    "WhatsApp lead number +91 74489 39808 not confirmed by client"
  );
}
if (!flag("saturdayHoursConfirmed")) {
  postLaunch.push("Confirm Saturday hours (lib/site.ts hours string)");
}
if (!flag("foundedYearConfirmed")) {
  postLaunch.push("Confirm founding year 2012 (copy also says 14 years in a bio)");
}

// --- placeholder-licence images -------------------------------------------
const sources = JSON.parse(read("data/image-sources.json"));
const renderedSlugs = new Set();
const scanFor = (text) => {
  for (const slug of Object.keys(sources)) {
    if (text.includes(slug)) renderedSlugs.add(slug);
  }
};
const walkDir = (dir) => {
  const abs = join(root, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const e of readdirSync(abs, { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) out.push(...walkDir(rel));
    else if (/\.(tsx?|mdx?)$/.test(e.name)) out.push(rel);
  }
  return out;
};
for (const dir of ["app", "components", "data"]) {
  for (const rel of walkDir(dir)) {
    if (rel === "data/image-sources.json") continue;
    scanFor(read(rel));
  }
}
for (const [slug, meta] of Object.entries(sources)) {
  if (meta.license === "placeholder" && !meta.parked) {
    blockers.push(
      `Image "${slug}" has placeholder licence${
        renderedSlugs.has(slug) ? " and is in use" : ""
      }; supply a licensed replacement and set licenseSource`
    );
  }
  if (meta.parked) {
    // Parked images render nothing, so they cannot ship broken; replacing
    // them is a post-launch content decision.
    postLaunch.push(
      `Image "${slug}" parked${meta.parkedNote ? ` (${meta.parkedNote})` : ""}`
    );
  }
}

// --- legal draft text ------------------------------------------------------
for (const p of [
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "app/editorial-policy/page.tsx",
  "app/accessibility/page.tsx",
]) {
  if (
    read(p).replace(/\s+/g, " ").includes("draft pending legal and client review")
  ) {
    blockers.push(`${p}: draft legal text still renders (counsel review)`);
  }
}

// --- unreviewed review badges ----------------------------------------------
const guidesSrc = read("data/guides.ts");
// Guide entries start with a top-level `slug:` field (4-space indent).
const slugAt = [...guidesSrc.matchAll(/\n {4}slug: "[^"]+"/g)].map(
  (m) => m.index
);
for (let i = 0; i < slugAt.length; i++) {
  const block = guidesSrc.slice(slugAt[i], slugAt[i + 1]);
  const slug = block.match(/slug:\s*"([^"]+)"/)?.[1] ?? "?";
  const hasReviewer = /reviewedBy:\s*(?!null|undefined)/.test(block);
  const reviewed = /reviewStatus:\s*"reviewed"/.test(block);
  const hasDate = /reviewedAt:\s*"(?!")[^"]+"/.test(block) && !/reviewedAt:\s*null/.test(block);
  if (hasReviewer && !(reviewed && hasDate)) {
    blockers.push(
      `Guide "${slug}" sets reviewedBy without a completed review (reviewStatus/reviewedAt)`
    );
  }
  const isDraft = /draft:\s*true/.test(block);
  if (isDraft) {
    postLaunch.push(`Guide "${slug}" is draft: true; medical review pending`);
  }
}

// --- post-launch / client decisions ----------------------------------------
const siteData = read("data/site.ts");
const nullField = (name) => new RegExp(`${name}:\\s*null`).test(siteData);
const emptyArray = (name) => new RegExp(`${name}:\\s*\\[\\]`).test(siteData);
if (nullField("pcpndtRegistration")) postLaunch.push("PCPNDT registration number");
if (nullField("clinicalEstablishmentRegistration"))
  postLaunch.push("Tamil Nadu clinical establishment registration number");
if (nullField("artRegistration"))
  postLaunch.push("ART registration (depends on whether IUI/IVF is offered)");
if (nullField("grievanceOfficer"))
  postLaunch.push("DPDP grievance officer details");
if (nullField("geo")) postLaunch.push("Clinic geo coordinates for schema");
if (emptyArray("socials")) postLaunch.push("Social profile URLs");
if (emptyArray("sameAs")) postLaunch.push("sameAs profile URLs for schema");
if (emptyArray("areaServed")) postLaunch.push("areaServed towns for schema");

const doctorsSrc = read("data/doctors.ts");
if (/roleIsPlaceholder:\s*true/.test(doctorsSrc)) {
  postLaunch.push("Dr Nivethitha's role line (roleIsPlaceholder)");
}
if (!/registration:\s*\{/.test(doctorsSrc)) {
  postLaunch.push("Doctor NMC/State Council registration numbers");
}

const coursesSrc = read("data/courses.ts");
const unconfirmed = [...coursesSrc.matchAll(/durationConfirmed:\s*false/g)].length;
if (unconfirmed > 0) {
  postLaunch.push(`${unconfirmed} course duration(s) awaiting confirmation`);
}

const testSrc = read("data/testimonials.ts");
const pendingConsent = [...testSrc.matchAll(/consentOnFile:\s*null/g)].length;
if (pendingConsent > 0) {
  postLaunch.push(`${pendingConsent} testimonial(s) awaiting written consent`);
}

const claimsSrc = read("data/claims.ts");
const unsub = [...claimsSrc.matchAll(/substantiation:\s*null/g)].length;
if (unsub > 0) {
  postLaunch.push(`${unsub} comparative claim(s) awaiting substantiation`);
}

// --- report ----------------------------------------------------------------
console.log("LAUNCH GATE\n");
console.log(`BLOCKERS (${blockers.length})`);
for (const b of blockers) console.log(`  - ${b}`);
if (!blockers.length) console.log("  none");
console.log(`\nPOST-LAUNCH (${postLaunch.length})`);
for (const p of postLaunch) console.log(`  - ${p}`);
if (!postLaunch.length) console.log("  none");

const prod = process.env.VERCEL_ENV === "production";
if (blockers.length && prod) {
  console.error(
    `\n${blockers.length} blocker(s) present and VERCEL_ENV=production: failing.`
  );
  process.exit(1);
}
if (blockers.length) {
  console.log("\nBlockers present. Non-production run: exiting 0.");
}
