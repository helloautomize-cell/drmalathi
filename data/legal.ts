// Legal page metadata. lastUpdated is an explicit date the editor sets when
// the page copy changes; never derive it from new Date() at render time.
// The page copy itself is pending counsel review; see LAUNCH-CHECKLIST.md.

export const legal = {
  privacy: {
    /** ISO date of the last content change to /privacy. */
    lastUpdated: "2026-10-03",
    /** True while the copy is pending legal and client review. */
    draftPendingReview: true,
  },
  terms: {
    lastUpdated: "2026-10-03",
    draftPendingReview: true,
  },
  editorialPolicy: {
    lastUpdated: "2026-10-03",
    draftPendingReview: true,
  },
  accessibility: {
    lastUpdated: "2026-10-03",
    draftPendingReview: true,
  },
  medicalDisclaimer: {
    lastUpdated: "2026-10-24",
    draftPendingReview: true,
  },
} as const;

export function legalDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}
