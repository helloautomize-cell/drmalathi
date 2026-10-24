// ISS-207 codemod: sentence-case Title Case h2/h3 texts; rename "Final Thoughts" h2s.
import { readFileSync, writeFileSync } from "node:fs";

let src = readFileSync("data/guides-blogs.ts", "utf8");

const KEEP = new Set([
  "Down", "Down's", "Edwards", "Patau", "Turner", "Turner's", "Trichy", "Tamil",
  "Nadu", "India", "Indian", "Rh", "RhD", "Christmas", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
]);

const isAcronym = (w) => /^[A-Z0-9+.\-/]+$/.test(w) && /[A-Z]/.test(w) && w.length >= 2;
const hasDigitOrSingleCap = (w) => /\d/.test(w) || /^[A-Z]$/.test(w);

function sentenceCase(h) {
  // Sentence starts: beginning, and after ": " or "? "
  return h.replace(/(^\s*|(?<=[:?]\s)|(?<=\u201c\s)|(?<=\"\s))([A-Za-z\u2019']+)/g, "").length, h;
}

// Proper transform: walk words; capitalize word 1 and word after sentence
// punctuation; lowercase others unless acronym/proper noun/number.
function toSentenceCase(h) {
  const words = h.split(/(\s+)/);
  let startNext = true;
  return words.map((w) => {
    if (/^\s+$/.test(w) || w === "") return w;
    const sub = w.split(/(-)/).map((part, pi) => {
      if (part === "-" || part === "") return part;
      const lead = part.match(/^[\u201c"'\(\[]*/)[0];
      const trail = part.match(/[\u201d"'\)\].,?!:;]*$/)[0];
      const core = part.slice(lead.length, part.length - trail.length);
      if (!core) return part;
      if (startNext || isAcronym(core) || KEEP.has(core) || hasDigitOrSingleCap(core)) {
        const out = lead + core[0].toUpperCase() + core.slice(1) + trail;
        return out;
      }
      return lead + core[0].toLowerCase() + core.slice(1) + trail;
    }).join("");
    startNext = /[:?]$/.test(w) || /[:?]["\u201d]*$/.test(w);
    return sub;
  }).join("");
}

const CLOSERS = [
  "What this means for you", "The takeaway", "Before your appointment",
  "A few things to hold on to", "What matters most", "If you remember one thing",
  "Putting it together", "The essentials", "What to do next", "The short version",
  "Keeping it simple", "The part to remember",
];
let closerIdx = 0;

// Match "type": "h2"|"h3", "text": "..."
const re = /("type":\s*"(h2|h3)",\s*\n?\s*"text":\s*")((?:[^"\\]|\\.)*)(")/g;
let titleChanged = 0, finalChanged = 0;
src = src.replace(re, (m, pre, type, text, post) => {
  const t = JSON.parse(`"${text}"`);
  if (/^final thoughts$/i.test(t)) {
    finalChanged++;
    const rep = CLOSERS[closerIdx++ % CLOSERS.length];
    return pre + JSON.stringify(rep).slice(1, -1) + post;
  }
  const ws = t.replace(/[^a-zA-Z ]/g, " ").split(/\s+/).filter((w) => w.length > 2);
  const capped = ws.filter((w) => /^[A-Z]/.test(w)).length;
  if (ws.length >= 3 && capped / ws.length > 0.7) {
    const n = toSentenceCase(t);
    if (n !== t) { titleChanged++; return pre + JSON.stringify(n).slice(1, -1) + post; }
  }
  return m;
});

writeFileSync("data/guides-blogs.ts", src);
console.log(`title-case fixed: ${titleChanged}, Final Thoughts renamed: ${finalChanged}`);
