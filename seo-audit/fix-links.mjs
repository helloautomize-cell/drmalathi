// ISS-203 + ISS-215: relatedService fills, in-body service/doctor links,
// early pillar links on 3 late guides.
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("data/guides-blogs.ts", "utf8");
const json = src.slice(src.indexOf("= [") + 2, src.lastIndexOf("]") + 1).replace(/^\s*\/\/.*$/gm, "");
const guides = JSON.parse(json);

const serviceNames = {
  "viability-scan": "viability scan",
  "downs-screening-oscar": "Down's screening (OSCAR)",
  "first-trimester-anomaly-scan": "first-trimester anomaly scan",
  "anomaly-scan": "anomaly scan",
  "growth-scan-doppler": "growth scan with Doppler",
  "nipt": "NIPT",
  "fetal-echo": "fetal echo",
  "fetal-neurosonogram": "fetal neurosonogram",
  "second-opinion-scan": "second opinion scan",
  "genetic-counselling": "genetic counselling",
  "fetal-postmortem": "fetal postmortem",
  "recurrent-miscarriages-clinic": "recurrent miscarriages clinic",
  "twin-specialised-clinic": "twin specialised clinic",
};

// Honest service fits for the 3 high-risk guides; fertility cluster has no
// matching service on the site, so those link to the doctors instead.
const fillRelated = {
  "what-makes-a-pregnancy-high-risk": "second-opinion-scan",
  "high-risk-pregnancy-extra-scans-and-tests": "growth-scan-doppler",
  "pregnancy-after-ivf-extra-monitoring": "growth-scan-doppler",
};

const CLOSING = [
  (s, d) => `If this applies to your pregnancy, our [${s.name}](${s.href}) page explains what the visit involves, or you can [meet our specialists](${d}) before you decide anything.`,
  (s, d) => `To arrange this at our Trichy centre, see [${s.name}](${s.href}); if you are unsure whether you need it, [our doctors](${d}) can tell you after a review.`,
  (s, d) => `You can read about how we run the [${s.name}](${s.href}) at our centre, and who performs it, on the [team page](${d}).`,
  (s, d) => `When you are ready, the [${s.name}](${s.href}) service page covers timings and preparation; questions about your own situation are best put to [our specialists](${d}).`,
  (s, d) => `If your doctor has suggested this, our [${s.name}](${s.href}) page lists what is included and how to book; [the team](${d}) is happy to talk it through first.`,
  (s, d) => `For appointments, the [${s.name}](${s.href}) page has the details, and [our fetal medicine specialists](${d}) can advise whether it fits your situation.`,
];
const CLOSING_NOSVC = [
  (d) => `If any of this sounds familiar, [our fetal medicine specialists](${d}) can review your reports and tell you what the next step looks like.`,
  (d) => `You do not have to work this out alone — [our doctors](${d}) see these situations every week and can guide you.`,
  (d) => `When you are ready to talk it through, [our specialists](${d}) will look at your history and suggest what fits.`,
  (d) => `If you want a specialist opinion on your own situation, [the team](${d}) is a call or a visit away.`,
];

// ISS-215 early pillar links: insert a sentence into an early paragraph.
const EARLY_PILLAR = {
  "male-fertility-tests-semen-analysis": {
    pillar: "/guides/fertility-testing-for-couples",
    sentence: "Male testing is one half of the picture; our [fertility testing guide for couples](/guides/fertility-testing-for-couples) covers what both partners should expect.",
  },
  "diabetes-and-pregnancy-baby-extra-monitoring": {
    pillar: "/guides/high-risk-pregnancy-fetal-medicine-specialist",
    sentence: "Diabetes is one of the commonest reasons a pregnancy is treated as [high-risk](/guides/high-risk-pregnancy-fetal-medicine-specialist), so extra monitoring is routine rather than alarming.",
  },
  "can-genetic-problems-cause-recurrent-miscarriage": {
    pillar: "/guides/recurrent-miscarriage-causes-tests-treatment",
    sentence: "This is one of the possible causes explored in our [recurrent miscarriage guide](/guides/recurrent-miscarriage-causes-tests-treatment), which looks at the full workup.",
  },
};

const edits = [];
let i = 0;
for (const g of guides) {
  if (fillRelated[g.slug]) g.relatedService = fillRelated[g.slug];

  // ISS-215: early pillar link — inject sentence into first paragraph block
  const ep = EARLY_PILLAR[g.slug];
  if (ep && !JSON.stringify(g.content).includes(ep.pillar)) {
    const firstPara = g.content.find((b) => b.type === "paragraph");
    if (firstPara) {
      firstPara.text = firstPara.text.trimEnd() + " " + ep.sentence;
      edits.push(`pillar-link: ${g.slug}`);
    }
  }

  // ISS-203: in-body service + doctor links.
  // Already linked in body? check.
  const bodyText = JSON.stringify(g.content);
  const svc = g.relatedService && serviceNames[g.relatedService]
    ? { name: serviceNames[g.relatedService], href: `/services/${g.relatedService}` }
    : null;
  const needsService = svc && !bodyText.includes(`/services/${g.relatedService}`);
  const needsDoctor = !bodyText.includes("/doctors");

  if (!needsService && !needsDoctor) continue;

  const paragraph = svc
    ? CLOSING[i % CLOSING.length](svc, "/doctors")
    : CLOSING_NOSVC[i % CLOSING_NOSVC.length]("/doctors");
  i++;

  // Insert before the "Related guides" h2 (or before last h2), so the link
  // sits inside body copy, not chrome.
  const relIdx = g.content.findIndex((b) => b.type === "h2" && /related guides/i.test(b.text));
  const at = relIdx > 0 ? relIdx : g.content.length;
  g.content.splice(at, 0, { type: "paragraph", text: paragraph });
  edits.push(`links: ${g.slug}`);
}

const out = JSON.stringify(guides, null, 2).replace(/^/m, "");
const newSrc = src.slice(0, src.indexOf("= [") + 2) + "\n" + out.slice(1, -1) + "];\n";
// Rebuild: keep header (imports + comment) then array
const head = src.slice(0, src.indexOf("= [") + 2);
writeFileSync("data/guides-blogs.ts", head + "\n" + out.slice(1, -1) + "];\n");
console.log(`edited ${edits.length} guides`);
console.log(edits.slice(0, 20).join("\n"));
