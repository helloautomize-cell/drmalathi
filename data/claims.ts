// Registry of comparative or superlative claims that appear in site copy.
// Every entry needs a substantiation source supplied by the client (records,
// publications, official registries) before the claim is safe to keep.
// `substantiation` is free text describing the evidence and where it lives.
// check:launch lists every claim still awaiting substantiation.

export type Claim = {
  /** The claim as it appears in copy. */
  text: string;
  /** Files/fields where the claim renders. */
  usedIn: string[];
  /** Evidence for the claim; null = unsubstantiated, do not ship unchecked. */
  substantiation: string | null;
};

export const claims: Claim[] = [
  {
    text: "First centre in South Tamil Nadu for fetoscopic procedures",
    usedIn: [
      "app/page.tsx meta description",
      "components/home/firsts-strip.tsx",
      "app/about/page.tsx timeline",
    ],
    substantiation: null,
  },
  {
    text: "First in Tamil Nadu for fetal neurosonogram",
    usedIn: [
      "components/home/firsts-strip.tsx",
      "app/about/page.tsx timeline",
      "data/services.ts fetal-neurosonogram",
    ],
    substantiation: null,
  },
  {
    text: "First in the region with in-house genetic counselling",
    usedIn: [
      "components/home/firsts-strip.tsx",
      "app/about/page.tsx timeline",
      "data/services.ts genetic-counselling",
    ],
    substantiation: null,
  },
];
