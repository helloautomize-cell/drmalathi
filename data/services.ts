// DRAFT FOR MEDICAL REVIEW: all service descriptions below are new plain-language
// copy written for this redesign. The medical team must review and approve each
// description before launch. No statistics, success rates, or prices are stated.

import {
  Baby,
  BadgeCheck,
  Brain,
  ClipboardCheck,
  HeartPulse,
  Microscope,
  Repeat,
  ScanLine,
  ScanSearch,
  Sprout,
  TestTube,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export const serviceIconMap = {
  baby: Baby,
  badgeCheck: BadgeCheck,
  brain: Brain,
  clipboardCheck: ClipboardCheck,
  heartPulse: HeartPulse,
  microscope: Microscope,
  repeat: Repeat,
  scanLine: ScanLine,
  scanSearch: ScanSearch,
  sprout: Sprout,
  testTube: TestTube,
  trendingUp: TrendingUp,
  users: Users,
} satisfies Record<string, LucideIcon>;

export type ServiceIconName = keyof typeof serviceIconMap;
export type ServiceKind = "scan" | "blood-test" | "clinic" | "diagnostic";

export function getServiceIcon(name: ServiceIconName): LucideIcon {
  return serviceIconMap[name];
}

export const serviceCategories = [
  {
    id: "screening",
    label: "Screening Scans",
    blurb: "Ultrasound scans that check how your baby is growing and developing.",
    accent: "bg-rose-tint text-primary",
  },
  {
    id: "diagnostics",
    label: "Advanced Diagnostics",
    blurb: "Detailed tests that look closer when more information is needed.",
    accent: "bg-teal-tint text-teal",
  },
  {
    id: "clinics",
    label: "Specialty Clinics",
    blurb: "Focused care pathways for specific situations and conditions.",
    accent: "bg-plum/10 text-plum",
  },
] as const;

export type ServiceCategoryId = (typeof serviceCategories)[number]["id"];

// DRAFT FOR MEDICAL REVIEW: `weeks` windows follow common obstetric practice
// and must be confirmed by the medical team before launch. This is the single
// source — card chips, the home WeekRail and `window` strings all derive from
// it, so they can never disagree. Week chips and the WeekRail render only
// while SHOW_DRAFT_WEEK_WINDOWS is true; set it false to hide all week UI
// until the medical team signs off.
export const SHOW_DRAFT_WEEK_WINDOWS = true;

/** Inclusive gestational-week window; `end` omitted = "from N weeks" onward. */
export type WeekWindow = { start: number; end?: number };

export type Service = {
  slug: string;
  name: string;
  category: ServiceCategoryId;
  icon: LucideIcon;
  iconName: ServiceIconName;
  kind: ServiceKind;
  shortDescription: string;
  image?: string;
  homeMoreOrder?: number;
  // DRAFT FOR MEDICAL REVIEW: typical scan windows below follow common obstetric
  // practice and must be confirmed by the medical team before launch.
  window?: string;
  weeks?: WeekWindow;
  // DRAFT FOR MEDICAL REVIEW: detail copy below is plain-language and awaits sign-off.
  detail: string[];
  timing?: string;
  preparation?: string;
};

const serviceList: Service[] = [
  // Screening Scans
  {
    slug: "viability-scan",
    name: "Viability Scan",
    category: "screening",
    icon: Sprout,
    iconName: "sprout",
    kind: "scan",
    shortDescription:
      "An early pregnancy scan that confirms the pregnancy is in the right place and checks for your baby's heartbeat.",
    image: "/images/services/viabilityscan.webp",
    weeks: { start: 6, end: 9 },
    detail: [
      "A viability scan is usually the first scan of your pregnancy. It confirms the pregnancy is located inside the womb, checks that your baby's heartbeat has started, and helps establish how far along you are.",
      "For many families this is also the first moment they see their baby on the screen, and our team takes time to explain what you are looking at.",
    ],
    timing: "Usually from 6 to 10 weeks of pregnancy.",
    preparation:
      "A comfortably full bladder can help for very early scans. Bring any previous reports or referral notes.",
  },
  {
    slug: "downs-screening-oscar",
    name: "Down's Screening (OSCAR)",
    category: "screening",
    icon: ClipboardCheck,
    iconName: "clipboardCheck",
    kind: "scan",
    shortDescription:
      "A combined first trimester screening that assesses the chance of Down's syndrome and other chromosomal conditions.",
    image: "/images/services/downsscreeningoscor.webp",
    weeks: { start: 11, end: 14 },
    detail: [
      "OSCAR is a combined first trimester screening that brings together a detailed ultrasound measurement of your baby and a simple blood test from the mother.",
      "The result is expressed as a chance or risk figure, which the doctor explains clearly. It is a screening test, not a diagnosis, and a high chance result does not mean your baby definitely has a condition.",
    ],
    timing: "Usually between 11 and 13+6 weeks of pregnancy.",
    preparation: "No special preparation is needed.",
  },
  {
    slug: "first-trimester-anomaly-scan",
    name: "First Trimester Anomaly Scan",
    category: "screening",
    icon: ScanLine,
    iconName: "scanLine",
    kind: "scan",
    shortDescription:
      "A detailed early scan that checks your baby's development and can identify many structural conditions sooner.",
    image: "/images/services/FirstTrimesterAnomalyScan.webp",
    weeks: { start: 11, end: 14 },
    detail: [
      "This is a detailed early anatomy survey, performed by a fetal medicine specialist, that checks your baby's head, heart, spine, limbs, and major organs while there is still time to plan further care.",
      "It goes beyond a routine early scan and can identify many structural conditions sooner, giving families more time for counselling and decision making.",
    ],
    timing: "Usually between 11 and 14 weeks of pregnancy.",
    preparation: "No special preparation is needed.",
  },
  {
    slug: "anomaly-scan",
    name: "Anomaly Scan",
    category: "screening",
    icon: ScanSearch,
    iconName: "scanSearch",
    kind: "scan",
    shortDescription:
      "The detailed mid-pregnancy scan that examines your baby's organs, growth, and wellbeing.",
    image: "/images/services/AnomalyScan.webp",
    weeks: { start: 18, end: 22 },
    detail: [
      "The anomaly scan is the most detailed ultrasound most pregnancies receive. It systematically examines your baby's brain, face, spine, heart, stomach, kidneys, limbs, and blood flow, along with the placenta and fluid around the baby.",
      "At our centre every anomaly scan is performed or supervised by a fetal medicine specialist, and the findings are explained to you in person.",
    ],
    timing: "Usually between 18 and 22 weeks of pregnancy.",
    preparation:
      "No special preparation is needed. Bring previous scan reports and your referral if you have one.",
  },
  {
    slug: "growth-scan-doppler",
    name: "Growth Scan with Doppler",
    category: "screening",
    icon: TrendingUp,
    iconName: "trendingUp",
    kind: "scan",
    shortDescription:
      "A scan that tracks your baby's growth and blood flow, especially important in the later months.",
    image: "/images/services/GrowthScanwithDoppler.webp",
    weeks: { start: 28, end: 36 },
    detail: [
      "A growth scan checks your baby's size, the fluid around the baby, and the placenta. Doppler assessment looks at blood flow in the umbilical cord and the baby's vessels to check how well the placenta is working.",
      "It is especially important when there is a history of a small baby, high blood pressure, diabetes, twins, or reduced movements.",
    ],
    timing: "Usually from 28 weeks onward, and repeated as advised.",
    preparation: "No special preparation is needed.",
  },

  // Advanced Diagnostics
  {
    slug: "nipt",
    name: "NIPT",
    category: "diagnostics",
    icon: TestTube,
    iconName: "testTube",
    kind: "blood-test",
    shortDescription:
      "A simple blood test from the mother that screens for common chromosomal conditions, with no risk to the baby.",
    image: "/images/services/NIPT.webp",
    weeks: { start: 10 },
    detail: [
      "NIPT, or non-invasive prenatal testing, analyses fragments of your baby's DNA that circulate naturally in the mother's blood to screen for common chromosomal conditions such as Down's syndrome.",
      "Because it is a blood test it carries no risk to the baby. It is a screening test, so any higher-chance result is discussed carefully and confirmed by further testing where appropriate.",
    ],
    timing: "Usually from 10 weeks of pregnancy onward.",
    preparation: "No special preparation is needed.",
  },
  {
    slug: "fetal-echo",
    name: "Fetal Echo",
    category: "diagnostics",
    icon: HeartPulse,
    iconName: "heartPulse",
    kind: "scan",
    shortDescription:
      "A focused ultrasound of your baby's heart that checks its structure, function, and rhythm.",
    image: "/images/services/FetalEcho.webp",
    weeks: { start: 18, end: 24 },
    detail: [
      "A fetal echo is a dedicated ultrasound of your baby's heart. It examines the heart's structure, its four chambers, the major blood vessels, and the rhythm in much more detail than a routine scan.",
      "It is usually recommended when there is a family history of heart conditions, a finding on another scan, diabetes in the mother, or certain infections.",
    ],
    timing: "Usually between 18 and 24 weeks of pregnancy.",
    preparation: "No special preparation is needed.",
  },
  {
    slug: "fetal-neurosonogram",
    name: "Fetal Neurosonogram",
    category: "diagnostics",
    homeMoreOrder: 2,
    icon: Brain,
    iconName: "brain",
    kind: "scan",
    shortDescription:
      "A detailed scan of your baby's brain and spine, for conditions affecting the nervous system.",
    image: "/images/services/FetalNeurosonogram.webp",
    detail: [
      "A fetal neurosonogram is a specialist examination of your baby's brain and spine. Our centre was the first in Tamil Nadu to offer this dedicated neurosonogram service.",
      "It is advised when another scan raises a question about the baby's brain, when there is a relevant family history, or after certain infections in pregnancy.",
    ],
    timing: "When advised by your referring doctor or our specialists.",
    preparation: "Bring all previous scan reports so the specialist has the full picture.",
  },
  {
    slug: "second-opinion-scan",
    name: "Second Opinion Scan",
    category: "diagnostics",
    homeMoreOrder: 3,
    icon: BadgeCheck,
    iconName: "badgeCheck",
    kind: "diagnostic",
    shortDescription:
      "A careful repeat scan and report review when you want reassurance or a specialist second opinion.",
    image: "/images/services/SecondOpinionScan.webp",
    detail: [
      "If you have had a scan elsewhere and would like a specialist review, we perform a careful repeat evaluation and go through your existing report with you.",
      "A second opinion can confirm a finding, clarify what it means, or occasionally change the picture. Either way, the findings and your options are explained in plain language.",
    ],
    timing: "At any stage of pregnancy, subject to what is being assessed.",
    preparation: "Please bring all previous scan reports, images, and medical records.",
  },

  // Specialty Clinics
  {
    slug: "genetic-counselling",
    name: "Genetic Counselling",
    category: "clinics",
    homeMoreOrder: 1,
    icon: Users,
    iconName: "users",
    kind: "clinic",
    shortDescription:
      "In-house counselling that explains results, inheritance, and your options in clear language.",
    image: "/images/services/GeneticCounsellingwithExpertGenetecist.webp",
    detail: [
      "Our centre was the first in the region to offer in-house genetic counselling. A genetic counsellor or specialist explains test results, family history, inheritance, and what the findings mean for your baby and future pregnancies.",
      "Counselling is a conversation, not a test. You leave with clear information and time to decide the next step that is right for your family.",
    ],
    timing: "Before or after a screening test, or when advised by your doctor.",
    preparation: "Bring family history details and any earlier reports.",
  },
  {
    slug: "fetal-postmortem",
    name: "Fetal Postmortem",
    category: "clinics",
    icon: Microscope,
    iconName: "microscope",
    kind: "diagnostic",
    shortDescription:
      "A specialist evaluation after pregnancy loss that helps families understand what happened and plan ahead.",
    image: "/images/services/FetalPostmortem.webp",
    detail: [
      "When a pregnancy is sadly lost, a specialist fetal postmortem evaluation can help the family understand why and plan safely for the future. Our centre offers this service in-house.",
      "The evaluation is handled with care and sensitivity, and the findings are discussed with you privately along with a plan for your next pregnancy.",
    ],
    timing: "After a pregnancy loss, in discussion with your doctor.",
    preparation: "Our team will guide you through what is involved.",
  },
  {
    slug: "recurrent-miscarriages-clinic",
    name: "Recurrent Miscarriages Clinic",
    category: "clinics",
    homeMoreOrder: 5,
    icon: Repeat,
    iconName: "repeat",
    kind: "clinic",
    shortDescription:
      "A dedicated clinic that investigates repeated pregnancy loss and plans care for your next pregnancy.",
    image: "/images/services/RecurrentMiscarriagesClinic.webp",
    detail: [
      "Recurrent miscarriage is exhausting and heartbreaking. Our dedicated clinic reviews your history, investigates possible causes, and plans monitored care for your next pregnancy.",
      "You are seen by specialists who understand both the medical and emotional side of pregnancy loss.",
    ],
    timing: "Before or early in a subsequent pregnancy.",
    preparation: "Bring earlier pregnancy records and test results if you have them.",
  },
  {
    slug: "twin-specialised-clinic",
    name: "Twin Specialised Clinic",
    category: "clinics",
    homeMoreOrder: 4,
    icon: Baby,
    iconName: "baby",
    kind: "clinic",
    shortDescription:
      "Specialist monitoring and care for twin and multiple pregnancies.",
    image: "/images/services/TwinSpecialisedClinic.webp",
    detail: [
      "Twin and multiple pregnancies need closer monitoring than single pregnancies, especially when the babies share a placenta. Our clinic provides specialised scanning schedules and care tailored to twins.",
      "The team watches for growth differences, fluid imbalance, and the specific complications that twins can develop, and works closely with your obstetrician.",
    ],
    timing: "From the first trimester, with scans usually every 2 to 4 weeks.",
    preparation: "Bring your earlier scan reports so chorionicity can be assessed.",
  },
];

export function formatWeekWindow(w: WeekWindow): string {
  return w.end ? `${w.start} to ${w.end} weeks` : `From ${w.start} weeks`;
}

// `window` display strings derive from `weeks` so card chips, the WeekRail
// and detail pages always agree.
export const services: Service[] = serviceList.map((s) =>
  s.weeks ? { ...s, window: formatWeekWindow(s.weeks) } : s
);

export function servicesByCategory(categoryId: ServiceCategoryId) {
  return services.filter((s) => s.category === categoryId);
}
