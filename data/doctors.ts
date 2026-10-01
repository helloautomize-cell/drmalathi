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
  hasProfile: boolean;
  mentors?: string[];
  background?: string[];
};

export const doctors: Doctor[] = [
  {
    slug: "dr-malathi-g-prasad",
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
    photo: "/images/doctors/malathi-cutout.png",
    photoFocus: { x: 50, y: 35 },
    hasProfile: true,
    mentors: ["Prof Basky Thilaganathan", "Prof Nicolaides"],
    background: [
      "Dr Malathi completed her MD at Kilpauk Medical College and served for five years as Assistant Professor of Obstetrics and Gynaecology.",
      "She completed MRCOG followed by FRCOG.",
      "She runs workshops and master classes and has trained many fetal medicine specialists.",
    ],
  },
  {
    slug: "dr-revathy-chandrasekharan",
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
    background: [
      "Dr Revathy is a trained obstetrician with specialisation in fetal medicine under the Indian College of Obstetrics and Gynaecology.",
      "Her work includes fetal imaging, diagnostic procedures, and care for twin and multiple pregnancies.",
    ],
  },
  {
    slug: "dr-nivethitha",
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
  },
];
