// DRAFT FOR DOCTOR TO APPROVE: every prepNote under TEST_OPTIONS is new
// plain-language copy written for this feature. The medical team must
// review and approve each note before launch.

/**
 * Options for the online booking form. Stored values are the visible
 * labels: what the visitor picks is exactly what lands in the Sheet's
 * "Visit type" and "Reason or test" columns.
 *
 * The same visit types and lists drive the zod schema
 * (lib/booking-schema.ts) and every form surface.
 */

export type VisitType = {
  /** Stored value, also the card title. */
  value: string;
  /** One-line help under the card title. */
  description: string;
  /** Options in the "Reason for visit" select. Empty for Test only:
      that select lists TEST_OPTIONS instead. */
  reasons: string[];
};

export const UNSURE_REASON = "Not sure, please advise";

export const VISIT_TYPES: VisitType[] = [
  {
    value: "New consultation",
    description: "Your first visit for this concern",
    reasons: [
      "Genetic Counselling",
      "Recurrent Miscarriages Clinic",
      "Twin Specialised Clinic",
      UNSURE_REASON,
    ],
  },
  {
    value: "Follow-up",
    description: "You have been seen at the centre before",
    reasons: [
      "Follow-up after a scan",
      "Follow-up after a consultation",
      UNSURE_REASON,
    ],
  },
  {
    value: "Show reports",
    description: "Discuss results from here or elsewhere",
    reasons: [
      "Ultrasound scan report",
      "NIPT or other blood test report",
      "Reports from another hospital or doctor",
      UNSURE_REASON,
    ],
  },
  {
    value: "Test only",
    description: "Book a scan or test directly",
    reasons: [],
  },
];

export const VISIT_TYPE_VALUES = VISIT_TYPES.map((t) => t.value) as [
  string,
  ...string[],
];

/** Tests and scans done in-house, bookable under the Test only visit type. */
export const TEST_OPTIONS: { name: string; prepNote: string }[] = [
  {
    name: "Viability Scan",
    prepNote:
      "Usually done between 6 and 10 weeks. A comfortably full bladder can help early scans.",
  },
  {
    name: "Down's Screening (OSCAR)",
    prepNote:
      "Done between 11 weeks and 13 weeks 6 days. No fasting needed; bring earlier pregnancy records if you have them.",
  },
  {
    name: "First Trimester Anomaly Scan",
    prepNote:
      "Done between 11 and 14 weeks. No special preparation needed.",
  },
  {
    name: "Anomaly Scan",
    prepNote:
      "Done between 18 and 22 weeks. Allow about 45 minutes; no fasting needed.",
  },
  {
    name: "Growth Scan with Doppler",
    prepNote:
      "Usually done in the third trimester. No special preparation needed.",
  },
  {
    name: "NIPT",
    prepNote:
      "A blood test best taken from 10 weeks of pregnancy. No fasting needed.",
  },
  {
    name: "Fetal Echo",
    prepNote:
      "Usually done between 18 and 24 weeks. No special preparation needed.",
  },
  {
    name: "Fetal Neurosonogram",
    prepNote:
      "Usually advised after an anomaly scan. Bring your earlier scan reports.",
  },
  {
    name: "Second Opinion Scan",
    prepNote:
      "Bring your previous scan reports and images.",
  },
];

/** Reason/test options for a visit type, in select order. */
export function reasonsFor(visitType: string): string[] {
  const type = VISIT_TYPES.find((t) => t.value === visitType);
  if (!type) return [];
  if (type.value === "Test only") return TEST_OPTIONS.map((t) => t.name);
  return type.reasons;
}

/** Prep note for a chosen test, or "" when there is none. */
export function prepNoteFor(testName: string): string {
  return TEST_OPTIONS.find((t) => t.name === testName)?.prepNote ?? "";
}

/* ------------------------------------------------------------------ */
/* Standard weekly slots                                               */
/* ------------------------------------------------------------------ */

/**
 * The same weekly pattern the Apps Script CONFIG.HOURS/SLOT_MINUTES uses:
 * Mon-Fri 09:00-21:00 in 60 minute slots, capacity 4. Used only for the
 * development fallback and the "usual hours" hint, never as bookable data;
 * live availability always comes from the Sheet.
 */
export const STANDARD_SLOT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export const STANDARD_SLOT_MINUTES = 60;
export const STANDARD_SLOT_CAPACITY = 4;
export const STANDARD_OPEN = "09:00";
export const STANDARD_CLOSE = "21:00";

/** "09:00" -> "9 am", "21:00" -> "9 pm" (matches the Sheet's label format). */
export function clockLabel(hhmm: string): string {
  const h = Number(hhmm.slice(0, 2));
  const m = hhmm.slice(3, 5);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m === "00" ? "" : `:${m}`} ${suffix}`;
}

/** "09:00","10:00" -> "9 am to 10 am" (same string the Sheet stores). */
export function slotLabel(start: string, end: string): string {
  return `${clockLabel(start)} to ${clockLabel(end)}`;
}

/** Standard slot start times for one weekday, e.g. 09:00 .. 20:00. */
export function standardSlotStarts(): string[] {
  const open = Number(STANDARD_OPEN.slice(0, 2)) * 60;
  const close = Number(STANDARD_CLOSE.slice(0, 2)) * 60;
  const starts: string[] = [];
  for (let t = open; t + STANDARD_SLOT_MINUTES <= close; t += STANDARD_SLOT_MINUTES) {
    starts.push(
      `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`
    );
  }
  return starts;
}
