// DRAFT FOR CLIENT REVIEW: all course names, durations, eligibility,
// highlights, faculty and admissions details below came from the client flyer
// and brief. Confirm every field before launch.

export type Course = {
  slug: string;
  number: string;
  title: string;
  duration: string | null;
  durationConfirmed: boolean;
  eligibility: string[];
  enquireSubject: string;
  educationalCredentialConfirmed: boolean;
};

export const fellowshipProgram = {
  programName: "Fetal Interventions Simulator Training",
  faculty: [
    {
      role: "Course Director",
      name: "Dr Malathi G. Prasad",
      qualifications: "MD, FRCOG (UK)",
      doctorSlug: "dr-malathi-g-prasad",
    },
    {
      role: "Course Faculty",
      name: "Dr Revathy Chandrasekharan",
      qualifications: "MS (O&G)",
      doctorSlug: "dr-revathy-chandrasekharan",
    },
  ],
  sharedHighlights: [
    "Integrated course structure",
    "Extensive direct hands-on training for each candidate",
    "Hands-on training in fetal interventions",
    "Fetal echo sessions",
    "One-to-one training in fetal and postnatal care",
    "Rotational postings in eight allied specialities related to fetal care",
    "Minimum of 2 research publications in indexed journals by course end",
  ],
  publicationsRequirementConfirmedForAll: false,
  admissions: {
    process:
      "Apply by sending a CV. Shortlisted candidates are called for a personal interview.",
    email: "fmc.trichy@gmail.com",
    phone: "+91 94433 89193",
    phoneHref: "tel:+919443389193",
    intakeDate: null as string | null,
  },
  image: null as string | null,
  imageAlt:
    "Doctor receiving hands-on training in obstetric ultrasound using an ultrasound console",
  showBrochure: false,
  brochure: {
    image: "/images/courses/fetal-interventions-simulator.webp",
    alt: "Course flyer for Fetal Interventions Simulator Training listing fellowship programmes, hands-on training, faculty, admission by CV and contact details",
  },
} as const;

export const courseQualificationOptions = [
  { value: "md-obg", label: "MD OBG" },
  { value: "dnb-obg", label: "DNB OBG" },
  { value: "md-radiology", label: "MD Radiology" },
  { value: "dnb-radiology", label: "DNB Radiology" },
  { value: "other", label: "Other" },
] as const;

export const courses: Course[] = [
  {
    slug: "fellowship-fetal-medicine",
    number: "01",
    title: "Fellowship in Fetal Medicine",
    duration: null,
    durationConfirmed: false,
    eligibility: ["MD/DNB in OBG"],
    enquireSubject: "Fellowship in Fetal Medicine",
    educationalCredentialConfirmed: false,
  },
  {
    slug: "fellowship-advanced-obstetric-ultrasound-fetal-echo",
    number: "02",
    title: "Fellowship in Advanced Obstetric Ultrasound and Fetal Echo",
    duration: "1 year",
    durationConfirmed: false,
    eligibility: ["MD/DNB in OBG", "MD/DNB in Radiology"],
    enquireSubject:
      "Fellowship in Advanced Obstetric Ultrasound and Fetal Echo",
    educationalCredentialConfirmed: false,
  },
  {
    slug: "fellowship-obstetric-ultrasound",
    number: "03",
    title: "Fellowship in Obstetric Ultrasound",
    duration: "6 months",
    durationConfirmed: true,
    eligibility: ["MD/DNB in OBG", "MD/DNB in Radiology"],
    enquireSubject: "Fellowship in Obstetric Ultrasound",
    educationalCredentialConfirmed: false,
  },
];
