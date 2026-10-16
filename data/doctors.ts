// DRAFT FOR CLIENT REVIEW: all doctor facts below were transcribed from the
// current FMC doctors page and the client brief. Confirm every field before launch.

export type DoctorExpertise = {
  label: string;
  serviceSlug?: string;
};

export type Doctor = {
  slug: string;
  name: string;
  role: string;
  roleIsPlaceholder?: boolean;
  qualifications: string[];
  highlights: string[];
  trainedAt: string[];
  expertise: DoctorExpertise[];
  award?: string;
  photo: string;
  photoFocus: { x: number; y: number };
  /** "contain" pins a transparent cutout to the frame bottom instead of
      cover-cropping. */
  photoFit?: "contain";
  /** Overrides the default "Portrait of <name>" alt text. */
  photoAlt?: string;
  hasProfile: boolean;
  mentors?: string[];
  background?: string[];
  // Typed-null fields: render nothing while empty; fill from client data.
  /** Medical council registration; required by NMC guidelines. */
  registration: { council: string; number: string } | null;
  /** First year in practice, used for "X years of experience" copy. */
  experienceSinceYear: number | null;
  /** Languages the doctor consults in. */
  languages: string[];
  /** Professional memberships (e.g. FMF, FOGSI). */
  memberships: string[];
  /** Structured qualifications: degree + institution + year. */
  qualificationsDetailed: {
    degree: string;
    institution: string;
    year?: number;
  }[];
  // Expanded fields filled only from the doctor's answers to
  // docs/CONTENT-REQUESTS.md. Each renders only while populated.
  /** Fellowship, observership or teaching posts (institution + years). */
  trainingPosts: {
    post: string;
    institution: string;
    years?: string;
  }[];
  /** Clinical areas the doctor personally leads, in their words. */
  clinicalFocus: string[];
  /** What the doctor wants a patient to feel after meeting them. */
  patientNote: string | null;
  /** ISO date the profile copy last changed; used for sitemap lastmod. */
  lastModified: string;
  /** Meta description, 140 to 155 characters. */
  seoDescription?: string;
};

export const doctors: Doctor[] = [
  {
    slug: "dr-malathi-g-prasad",
    lastModified: "2026-10-03",
    seoDescription:
      "Dr Malathi G. Prasad, Managing Director and Lead Consultant at Trichy Fetal Medicine and Fertility Centre, Trichy. MD, FRCOG (UK), FMF diploma.",
    name: "Dr Malathi G. Prasad",
    role: "Managing Director and Lead Consultant",
    qualifications: ["MD", "FRCOG (UK)", "Diploma in Fetal Medicine (FMF)"],
    highlights: [
      "14 years in fetal medicine",
      "National faculty, fetal medicine conferences",
      "Fetoscopic laser trained, St George's UK",
    ],
    trainedAt: [
      "Fetal Medicine Foundation",
      "St George's, London",
      "King's College London",
      "Tel Aviv (fetal neurosonography)",
    ],
    expertise: [
      { label: "Fetal Neurosonogram", serviceSlug: "fetal-neurosonogram" },
      { label: "Fetoscopic procedures" },
      { label: "Invasive procedures (amniocentesis, CVS)" },
    ],
    photo: "/images/brand/doctor-malathi-900.webp",
    photoFocus: { x: 50, y: 15 },
    photoFit: "contain",
    photoAlt: "Dr Malathi G. Prasad, Lead Consultant in Fetal Medicine",
    hasProfile: true,
    registration: null,
    experienceSinceYear: null,
    languages: [],
    memberships: [],
    qualificationsDetailed: [],
    trainingPosts: [],
    clinicalFocus: [],
    patientNote: null,
    mentors: ["Prof Basky Thilaganathan", "Prof Nicolaides"],
    background: [
      "Dr Malathi completed her MD at Kilpauk Medical College and served for five years as Assistant Professor of Obstetrics and Gynaecology.",
      "She completed MRCOG followed by FRCOG.",
      "She runs workshops and master classes and has trained many fetal medicine specialists.",
    ],
  },
  {
    slug: "dr-revathy-chandrasekharan",
    lastModified: "2026-10-03",
    seoDescription:
      "Dr Revathy Chandrasekharan, Maternal-Fetal Medicine Specialist at Trichy Fetal Medicine and Fertility Centre, Trichy. MS (O&G), ICOG fellow.",
    name: "Dr Revathy Chandrasekharan",
    role: "Maternal-Fetal Medicine Specialist",
    qualifications: ["MS (O&G)", "Fellowship in Fetal Medicine (ICOG)"],
    highlights: [],
    trainedAt: ["Indian College of Obstetrics and Gynaecology"],
    expertise: [
      { label: "3D and 4D ultrasound" },
      { label: "CVS" },
      { label: "Amniocentesis" },
      { label: "Fetal blood sampling" },
      {
        label: "Twin and multiple pregnancy care",
        serviceSlug: "twin-specialised-clinic",
      },
    ],
    award: "Gold medal, ICOG Fetal Medicine Fellowship, 2022 batch",
    photo: "/images/doctors/revathy-cutout.png",
    photoFocus: { x: 50, y: 34 },
    hasProfile: true,
    registration: null,
    experienceSinceYear: null,
    languages: [],
    memberships: [],
    qualificationsDetailed: [],
    trainingPosts: [],
    clinicalFocus: [],
    patientNote: null,
    background: [
      "Dr Revathy is a trained obstetrician with specialisation in fetal medicine under the Indian College of Obstetrics and Gynaecology.",
      "Her work includes fetal imaging, diagnostic procedures, and care for twin and multiple pregnancies.",
    ],
  },
  {
    slug: "dr-nivethitha",
    lastModified: "2026-10-03",
    name: "Dr Nivethitha",
    role: "Fetal Medicine Specialist",
    roleIsPlaceholder: true,
    qualifications: ["Fellowship in Fetal Medicine"],
    highlights: [],
    trainedAt: [],
    expertise: [],
    photo: "/images/doctors/nivethitha-cutout.png",
    photoFocus: { x: 50, y: 34 },
    hasProfile: false,
    registration: null,
    experienceSinceYear: null,
    languages: [],
    memberships: [],
    qualificationsDetailed: [],
    trainingPosts: [],
    clinicalFocus: [],
    patientNote: null,
  },
];
