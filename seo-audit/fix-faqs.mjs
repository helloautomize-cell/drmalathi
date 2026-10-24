// ISS-205: bring every FAQ answer to 40-60 words using sentences that already
// exist in the same guide (no invented content).
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("data/guides-blogs.ts", "utf8");
const json = src.slice(src.indexOf("= [") + 2, src.lastIndexOf("]") + 1).replace(/^\s*\/\/.*$/gm, "");
const guides = JSON.parse(json);

const wc = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const clean = (s) =>
  s.replace(/\]\(([^)]+)\)/g, "]").replace(/[\[\]]/g, "").replace(/\*\*/g, "");
const sentences = (t) =>
  (clean(t).match(/[^.!?]+[.!?]+/g) ?? []).map((s) => s.trim()).filter((s) => wc(s) >= 5);

const STOP = new Set(["about", "after", "again", "being", "between", "could", "every", "first", "there", "these", "those", "their", "which", "while", "where", "should", "would", "still", "other", "pregnancy", "pregnant", "doctor", "doctors", "guide"]);
const kw = (q) => q.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter((w) => w.length > 4 && !STOP.has(w));

let expanded = 0, trimmed = 0, left = [];
for (const g of guides) {
  const body = g.content
    .flatMap((b) => [b.text, ...(b.items ?? []), ...(b.rows ?? []).flat(), b.caption].filter(Boolean))
    .flatMap(sentences);
  const used = new Set();
  for (const f of g.faqs ?? []) {
    let w = wc(f.answer);
    if (w < 40) {
      const keys = kw(f.question);
      const cands = body
        .filter((s) => !f.answer.includes(s.slice(0, 30)) && !used.has(s))
        .map((s) => ({ s, score: keys.filter((k) => s.toLowerCase().includes(k)).length, len: wc(s) }))
        .filter((c) => c.score > 0)
        .sort((a, b) => b.score - a.score || b.len - a.len);
      for (const c of cands) {
        if (wc(f.answer) >= 40) break;
        // trim candidate at clause boundary if it overshoots
        let add = c.s;
        if (wc(f.answer) + wc(add) > 60) {
          const parts = add.split(/,\s+|;\s+|—\s+/);
          add = "";
          for (const p of parts) {
            const trial = add ? `${add}, ${p}` : p;
            if (wc(f.answer) + wc(trial) > 60) break;
            add = trial;
          }
          if (!add || !/[.!?]$/.test(add)) add = add ? add.replace(/[,\s]+$/, "") + "." : "";
          if (!add || wc(add) < 4) continue;
        }
        f.answer = f.answer.replace(/\s+$/, "") + " " + add;
        used.add(c.s);
        expanded++;
      }
      if (wc(f.answer) < 40 || wc(f.answer) > 60) left.push(`${g.slug} :: ${f.question.slice(0, 50)} (${wc(f.answer)})`);
    } else if (w > 60) {
      const sents = f.answer.match(/[^.!?]+[.!?]+/g) ?? [f.answer];
      while (sents.length > 1 && wc(sents.join(" ")) > 60) sents.pop();
      const joined = sents.join(" ");
      if (wc(joined) >= 40 && wc(joined) <= 60) { f.answer = joined; trimmed++; }
      else left.push(`${g.slug} :: ${f.question.slice(0, 50)} (${wc(joined)})`);
    }
  }
}

// Rebuild file preserving head
const head = src.slice(0, src.indexOf("= [") + 2);
const bodyJson = JSON.stringify(guides, null, 2);
writeFileSync("data/guides-blogs.ts", head + "\n" + bodyJson.slice(1) + ";\n");
console.log(`expanded ${expanded} answers, trimmed ${trimmed}`);
console.log(`still out of range: ${left.length}`);
left.slice(0, 40).forEach((l) => console.log(" ", l));
