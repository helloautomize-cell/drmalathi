// Registry of comparative or superlative claims that appear in site copy.
// Every entry needs client-supplied proof (records, publications, official
// registries) before the claim is safe to ship. `substantiated`:
//   true  -> evidence received and verified; claim renders everywhere
//   false -> checked and cannot be evidenced; keep hidden
//   null  -> awaiting client evidence; hidden in production, shown on preview
// check:launch lists every claim that is not `substantiated: true`.

import { showPending } from "@/lib/env";

export type ClaimId =
  | "fetoscopic-first"
  | "neurosonogram-first"
  | "counselling-first";

export type Claim = {
  id: ClaimId;
  /** The claim as it appears in copy. */
  text: string;
  /** Files/fields where the claim renders. */
  usedIn: string[];
  substantiated: boolean | null;
};

export const claims: Claim[] = [
  {
    id: "fetoscopic-first",
    text: "First centre in South Tamil Nadu for fetoscopic procedures",
    usedIn: [
      "components/home/firsts-strip.tsx",
      "app/about/page.tsx timeline",
    ],
    substantiated: null,
  },
  {
    id: "neurosonogram-first",
    text: "First in Tamil Nadu for fetal neurosonogram",
    usedIn: [
      "components/home/firsts-strip.tsx",
      "app/about/page.tsx timeline",
      "data/services.ts fetal-neurosonogram",
    ],
    substantiated: null,
  },
  {
    id: "counselling-first",
    text: "First in the region with in-house genetic counselling",
    usedIn: [
      "components/home/firsts-strip.tsx",
      "app/about/page.tsx timeline",
      "data/services.ts genetic-counselling",
    ],
    substantiated: null,
  },
];

/**
 * Whether a claim may render right now: only when substantiated in
 * production; preview deploys show every claim regardless.
 */
export function claimIsLive(id: ClaimId): boolean {
  const claim = claims.find((c) => c.id === id);
  if (!claim) return false;
  return claim.substantiated === true || showPending;
}
