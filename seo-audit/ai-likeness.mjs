// AI-likeness scoring + worst-sentence extraction per guide.
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("data/guides-blogs.ts", "utf8");
const json = src.slice(src.indexOf("= [") + 2, src.lastIndexOf("]") + 1).replace(/^\s*\/\/.*$/gm, "");
const guides = JSON.parse(json);

const BANNED = ["delve","tapestry","realm","landscape","navigate","embark","journey","unlock","elevate","empower","seamless","robust","pivotal","crucial","vital","myriad","testament","holistic","game-changer","in today's fast-paced world","it's important to note","when it comes to","whether you're","comprehensive guide","in conclusion","here's the thing","that said","the reality is","genuinely","nuanced","straightforward","the bottom line"];

const sentences = (t) => (t ?? "").replace(/\]\([^)]+\)/g, "").replace(/\[|\]/g, "").match(/[^.!?]+[.!?]+/g) ?? [];

const titleCase = (h) => {
  const ws = h.replace(/[^a-zA-Z ]/g, "").split(/\s+/).filter((w) => w.length > 2);
  return ws.length >= 3 && ws.filter((w) => /^[A-Z]/.test(w)).length / ws.length > 0.7;
};

const out = [];
for (const g of guides) {
  const rec = { slug: g.slug, score: 15, flags: [], worst: [] }; // +15 shared skeleton
  const sents = [];
  const addSents = (t, ctx) => sentences(t).forEach((s) => sents.push({ s: s.trim(), ctx }));
  for (const b of g.content) {
    if (b.type === "paragraph" || b.type === "quote") addSents(b.text);
    if (b.type === "h2") {
      if (/final thoughts/i.test(b.text)) { rec.score += 12; rec.flags.push("'Final Thoughts' template heading"); }
      else if (titleCase(b.text)) { rec.score += 3; rec.flags.push(`Title Case H2: "${b.text}"`); }
    }
    if (b.type === "list") (b.items ?? []).forEach((i) => addSents(i));
  }
  (g.faqs ?? []).forEach((f) => { addSents(f.question); addSents(f.answer); });
  // banned words
  const allText = sents.map((x) => x.s.toLowerCase()).join(" ");
  for (const b of BANNED) if (allText.includes(b)) { rec.score += 8; rec.flags.push(`banned phrase: "${b}"`); }
  // FAQ answer lengths
  const bad = (g.faqs ?? []).filter((f) => { const w = f.answer.split(/\s+/).length; return w < 40 || w > 60; });
  if (bad.length) { rec.score += Math.min(10, bad.length * 2); rec.flags.push(`${bad.length}/${g.faqs.length} FAQ answers outside 40-60 words`); }
  if (!g.relatedService) { rec.score += 3; rec.flags.push("no relatedService card"); }
  rec.score = Math.max(0, Math.min(100, rec.score));

  // worst sentences: banned-hit sentences first, then Title-Case-ish or generic
  const scored = sents.map((x) => {
    let pts = 0; const low = x.s.toLowerCase();
    for (const b of BANNED) if (low.includes(b)) pts += 10;
    if (/final thoughts/i.test(x.s)) pts += 6;
    if (x.s.split(/\s+/).length > 38) pts += 3; // bloated sentence
    if (/^(here|this|that|it)('s| is| are)/i.test(x.s.trim())) pts += 2;
    return { ...x, pts };
  }).filter((x) => x.pts > 0).sort((a, b) => b.pts - a.pts);
  rec.worst = scored.slice(0, 5).map((x) => x.s.slice(0, 220));
  // pad with boilerplate flag sentences if fewer than 5
  if (rec.worst.length < 5) {
    const fillers = sents.filter((x) => /remember|trust|reach out|talk to|speak to/i.test(x.s)).slice(-3).map((x) => x.s.slice(0, 220));
    for (const f of fillers) if (rec.worst.length < 5 && !rec.worst.includes(f)) rec.worst.push(f);
  }
  out.push(rec);
}
writeFileSync("seo-audit/ai-likeness.json", JSON.stringify(out, null, 2));
const dist = out.reduce((a, r) => { const b = r.score < 30 ? "<30" : r.score < 50 ? "30-49" : r.score < 70 ? "50-69" : "70+"; a[b] = (a[b] ?? 0) + 1; return a; }, {});
console.log("score dist:", dist);
console.log("avg:", Math.round(out.reduce((a, r) => a + r.score, 0) / out.length));
for (const r of out.sort((a, b) => b.score - a.score).slice(0, 8)) console.log(r.score, r.slug, "|", rec_flags = r.flags.slice(0, 3).join("; "));
