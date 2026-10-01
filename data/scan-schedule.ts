// DRAFT FOR MEDICAL REVIEW: the timing windows below follow common obstetric
// practice and are used only to point visitors to the right service page.
// The medical team must confirm each window and note before launch.

export type ScanStage = {
  id: string;
  label: string;
  hint: string;
  // Inclusive gestational-week window for timed stages; situational stages
  // (twins, after loss) omit this and are matched manually.
  weeks?: [number, number];
  scans: { slug: string; when: string }[];
  note: string;
};

export const scanStages: ScanStage[] = [
  {
    id: "early",
    weeks: [0, 10],
    label: "Up to 10 weeks",
    hint: "Just found out or early pregnancy",
    scans: [{ slug: "viability-scan", when: "From 6 weeks" }],
    note: "Early scans confirm the pregnancy is in the right place and check the heartbeat. NIPT can be arranged from 10 weeks onward.",
  },
  {
    id: "first-trimester",
    weeks: [11, 14],
    label: "11 to 14 weeks",
    hint: "First trimester screening window",
    scans: [
      { slug: "downs-screening-oscar", when: "11 to 13+6 weeks" },
      { slug: "first-trimester-anomaly-scan", when: "11 to 14 weeks" },
      { slug: "nipt", when: "From 10 weeks" },
    ],
    note: "This is a short window. If you are close to 14 weeks, please call so we can fit you in on time.",
  },
  {
    id: "mid",
    weeks: [15, 23],
    label: "15 to 23 weeks",
    hint: "Mid pregnancy",
    scans: [
      { slug: "anomaly-scan", when: "18 to 22 weeks" },
      { slug: "fetal-echo", when: "18 to 24 weeks" },
      { slug: "fetal-neurosonogram", when: "When advised by your doctor" },
    ],
    note: "The anomaly scan is the detailed check of your baby's organs and growth. A fetal echo or neurosonogram is added when there is a specific reason.",
  },
  {
    id: "late",
    weeks: [24, 42],
    label: "24 weeks onward",
    hint: "Third trimester",
    scans: [
      { slug: "growth-scan-doppler", when: "From 28 weeks, or as advised" },
      { slug: "fetal-echo", when: "When advised by your doctor" },
    ],
    note: "Growth scans with Doppler track your baby's size and blood flow. Your obstetrician will advise how often.",
  },
  {
    id: "twins",
    label: "Twins or multiples",
    hint: "Expecting more than one",
    scans: [
      { slug: "twin-specialised-clinic", when: "From the first trimester" },
      { slug: "growth-scan-doppler", when: "Every 2 to 4 weeks, as advised" },
    ],
    note: "Twin pregnancies are followed more closely, with scan timing depending on whether the babies share a placenta.",
  },
  {
    id: "after-loss",
    label: "After a loss or planning again",
    hint: "Recurrent miscarriage, previous complication",
    scans: [
      { slug: "recurrent-miscarriages-clinic", when: "Before or early in the next pregnancy" },
      { slug: "genetic-counselling", when: "Any time" },
      { slug: "fetal-postmortem", when: "After a pregnancy loss" },
    ],
    note: "Our team will help you understand what happened and plan the care for your next pregnancy.",
  },
];
