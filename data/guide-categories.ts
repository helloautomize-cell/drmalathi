import type { GuideCategory } from "@/types/guide";

// TODO: client to confirm the category names and descriptions before launch.
export const guideCategories: GuideCategory[] = [
  {
    slug: "pregnancy-scans",
    name: "Pregnancy scans",
    description: "What each scan checks and when it is usually done.",
  },
  {
    slug: "screening-and-tests",
    name: "Screening and tests",
    description: "Screening tests, what the results mean, and next steps.",
  },
  {
    slug: "twins-and-high-risk",
    name: "Twins and high-risk pregnancy",
    description: "Extra monitoring and specialist care for complex pregnancies.",
  },
  {
    slug: "pregnancy-loss",
    name: "Pregnancy loss",
    description: "Compassionate answers after a miscarriage or loss.",
  },
  {
    slug: "fertility-and-planning",
    name: "Fertility and planning",
    description: "Planning a pregnancy and the tests that come before it.",
  },
  {
    slug: "pregnancy-health",
    name: "Pregnancy health",
    description: "Staying well and knowing when to ask for help.",
  },
];
