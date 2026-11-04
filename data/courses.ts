// DRAFT FOR CLIENT REVIEW: all course names, durations, eligibility,
// highlights, faculty and admissions details below came from the client flyer
// and brief. Confirm every field before launch.
//
// TODO(client): resolve before launch
// - Duration conflict: the old site says Fetal Medicine is 1 year and
//   Advanced Obstetric Ultrasound is 6 months; the flyer says Obstetric
//   Ultrasound is 6 months and gives no duration for the other two.
// - Is the 2 month short course in fetal ultrasound still offered?
// - Should the two day Fetal Ultrasound Intervention workshop be listed?
// - Next intake date (the flyer's Nov 2025 intake is out of date).
// - Fees, stipend, accommodation and number of seats.
// - What certificate is awarded on completion.
// - Whether the 2 publication requirement applies to all three programmes.

export type Course = {
  slug: string;
  number: string;
  title: string;
  duration: string | null;
  durationConfirmed: boolean;
  eligibility: string[];
  enquireSubject: string;
  educationalCredentialConfirmed: boolean;
  image: string | null;
  imageAlt: string;
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
  image: "/images/fellowship/hero-training.webp" as string | null,
  imageAlt:
    "Doctor practising obstetric ultrasound on a pregnancy simulation mannequin while a consultant guides her hand",
  // Real photographs taken at the centre; captions must stay factual.
  realPhotos: [
    {
      src: "/images/cme/simulator-workshop.webp",
      alt: "Group photo of doctors who attended a fetal interventional simulator training at the centre",
      caption: "Fetal Interventional Simulator Training held at the centre",
    },
    {
      src: "/images/cme/cme1.webp",
      alt: "A consultant lecturing to doctors during an education event at the centre",
      caption: "A lecture during an education event at the centre",
    },
  ],
  admissionSteps: [
    {
      title: "Apply online",
      text: "Fill in the training application form and upload your CV.",
    },
    {
      title: "Shortlisting",
      text: "The faculty reviews applications and shortlists candidates.",
    },
    {
      title: "Personal interview",
      text: "Shortlisted candidates are called for a personal interview.",
    },
    {
      title: "Confirmation",
      text: "Your place on the programme is confirmed.",
    },
  ],
  showBrochure: false,
  brochure: {
    image: "/images/courses/fetal-interventions-simulator.webp",
    alt: "Course flyer for Fetal Interventions Simulator Training listing fellowship programmes, hands-on training, faculty, admission by CV and contact details",
  },
} as const;

export type FellowshipFaq = {
  question: string;
  answer: string;
  confirmed: boolean;
};

export const fellowshipFaqs: FellowshipFaq[] = [
  {
    question: "Who can apply for the fellowships?",
    answer:
      "The Fellowship in Fetal Medicine is open to doctors with an MD or DNB in OBG. The Fellowship in Advanced Obstetric Ultrasound and Fetal Echo and the Fellowship in Obstetric Ultrasound also accept doctors with an MD or DNB in Radiology.",
    confirmed: true,
  },
  {
    question: "How do I apply?",
    answer:
      "Apply online through the training application form on this page and upload your CV. You can also call or WhatsApp the centre with questions before you apply.",
    confirmed: true,
  },
  {
    question: "How are candidates selected?",
    answer:
      "Applications are shortlisted by the faculty, and shortlisted candidates are called for a personal interview.",
    confirmed: true,
  },
  {
    question: "What does the training include?",
    answer:
      "Training is hands-on and one-to-one: scanning, fetal echo sessions, fetal and postnatal care, simulator training in fetal interventions and rotational postings in eight allied specialities.",
    confirmed: true,
  },
  {
    question: "Is there a research or publication requirement?",
    answer: fellowshipProgram.publicationsRequirementConfirmedForAll
      ? "A minimum of 2 research publications in indexed journals is required by the end of every programme."
      : "A minimum of 2 research publications in indexed journals is required by the end of the fellowship.",
    confirmed: true,
  },
  // TODO(client): confirm each answer below and set confirmed: true.
  {
    question: "What are the fees?",
    answer:
      "Fees are not published on the website. Please call or email the centre for the current fee details.",
    confirmed: false,
  },
  {
    question: "When is the next intake?",
    answer:
      "The next intake date is shared directly with applicants. Call the centre for the current schedule.",
    confirmed: false,
  },
  {
    question: "What certificate is awarded?",
    answer:
      "Details of the certificate awarded on completion are shared by the centre on enquiry.",
    confirmed: false,
  },
];

export const courseQualificationOptions = [
  { value: "md-obg", label: "MD OBG" },
  { value: "dnb-obg", label: "DNB OBG" },
  { value: "ms-obg", label: "MS OBG" },
  { value: "dgo", label: "DGO" },
  { value: "md-radiology", label: "MD Radiology" },
  { value: "dnb-radiology", label: "DNB Radiology" },
  { value: "other", label: "Other" },
] as const;

export const traineeStatusOptions = [
  { value: "completed", label: "Completed" },
  { value: "final-year", label: "Final year postgraduate" },
] as const;

export const ultrasoundExperienceOptions = [
  { value: "none", label: "None" },
  { value: "under-1-year", label: "Under 1 year" },
  { value: "1-to-3-years", label: "1 to 3 years" },
  { value: "3-to-5-years", label: "3 to 5 years" },
  { value: "over-5-years", label: "Over 5 years" },
] as const;

export const heardFromOptions = [
  { value: "colleague", label: "Colleague" },
  { value: "social-media", label: "Social media" },
  { value: "google-search", label: "Google search" },
  { value: "cme-conference", label: "CME or conference" },
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
    image: "/images/fellowship/course-fetal-medicine.webp",
    imageAlt: "Two doctors reviewing an ultrasound scan on a monitor",
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
    image: "/images/fellowship/course-fetal-echo.webp",
    imageAlt:
      "A gloved hand holding an ultrasound probe beside a monitor showing a colour Doppler scan",
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
    image: "/images/fellowship/course-obstetric-ultrasound.webp",
    imageAlt: "Hands adjusting the control panel of an ultrasound console",
  },
];
