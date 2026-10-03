import type { Guide } from "@/types/guide";

// DRAFT FOR MEDICAL REVIEW: the two full guides below reuse only facts that
// already appear on the site (service timings, steps and FAQ answers). The
// medical team must review and set reviewStatus "reviewed" plus
// reviewedBy/reviewedAt before the review badge can render.

export const guides: Guide[] = [
  {
    slug: "downs-screening-oscar",
    title: "Down's screening (OSCAR): what it checks and what the result means",
    excerpt:
      "A combined first trimester screening, usually between 11 and 13+6 weeks, that estimates the chance of chromosomal conditions and is explained to you in person.",
    seo: {
      title: "Down's screening (OSCAR): what it checks",
      description:
        "A combined first trimester screening, usually between 11 and 13+6 weeks, that estimates the chance of chromosomal conditions, explained in person.",
    },
    coverImage: {
      src: "/images/services/downs-screening-oscar.webp",
      alt: "A pregnancy ultrasound on screen during a first trimester screening visit",
    },
    category: "screening-and-tests",
    quickAnswer:
      "OSCAR is a combined screening done between 11 and 13+6 weeks. It brings together an ultrasound measurement of your baby and a blood test, and gives a chance figure for Down's syndrome and other chromosomal conditions. It is a screening test, not a diagnosis.",
    content: [
      {
        type: "paragraph",
        text: "OSCAR stands for One Stop Clinic for Assessment of Risk. It is a combined first trimester screening that looks at the chance of chromosomal conditions such as Down's syndrome. At our centre it is performed or supervised by a fetal medicine specialist, and the result is explained to you in the same visit.",
      },
      { type: "h2", text: "When is OSCAR done?" },
      {
        type: "paragraph",
        text: "The screening window is usually between 11 and 13+6 weeks of pregnancy. If you are unsure about your dates, a viability scan can confirm them first, and our team can help you choose the right week.",
      },
      { type: "h2", text: "What does the screening include?" },
      {
        type: "list",
        ordered: false,
        items: [
          "An ultrasound measurement of the fluid space at the back of the baby's neck (nuchal translucency)",
          "Scan markers such as the baby's nasal bone",
          "Two markers measured in a blood sample taken from the mother's arm",
          "A combined chance figure that is explained to you in person",
        ],
      },
      { type: "h2", text: "What happens on the day?" },
      {
        type: "paragraph",
        text: "The visit has two parts. First a detailed ultrasound measures the baby and the nuchal translucency. Then a small blood sample is taken from your arm. The scan and blood results are combined into a single figure, and the specialist explains what it means before you leave.",
      },
      {
        type: "callout",
        variant: "important",
        title: "Screening is not diagnosis",
        text: "A higher-chance result does not mean the baby has a condition, and a low-chance result cannot rule it out completely. The figure tells you the chance, and the specialist explains what it means for your pregnancy.",
      },
      { type: "h2", text: "What does the result mean?" },
      {
        type: "paragraph",
        text: "Your result is expressed as a chance or risk figure. The table below shows the usual next steps depending on the result.",
      },
      {
        type: "table",
        caption: "What your OSCAR result can lead to",
        headers: ["Result", "What it means", "Usual next step"],
        rows: [
          [
            "Lower chance",
            "The estimated chance is small",
            "Continue routine care; anomaly scan at 18 to 22 weeks",
          ],
          [
            "Higher chance",
            "The estimated chance is higher than the usual cut-off",
            "Counselling and options such as NIPT or diagnostic testing",
          ],
        ],
      },
      {
        type: "paragraph",
        text: "Our in-house counselling means you are not left to work out a higher-chance result alone. The specialist and counsellor explain what the result means and what your options are, and nothing is decided for you.",
      },
      { type: "cta", service: "downs-screening-oscar" },
    ],
    keyTakeaways: [
      "OSCAR combines a scan measurement and a blood test, usually at 11 to 13+6 weeks",
      "It estimates a chance figure; it does not diagnose a condition",
      "A higher chance leads to counselling and options such as NIPT",
      "The result is explained to you in the same visit",
    ],
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
    relatedService: "downs-screening-oscar",
    publishedAt: "2025-09-15",
    featured: true,
    draft: true,
  },
  {
    slug: "anomaly-scan-what-to-expect",
    title: "The anomaly scan: what to expect on the day",
    excerpt:
      "The most detailed ultrasound most pregnancies receive, usually between 18 and 22 weeks, examining your baby's organs, growth and wellbeing.",
    coverImage: {
      src: "/images/services/AnomalyScan.webp",
      alt: "A fetal medicine specialist reviewing a detailed mid-pregnancy scan",
    },
    category: "pregnancy-scans",
    quickAnswer:
      "The anomaly scan is a detailed head-to-toe ultrasound, usually done between 18 and 22 weeks. A fetal medicine specialist checks your baby's brain, heart, spine, limbs, stomach, kidneys, the placenta and the fluid around the baby, and explains the findings in the same visit.",
    content: [
      {
        type: "paragraph",
        text: "The anomaly scan is the most detailed ultrasound most pregnancies receive. It systematically examines your baby and the pregnancy environment, and at our centre every scan is performed or supervised by a fetal medicine specialist.",
      },
      { type: "h2", text: "When is it done?" },
      {
        type: "paragraph",
        text: "Usually between 18 and 22 weeks of pregnancy, when the baby's organs are developed enough to assess clearly. Your referring doctor will suggest the best window for you.",
      },
      { type: "h2", text: "What does the scan check?" },
      {
        type: "table",
        caption: "What the anomaly scan examines",
        headers: ["Area", "What the specialist looks at"],
        rows: [
          ["Head and spine", "The baby's brain, face and spine"],
          ["Heart", "The heart chambers and major blood vessels"],
          ["Body", "The stomach, kidneys and bladder"],
          ["Limbs", "The arms, legs, hands and feet"],
          ["Pregnancy", "The placenta, cord and fluid around the baby"],
        ],
      },
      { type: "h2", text: "What happens during the scan?" },
      {
        type: "list",
        ordered: true,
        items: [
          "The specialist scans the baby from head to toe, system by system.",
          "You can watch on the screen while the findings are pointed out.",
          "If the baby is in a tricky position, you may be asked to walk around and continue after a short break.",
          "The findings are explained to you before you leave.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Allow a little extra time",
        text: "This is the most detailed scan of the pregnancy, so it can take longer than a routine scan, especially if the baby is facing away. No special preparation is needed.",
      },
      { type: "h2", text: "What if a finding needs a closer look?" },
      {
        type: "paragraph",
        text: "You receive a detailed report in the same visit. If a finding needs a closer look, our specialists and counsellors explain what it means and what comes next. Growth scans in the third trimester follow if advised.",
      },
      { type: "cta", service: "anomaly-scan" },
    ],
    keyTakeaways: [
      "The anomaly scan is usually done between 18 and 22 weeks",
      "It checks the baby's organs, limbs, placenta and fluid, system by system",
      "Findings are explained in person, and a detailed report is given the same day",
      "It can take longer than a routine scan, so allow extra time",
    ],
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
    relatedService: "anomaly-scan",
    publishedAt: "2025-10-01",
    draft: true,
  },
];
