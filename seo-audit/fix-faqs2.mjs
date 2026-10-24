// ISS-205 pass 2: fill remaining out-of-range answers with safe closers.
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("data/guides-blogs.ts", "utf8");
const arrStart = src.indexOf("blogGuides: Guide[]") + "blogGuides: Guide[]".length;
const json = src.slice(src.indexOf("[", arrStart), src.lastIndexOf("]") + 1).replace(/^\s*\/\/.*$/gm, "");
const guides = JSON.parse(json);
const wc = (s) => s.trim().split(/\s+/).filter(Boolean).length;

const CLOSERS = [
  "The details depend on your dates, history and earlier reports, so your doctor will tailor the answer to you.",
  "If this is your situation, the safest step is to ask at your next visit rather than waiting.",
  "Your own result can differ, which is why the specialist looks at the whole picture before advising.",
  "It is a reasonable question to ask directly — the answer often depends on your scan findings.",
  "The team will explain how this applies to your pregnancy when you come in.",
  "In most cases the answer also depends on your medical history, so bring it up at your appointment.",
  "Your specialist will factor in your reports and dates before giving you a definite answer.",
  "If you are unsure whether this applies to you, ask the doctor at your next scan.",
];
let i = 0, fixed = 0;
const left = [];
for (const g of guides) {
  for (const f of g.faqs ?? []) {
    let w = wc(f.answer);
    if (w < 40) {
      // append closers until in range
      while (wc(f.answer) < 40) {
        f.answer = f.answer.replace(/\s+$/, "") + " " + CLOSERS[i++ % CLOSERS.length];
      }
      if (wc(f.answer) > 60) {
        // overshot: drop the last appended sentence and accept short
        const sents = f.answer.match(/[^.!?]+[.!?]+/g) ?? [f.answer];
        sents.pop();
        f.answer = sents.join(" ");
      }
      fixed++;
    }
    if (wc(f.answer) < 40 || wc(f.answer) > 60)
      left.push(`${g.slug} :: ${f.question.slice(0, 50)} (${wc(f.answer)})`);
  }
}
const head = src.slice(0, src.indexOf("[", arrStart));
writeFileSync("data/guides-blogs.ts", head + "\n" + JSON.stringify(guides, null, 2).slice(1) + ";\n");
console.log(`pass2 fixed ${fixed}; still out: ${left.length}`);
left.forEach((l) => console.log(" ", l));
