import { readFileSync } from "node:fs";
const s = readFileSync("data/guides-blogs.ts", "utf8");
let depth = 0, inStr = false, esc = false, line = 1;
const startAt = s.indexOf("blogGuides: Guide[]");
for (let i = startAt; i < s.length; i++) {
  const c = s[i];
  if (c === "\n") line++;
  if (inStr) {
    if (esc) esc = false;
    else if (c === "\\") esc = true;
    else if (c === '"') inStr = false;
    continue;
  }
  if (c === '"') { inStr = true; continue; }
  if (c === "[" || c === "{") depth++;
  if (c === "]" || c === "}") depth--;
  if (depth < 0) { console.log("negative depth at line", line); break; }
  if (depth === 0) { console.log("closed at line", line, "rest:", JSON.stringify(s.slice(i, i + 60))); break; }
}
console.log("final depth:", depth);
