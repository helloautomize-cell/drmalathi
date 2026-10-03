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
// source; card chips, the home WeekRail and `window` strings all derive from
// it, so they can never disagree. Week chips and the WeekRail render only
// while SHOW_DRAFT_WEEK_WINDOWS is true; set it false to hide all week UI
// until the medical team signs off.
export const SHOW_DRAFT_WEEK_WINDOWS = true;

/** Inclusive gestational-week window; `end` omitted = "from N weeks" onward. */
export type WeekWindow = { start: number; end?: number };

export type ServiceFaq = { question: string; answer: string };

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
  // DRAFT FOR MEDICAL REVIEW: the detail-page fields below are new
  // plain-language copy and must be reviewed by the medical team before
  // launch. No statistics, prices or success rates are stated.
  whoFor?: string[];
  whatItChecks?: string[];
  steps?: string[];
  reportAndNextSteps?: string;
  /** Doctor slugs (see data/doctors.ts) for the "Your doctors" section. */
  performedBy?: string[];
  faqs?: ServiceFaq[];
  // Expanded sections filled only from the doctors' answers to
  // docs/CONTENT-REQUESTS.md. Each renders only while populated; nothing is
  // invented to reach a word count.
  /** Practicalities of the visit: duration, scan approach, family attendance. */
  visitNotes?: string[];
  /** Result format and turnaround: what the patient receives, and when. */
  resultsDetail?: string[];
  /** What the service does not cover or cannot adjudicate. */
  limits?: string[];
  /** Referrals and coordination with other specialists after a finding. */
  followUp?: string[];
  /** ISO date the service copy last changed; used for sitemap lastmod. */
  lastModified: string;
  /** Meta description, 140 to 155 characters, kept in range by check:content. */
  seoDescription: string;
};

const serviceList: Service[] = [
  // Screening Scans
  {
    slug: "viability-scan",
    lastModified: "2026-10-03",
    seoDescription:
      "An early pregnancy scan that confirms the pregnancy is in the right place and checks for your baby's heartbeat, usually from 6 to 10 weeks of pregnancy.",
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
    whoFor: [
      "Anyone who has just found out they are pregnant and wants early confirmation",
      "Women with early bleeding or pain who need reassurance",
      "Pregnancies after IVF or other fertility treatment",
      "Anyone with a previous ectopic pregnancy or early loss",
    ],
    whatItChecks: [
      "That the pregnancy is growing inside the womb",
      "Whether the baby's heartbeat has started",
      "How many babies are present",
      "A first estimate of how far along the pregnancy is",
    ],
    steps: [
      "You check in and share any earlier reports or referral notes.",
      "The specialist performs the scan and explains what you see on the screen.",
      "For very early pregnancies an internal scan may be suggested for a clearer view, only with your consent.",
      "You receive your report and the plan for your next scan before you leave.",
    ],
    reportAndNextSteps:
      "You receive your report in the same visit. If all is well, the usual next step is OSCAR screening between 11 and 14 weeks. If anything needs a closer look, the specialist explains your options calmly.",
    performedBy: ["dr-malathi-g-prasad", "dr-revathy-chandrasekharan"],
    faqs: [
      {
        question: "Is the scan internal or over the tummy?",
        answer:
          "Usually it is done over the tummy. Very early in pregnancy the baby may be too small to see clearly that way, so the specialist may suggest an internal scan. It is only done with your consent.",
      },
      {
        question: "Is the scan safe for my baby?",
        answer:
          "Ultrasound has been used in pregnancy for decades and is considered safe when performed by trained specialists.",
      },
      {
        question: "What if the heartbeat is not seen yet?",
        answer:
          "Very early in pregnancy it can simply be too soon. The specialist will explain what the scan shows and whether a follow-up scan a short while later is needed.",
      },
      {
        question: "Do I need a full bladder?",
        answer:
          "A comfortably full bladder can help in very early scans. You do not need to be uncomfortably full.",
      },
    ],
  },
  {
    slug: "downs-screening-oscar",
    lastModified: "2026-10-03",
    seoDescription:
      "A combined first trimester screening that assesses the chance of Down's syndrome and other chromosomal conditions, usually between 11 and 13+6 weeks.",
    name: "Down's Screening (OSCAR)",
    category: "screening",
    icon: ClipboardCheck,
    iconName: "clipboardCheck",
    kind: "scan",
    shortDescription:
      "A combined first trimester screening that assesses the chance of Down's syndrome and other chromosomal conditions.",
    image: "/images/services/downs-screening-oscar.webp",
    weeks: { start: 11, end: 14 },
    detail: [
      "OSCAR is a combined first trimester screening that brings together a detailed ultrasound measurement of your baby and a simple blood test from the mother.",
      "The result is expressed as a chance or risk figure, which the doctor explains clearly. It is a screening test, not a diagnosis, and a high chance result does not mean your baby definitely has a condition.",
    ],
    timing: "Usually between 11 and 13+6 weeks of pregnancy.",
    preparation: "No special preparation is needed.",
    whoFor: [
      "Any pregnancy wanting first trimester screening",
      "Women who will be 35 or over at delivery",
      "Anyone with a previous pregnancy or family history of a chromosomal condition",
    ],
    whatItChecks: [
      "The fluid space at the back of the baby's neck (nuchal translucency)",
      "Scan markers such as the baby's nasal bone",
      "Two markers measured in a blood sample from the mother",
      "A combined chance figure, explained to you in person",
    ],
    steps: [
      "A detailed ultrasound measures the baby and the nuchal translucency.",
      "A small blood sample is taken from the mother's arm.",
      "The scan and blood results are combined into a chance figure.",
      "The specialist explains what the figure means for your pregnancy.",
    ],
    reportAndNextSteps:
      "Your combined result is explained in the same visit. If the chance is low, the usual next step is the anomaly scan between 18 and 22 weeks. If the chance is higher, our in-house counselling helps you understand options such as NIPT or diagnostic testing.",
    performedBy: ["dr-malathi-g-prasad", "dr-revathy-chandrasekharan"],
    faqs: [
      {
        question: "Is OSCAR a diagnosis?",
        answer:
          "No. It is a screening test that estimates the chance of a condition. A higher-chance result does not mean the baby has the condition, and a low-chance result cannot rule it out completely.",
      },
      {
        question: "What happens if my result shows a higher chance?",
        answer:
          "The specialist and our in-house counsellor explain the result and the options, which may include NIPT or a diagnostic test. Nothing is decided for you.",
      },
      {
        question: "Does it hurt the baby?",
        answer:
          "No. The ultrasound is like any other pregnancy scan, and the blood sample is taken from the mother's arm.",
      },
      {
        question: "What if I miss the window?",
        answer:
          "The combined test works in the first trimester. If that window has passed, the specialist will explain which second trimester options remain.",
      },
    ],
  },
  {
    slug: "first-trimester-anomaly-scan",
    lastModified: "2026-10-03",
    seoDescription:
      "A detailed early scan that checks your baby's development and can identify major findings in the first trimester itself, at our Trichy centre.",
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
    whoFor: [
      "Parents who want a detailed early check of the baby's development",
      "Pregnancies where an earlier scan or history raises a question",
      "Often done in the same visit as OSCAR screening",
    ],
    whatItChecks: [
      "The baby's brain, spine, heart and major organs",
      "The baby's limbs, tummy wall and cord insertion",
      "The placenta and the fluid around the baby",
      "Early signs of structural conditions, while there is still time to plan",
    ],
    steps: [
      "The specialist performs a detailed, head-to-toe survey of the baby.",
      "Findings are pointed out on the screen as the scan proceeds.",
      "If the baby is not in a helpful position, part of the scan may be repeated after a short break.",
      "You receive a detailed report and the plan for your next scan.",
    ],
    reportAndNextSteps:
      "You receive a detailed report in the same visit. Even when everything looks normal, the anomaly scan between 18 and 22 weeks is still recommended because some structures are best seen later.",
    performedBy: ["dr-malathi-g-prasad", "dr-revathy-chandrasekharan"],
    faqs: [
      {
        question: "Does this replace the 18 to 22 week anomaly scan?",
        answer:
          "No. This early survey finds many conditions sooner, but some parts of the baby are still too small to assess fully. The mid-pregnancy anomaly scan is still recommended.",
      },
      {
        question: "How long does it take?",
        answer:
          "It is a detailed scan, so it can take a little longer than a routine scan, especially if the baby is not in a helpful position.",
      },
      {
        question: "Can it be done in the same visit as OSCAR?",
        answer:
          "Yes. It is often combined with the OSCAR visit when the timing suits your pregnancy.",
      },
    ],
  },
  {
    slug: "anomaly-scan",
    lastModified: "2026-10-03",
    seoDescription:
      "The detailed mid-pregnancy scan that examines your baby's organs, growth and wellbeing, usually between 18 and 22 weeks, at our Trichy centre.",
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
    whoFor: [
      "Every pregnancy; it is the standard detailed mid-pregnancy check",
      "Pregnancies after IVF or other fertility treatment",
      "Anyone with a previous baby affected by a structural condition",
      "When another scan or blood test has raised a question",
    ],
    whatItChecks: [
      "The baby's brain, face and spine",
      "The heart chambers and major blood vessels",
      "The stomach, kidneys and bladder",
      "The arms, legs, hands and feet",
      "The placenta, cord and the fluid around the baby",
    ],
    steps: [
      "The specialist scans the baby from head to toe, system by system.",
      "You can watch on the screen while the findings are pointed out.",
      "If the baby is in a tricky position, you may be asked to walk around and continue after a short break.",
      "The findings are explained to you before you leave.",
    ],
    reportAndNextSteps:
      "You receive a detailed report in the same visit. If a finding needs a closer look, our specialists and counsellors explain what it means and what comes next. Growth scans in the third trimester follow if advised.",
    performedBy: ["dr-malathi-g-prasad", "dr-revathy-chandrasekharan"],
    faqs: [
      {
        question: "How long does the scan take?",
        answer:
          "It is the most detailed scan of the pregnancy, so allow a little more time than a routine scan. If the baby is facing away, part of it may be finished after a short break.",
      },
      {
        question: "Can my partner come in?",
        answer:
          "Partners are welcome to be present. Check with the front desk on the day for the current policy.",
      },
      {
        question: "What if something is found?",
        answer:
          "The specialist explains what the finding means straight away. Where needed, our in-house counselling and multidisciplinary panel help you plan the next steps.",
      },
      {
        question: "Is a 3D or 4D picture part of it?",
        answer:
          "3D or 4D views may be used when they help assess the baby, but the medical check is what matters.",
      },
    ],
  },
  {
    slug: "growth-scan-doppler",
    lastModified: "2026-10-03",
    seoDescription:
      "A scan that tracks your baby's growth, blood flow and wellbeing in the third trimester, especially when growth needs watching, at our Trichy centre.",
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
    whoFor: [
      "Every pregnancy in the third trimester, as advised by your doctor",
      "When the baby seems small or a previous baby was small",
      "Mothers with diabetes, high blood pressure, or twins",
      "If the baby's movements feel reduced",
    ],
    whatItChecks: [
      "The baby's estimated weight and growth pattern",
      "The fluid around the baby",
      "The placenta and where it sits",
      "Blood flow in the cord and the baby's vessels (Doppler)",
    ],
    steps: [
      "The specialist measures the baby and checks the fluid and placenta.",
      "Doppler readings check blood flow in the cord and the baby's vessels.",
      "Findings are compared with your earlier scans where available.",
      "The report and any follow-up plan are explained before you leave.",
    ],
    reportAndNextSteps:
      "You receive your report in the same visit, with a follow-up interval if one is advised. If growth or blood flow raises a question, the specialist discusses monitoring with you and your obstetrician.",
    performedBy: ["dr-malathi-g-prasad", "dr-revathy-chandrasekharan"],
    faqs: [
      {
        question: "How often will I need this scan?",
        answer:
          "That depends on what the scan shows and your doctor's advice. Some pregnancies need only one growth scan; others are watched more closely.",
      },
      {
        question: "Does Doppler harm the baby?",
        answer:
          "Doppler ultrasound is a standard part of pregnancy care and is used to check blood flow to the baby.",
      },
      {
        question: "What if the baby looks small?",
        answer:
          "The specialist explains whether the measurements sit within the expected range and whether closer monitoring or other checks are suggested.",
      },
    ],
  },

  // Advanced Diagnostics
  {
    slug: "nipt",
    lastModified: "2026-10-03",
    seoDescription:
      "A simple blood test from the mother that screens for common chromosomal conditions, usually from 10 weeks of pregnancy, at our Trichy centre.",
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
    whoFor: [
      "Any pregnancy wanting early screening for common chromosomal conditions",
      "Pregnancies where another screening test has shown a higher chance",
      "Women advised screening by their doctor",
    ],
    whatItChecks: [
      "Fragments of the baby's DNA that naturally circulate in the mother's blood",
      "The common chromosomal conditions, including Down's syndrome",
    ],
    steps: [
      "The counsellor or specialist explains what NIPT can and cannot tell you.",
      "A single blood sample is taken from the mother's arm.",
      "The sample is analysed by the laboratory.",
      "We contact you to explain the result when it is ready.",
    ],
    reportAndNextSteps:
      "The laboratory sends the result to us and we contact you to explain it. A lower-chance result is usually reassuring news; a higher-chance result is discussed with counselling and the option of diagnostic testing.",
    performedBy: ["dr-malathi-g-prasad", "dr-revathy-chandrasekharan"],
    faqs: [
      {
        question: "Is NIPT safe for the baby?",
        answer:
          "Yes. It is a blood test from the mother's arm, so there is no risk to the baby.",
      },
      {
        question: "Does a normal NIPT mean everything is fine?",
        answer:
          "NIPT is a screening test for specific chromosomal conditions. It does not check the baby's anatomy, so scans such as the anomaly scan are still needed.",
        // DRAFT FOR MEDICAL REVIEW
      },
      {
        question: "When can it be done?",
        answer:
          "From 10 weeks of pregnancy onward, once dating has been confirmed.",
      },
    ],
  },
  {
    slug: "fetal-echo",
    lastModified: "2026-10-03",
    seoDescription:
      "A focused ultrasound of your baby's heart that checks its structure, function and rhythm in detail, performed at our Trichy fetal medicine centre.",
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
      "A fetal echo is an ultrasound focused only on your baby's heart. It examines the heart's structure, its four chambers, the major blood vessels, and the rhythm in much more detail than a routine scan.",
      "It is usually recommended when there is a family history of heart conditions, a finding on another scan, diabetes in the mother, or certain infections.",
    ],
    timing: "Usually between 18 and 24 weeks of pregnancy.",
    preparation: "No special preparation is needed.",
    whoFor: [
      "Babies with a heart question raised on another scan",
      "A family history of a heart condition",
      "Mothers with diabetes or certain infections in pregnancy",
      "Twin or IVF pregnancies, when advised",
    ],
    whatItChecks: [
      "The four chambers of the baby's heart",
      "The heart valves and the major blood vessels",
      "The heart's rhythm and how blood flows through it",
      "The heart's position and connections",
    ],
    steps: [
      "The specialist performs a focused ultrasound of the baby's heart.",
      "The heart is examined from several angles, so the scan can take a little longer.",
      "Findings are explained to you in the same visit.",
      "A plan for follow-up or delivery care is discussed if needed.",
    ],
    reportAndNextSteps:
      "You receive the report in the same visit. When a heart condition is found, we explain what it means and help coordinate care with paediatric cardiology and your obstetrician.",
    performedBy: ["dr-malathi-g-prasad", "dr-revathy-chandrasekharan"],
    faqs: [
      {
        question: "Is it different from the anomaly scan?",
        answer:
          "Yes. The anomaly scan checks the whole baby including a basic look at the heart. A fetal echo examines the heart alone, in much greater detail.",
      },
      {
        question: "If a heart problem is found, what next?",
        answer:
          "The specialist explains the finding, and we help plan follow-up scans and link you with paediatric heart specialists where needed.",
      },
    ],
  },
  {
    slug: "fetal-neurosonogram",
    lastModified: "2026-10-03",
    seoDescription:
      "A detailed scan of your baby's brain and spine for conditions affecting the nervous system, performed by a fetal medicine specialist in Trichy.",
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
      "A fetal neurosonogram is a specialist examination of your baby's brain and spine. Our centre was the first in Tamil Nadu to offer this neurosonogram service.",
      "It is advised when another scan raises a question about the baby's brain, when there is a relevant family history, or after certain infections in pregnancy.",
    ],
    timing: "When advised by your referring doctor or our specialists.",
    preparation: "Bring all previous scan reports so the specialist has the full picture.",
    whoFor: [
      "Babies with a brain or spine finding on another scan",
      "A family history of a neurological condition",
      "After certain infections in pregnancy",
      "Follow-up of ventriculomegaly or similar findings",
    ],
    whatItChecks: [
      "The detailed structure of the baby's brain",
      "The ventricles, cerebellum and midline structures",
      "The spine and its coverings",
      "Changes over time, compared with your earlier scans",
    ],
    steps: [
      "The specialist performs a detailed scan of the baby's brain and spine.",
      "Different scanning angles are used, and an internal scan may occasionally help, only with your consent.",
      "Findings are reviewed and explained in the same visit.",
      "A plan for follow-up or further review is agreed with you.",
    ],
    reportAndNextSteps:
      "Findings are explained in person and a report is provided. Where a condition is suspected, our counselling team helps the family understand the picture and the choices ahead.",
    performedBy: ["dr-malathi-g-prasad"],
    faqs: [
      {
        question: "Why was I referred for this scan?",
        answer:
          "Usually because a routine scan raised a question about the baby's brain or spine, or because of a relevant history. It is a specialist second look, not a verdict.",
      },
      {
        question: "Is it an internal scan?",
        answer:
          "It is usually done over the tummy. When the baby's head is low, an internal scan can give a clearer view and may be suggested with your consent.",
      },
    ],
  },
  {
    slug: "second-opinion-scan",
    lastModified: "2026-10-03",
    seoDescription:
      "A careful repeat scan and report review when you want reassurance or a specialist second look at a finding, at our Trichy centre in Thillai Nagar.",
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
      "A second opinion can confirm a finding, clarify what it means, or occasionally change the picture. Either way, the specialist goes through the findings and your options with you.",
    ],
    timing: "At any stage of pregnancy, subject to what is being assessed.",
    preparation: "Please bring all previous scan reports, images, and medical records.",
    whoFor: [
      "Families with a scan report from elsewhere they want reviewed",
      "Anyone who wants reassurance before a decision",
      "Referrals from doctors who want a specialist view",
    ],
    whatItChecks: [
      "A fresh, careful look at the area in question",
      "Your existing reports and images alongside the new scan",
      "A plain-language explanation of whether the findings agree",
    ],
    steps: [
      "Bring your earlier reports and images to your visit.",
      "The specialist reviews them and then performs a fresh scan.",
      "The new findings are compared with your earlier report.",
      "You discuss what the findings mean and the options open to you.",
    ],
    reportAndNextSteps:
      "You leave with a written specialist report and a clear explanation of whether the earlier findings are confirmed or changed, plus the options open to you.",
    performedBy: ["dr-malathi-g-prasad", "dr-revathy-chandrasekharan"],
    faqs: [
      {
        question: "What should I bring?",
        answer:
          "All earlier scan reports, images and medical records, plus your referral letter if you have one.",
      },
      {
        question: "Will the result differ from my first scan?",
        answer:
          "Sometimes it confirms the finding, sometimes it adds detail, and occasionally it changes the picture. Either way, you get an honest specialist view.",
      },
    ],
  },

  // Specialty Clinics
  {
    slug: "genetic-counselling",
    lastModified: "2026-10-03",
    seoDescription:
      "In-house counselling that explains test results, family history and inheritance in clear language, so you can plan your next steps together.",
    name: "Genetic Counselling",
    category: "clinics",
    homeMoreOrder: 1,
    icon: Users,
    iconName: "users",
    kind: "clinic",
    shortDescription:
      "In-house counselling that explains results, inheritance, and your options in clear language.",
    image: "/images/services/genetic-counselling.webp",
    detail: [
      "Our centre was the first in the region to offer in-house genetic counselling. A genetic counsellor or specialist explains test results, family history, inheritance, and what the findings mean for your baby and future pregnancies.",
      "Counselling is a conversation, not a test. You leave with clear information and time to decide the next step that is right for your family.",
    ],
    timing: "Before or after a screening test, or when advised by your doctor.",
    preparation: "Bring family history details and any earlier reports.",
    whoFor: [
      "Families with a higher-chance screening result",
      "A family history of a genetic condition",
      "Parents who are related by blood",
      "A previous child or pregnancy affected by a condition",
      "Repeated pregnancy loss",
    ],
    whatItChecks: [
      "A review of your family and medical history",
      "What test results mean, and what they do not mean",
      "How a condition may be inherited",
      "The options open to you, explained without pressure",
    ],
    steps: [
      "You sit down with the counsellor or specialist for a session with time for your questions.",
      "Your history, reports and family details are discussed.",
      "The counsellor explains each option and what it involves.",
      "You decide the next step, with time to think.",
    ],
    reportAndNextSteps:
      "You leave with a clear summary of what was discussed and a suggested plan. If testing is chosen, our team coordinates it within the centre.",
    performedBy: ["dr-malathi-g-prasad", "dr-revathy-chandrasekharan"],
    faqs: [
      {
        question: "Is counselling a test?",
        answer:
          "No. It is a conversation about results, history and options. Nothing is done without your consent.",
      },
      {
        question: "Should my partner or a family member come too?",
        answer:
          "If the discussion involves family history or shared decisions, bringing your partner or a family member can help.",
      },
      {
        question: "Do I have to decide anything on the day?",
        answer:
          "No. Counselling gives you information and time. Decisions are yours to make.",
      },
    ],
  },
  {
    slug: "fetal-postmortem",
    lastModified: "2026-10-03",
    seoDescription:
      "A specialist evaluation after pregnancy loss that helps families understand what happened and plan future care with the medical team in Trichy.",
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
    whoFor: [
      "Families who have sadly lost a pregnancy and want to understand why",
      "When the doctors feel the answers may help plan a future pregnancy",
    ],
    whatItChecks: [
      "A careful specialist evaluation after a pregnancy loss",
      "Findings that may help explain what happened",
      "Information that can guide care in a future pregnancy",
    ],
    steps: [
      "Our team explains privately what the evaluation involves.",
      "It is carried out only with the family's consent.",
      "Findings are gathered carefully and respectfully.",
      "The specialist meets the family to discuss what was found.",
    ],
    reportAndNextSteps:
      "The findings are discussed with you privately, along with what they may mean for a future pregnancy and any follow-up that could help.",
    performedBy: ["dr-malathi-g-prasad"],
    faqs: [
      {
        question: "Is this compulsory?",
        answer:
          "No. It is entirely your choice, and our team will support you either way.",
      },
      {
        question: "Will it tell us why we lost the baby?",
        answer:
          "It can provide answers in some cases and useful information in many others, though not every question has an answer. The specialist will be honest about what it can and cannot show.",
      },
      {
        question: "Who can we talk to about it?",
        answer:
          "Our specialists and counsellors can talk it through with you privately before you decide.",
      },
    ],
  },
  {
    slug: "recurrent-miscarriages-clinic",
    lastModified: "2026-10-03",
    seoDescription:
      "A clinic that investigates repeated pregnancy loss, looks for treatable causes and plans monitored care for your next pregnancy, in Trichy.",
    name: "Recurrent Miscarriages Clinic",
    category: "clinics",
    homeMoreOrder: 5,
    icon: Repeat,
    iconName: "repeat",
    kind: "clinic",
    shortDescription:
      "A clinic that investigates repeated pregnancy loss and plans care for your next pregnancy.",
    image: "/images/services/RecurrentMiscarriagesClinic.webp",
    detail: [
      "Recurrent miscarriage is exhausting and heartbreaking. We review your history, investigates possible causes, and plans monitored care for your next pregnancy.",
      "You are seen by specialists who understand both the medical and emotional side of pregnancy loss.",
    ],
    timing: "Before or early in a subsequent pregnancy.",
    preparation: "Bring earlier pregnancy records and test results if you have them.",
    whoFor: [
      "Women who have had two or more pregnancy losses",
      "A later loss or a previous complicated pregnancy",
      "Couples planning a pregnancy after repeated losses",
    ],
    whatItChecks: [
      "A careful review of your pregnancy and medical history",
      "Targeted tests where they may help find a cause",
      "A monitored plan for your next pregnancy",
    ],
    steps: [
      "Your history and earlier records are reviewed in detail.",
      "Tests are suggested only where they may give useful answers.",
      "Findings are explained and a plan is agreed together.",
      "Early monitoring is arranged in your next pregnancy.",
    ],
    reportAndNextSteps:
      "You leave with a clear plan: which checks mattered, what the next pregnancy will look like, and how closely you will be monitored.",
    performedBy: ["dr-malathi-g-prasad", "dr-revathy-chandrasekharan"],
    faqs: [
      {
        question: "How many losses count as recurrent miscarriage?",
        answer:
          "Clinics usually see women after two or more losses, but you are welcome earlier if you are worried. Your history matters more than the number.",
      },
      {
        question: "Will tests find a cause?",
        answer:
          "In some cases a cause is found and can be treated; in others no clear cause shows up, but careful monitoring still supports the next pregnancy.",
      },
      {
        question: "Can I come before I am pregnant again?",
        answer:
          "Yes, and it is often the best time, because the plan can be ready before the next pregnancy begins.",
      },
    ],
  },
  {
    slug: "twin-specialised-clinic",
    lastModified: "2026-10-03",
    seoDescription:
      "Specialist monitoring, scanning schedules and care for twin and multiple pregnancies from the first trimester onwards, at our Trichy centre.",
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
      "Twin and multiple pregnancies need closer monitoring than single pregnancies, especially when the babies share a placenta. Our clinic provides specialised scanning schedules and care plans for twins.",
      "The team watches for growth differences, fluid imbalance, and the specific complications that twins can develop, and works closely with your obstetrician.",
    ],
    timing: "From the first trimester, with scans usually every 2 to 4 weeks.",
    preparation: "Bring your earlier scan reports so chorionicity can be assessed.",
    whoFor: [
      "Twins, triplets or other multiple pregnancies",
      "Twins that share a placenta",
      "A history of complications in a twin pregnancy",
      "Multiple pregnancies after fertility treatment",
    ],
    whatItChecks: [
      "Whether the babies share a placenta (chorionicity)",
      "Each baby's growth and wellbeing",
      "The fluid around each baby",
      "Signs of twin-specific complications such as twin-to-twin transfusion",
    ],
    steps: [
      "An early scan establishes the chorionicity of the twins.",
      "A personalised schedule of scans is planned for the pregnancy.",
      "Each visit tracks both babies' growth, fluid and blood flow.",
      "Delivery planning is coordinated with your obstetrician.",
    ],
    reportAndNextSteps:
      "You receive a report at each visit and a clear monitoring schedule. If any twin-specific complication appears, the specialist explains it and the options promptly.",
    performedBy: ["dr-revathy-chandrasekharan", "dr-malathi-g-prasad"],
    faqs: [
      {
        question: "How often will I need scans?",
        answer:
          "Twin pregnancies are scanned more often than single ones. The interval depends on whether the babies share a placenta and how they are growing.",
      },
      {
        question: "What is chorionicity?",
        answer:
          "Whether the twins share a placenta or each have their own. It is best assessed early and shapes how closely we monitor the pregnancy.",
      },
      {
        question: "Do you work with my obstetrician?",
        answer:
          "Yes. We coordinate monitoring and findings with the doctor who will deliver your babies.",
      },
    ],
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

const weekMidpoint = (w: WeekWindow) => (w.start + (w.end ?? w.start)) / 2;

/**
 * Related services: nearest neighbours by week window for timed services,
 * otherwise services in the same category.
 */
export function relatedServices(service: Service, count = 3): Service[] {
  const others = services.filter((s) => s.slug !== service.slug);
  if (service.weeks) {
    const mid = weekMidpoint(service.weeks);
    return others
      .filter((s) => s.weeks)
      .sort(
        (a, b) =>
          Math.abs(weekMidpoint(a.weeks as WeekWindow) - mid) -
          Math.abs(weekMidpoint(b.weeks as WeekWindow) - mid)
      )
      .slice(0, count);
  }
  return others.filter((s) => s.category === service.category).slice(0, count);
}
