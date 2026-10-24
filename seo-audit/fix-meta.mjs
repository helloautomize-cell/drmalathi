// ISS-206: bring titles to 50-60 rendered chars and descriptions to 140-160.
// Rendered title = seo.title + " | FMC Trichy" (13 chars). -> seo.title 37-47.
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("data/guides-blogs.ts", "utf8");
const a = src.indexOf("blogGuides: Guide[]") + "blogGuides: Guide[]".length;
const json = src.slice(src.indexOf("[", a), src.lastIndexOf("]") + 1).replace(/^\s*\/\/.*$/gm, "");
const guides = JSON.parse(json);

const SUFFIX = 13; // " | FMC Trichy"
const wc = (s) => s.trim().split(/\s+/).filter(Boolean).length;

function fitTitle(t) {
  // Cut at last clause separator that yields 37-47 chars; prefer longest.
  const parts = [];
  let cur = t;
  for (const sep of [", ", ": ", " & ", " — ", " - "]) {
    cur = t;
    while (true) {
      const i = cur.lastIndexOf(sep);
      if (i < 0) break;
      cur = cur.slice(0, i);
      parts.push(cur);
    }
  }
  parts.push(t);
  const ok = parts.filter((p) => p.length >= 37 && p.length <= 47);
  if (ok.length) return ok.sort((x, y) => y.length - x.length)[0];
  // try building from start: take words until <=47
  const words = t.split(" ");
  let acc = "";
  for (const w of words) {
    const trial = acc ? acc + " " + w : w;
    if (trial.length > 47) break;
    acc = trial;
  }
  if (acc.length >= 37) return acc;
  return null;
}

let tFixed = 0, dFixed = 0;
const unfixedT = [], unfixedD = [];
for (const g of guides) {
  const rendered = (g.seo?.title ?? g.title).length + SUFFIX;
  if (rendered < 50 || rendered > 60) {
    const cand = fitTitle(g.title) ?? fitTitle(g.seo?.title ?? "") ?? fitTitle(g.title + " — a patient guide");
    if (cand) { g.seo = { ...(g.seo ?? {}), title: cand }; tFixed++; }
    else unfixedT.push(`${g.slug} (${rendered})`);
  }
  const desc = g.seo?.description ?? g.excerpt;
  if (desc.length < 140 || desc.length > 160) {
    // Try excerpt first, then trim/pad
    let cand = null;
    for (const base of [g.excerpt, desc]) {
      if (base.length >= 140 && base.length <= 160) { cand = base; break; }
      // trim at last sentence/clause boundary <=160
      if (base.length > 160) {
        for (const sep of [". ", ", ", "; ", " — "]) {
          const i = base.lastIndexOf(sep, 160);
          const cut = i > 0 ? base.slice(0, i + (sep === ". " ? 1 : 0)) : null;
          if (cut && cut.length >= 140) { cand = cut; break; }
        }
        if (cand) break;
      }
    }
    if (cand) { g.seo = { ...(g.seo ?? {}), description: cand }; dFixed++; }
    else unfixedD.push(`${g.slug} (${desc.length})`);
  }
}

const head = src.slice(0, src.indexOf("[", a) + 1);
writeFileSync("data/guides-blogs.ts", head + "\n" + JSON.stringify(guides, null, 2).slice(1) + ";\n");
console.log(`titles fixed ${tFixed}, descs fixed ${dFixed}`);
console.log("unfixed titles:", unfixedT);
console.log("unfixed descs:", unfixedD);
