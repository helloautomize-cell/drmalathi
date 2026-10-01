export type Doctor = {
  slug: string;
  name: string;
  credentials: string[];
  badge: string;
  role?: string;
  image: string;
  hasProfile: boolean;
  bio: string[];
};

export const doctors: Doctor[] = [
  {
    slug: "dr-malathi-g-prasad",
    name: "Dr Malathi G. Prasad",
    credentials: ["MD", "FRCOG (UK)", "Diploma in Fetal Medicine, FMF Barcelona"],
    badge: "FRCOG (UK)",
    role: "Managing Director and Lead Consultant",
    image: "/images/doctors/malathi.webp",
    hasProfile: true,
    bio: [
      "Dr Malathi G. Prasad is the Managing Director and lead consultant, with 14 years of experience in the field of fetal medicine.",
      "She completed her MD at Kilpauk Medical College and served as Assistant Professor of Obstetrics and Gynaecology for 5 years, teaching undergraduate and postgraduate students. She went on to complete her MRCOG followed by FRCOG.",
      "She was awarded a Diploma in Fetal Medicine by the Fetal Medicine Foundation, Barcelona. She trained in fetal medicine at St George's Hospital and King's College London, mentored by Prof Basky Thilaganathan and Prof Kypros Nicolaides. She trained in advanced fetal interventions such as fetoscopic laser at St George's, and in fetal neurosonography with Prof Gustavo Malinger in Tel Aviv.",
      "She is national faculty at fetal medicine conferences, has conducted many workshops, and regularly holds masterclasses for doctors training in the field.",
    ],
  },
  {
    slug: "dr-revathy-chandrasekharan",
    name: "Dr Revathy Chandrasekharan",
    credentials: ["MS (O&G)", "Fellowship in Fetal Medicine"],
    badge: "Fetal Medicine Fellowship",
    role: "Maternal-Fetal Medicine Specialist",
    image: "/images/doctors/revathy.webp",
    hasProfile: true,
    bio: [
      "Dr Revathy Chandrasekharan is a maternal-fetal medicine specialist at Trichy Fetal Medicine Centre. She trained in fetal medicine under the Indian College of Obstetrics and Gynaecology and holds the gold medal in fetal medicine for the 2022 batch.",
      "She specialises in fetal imaging and diagnostic procedures, including 3D and 4D ultrasound, chorionic villus sampling, amniocentesis, and fetal blood sampling.",
      "She has special expertise in caring for multiple pregnancies, including multifetal pregnancy reduction, selective termination, and genetic evaluation with extensive counselling.",
    ],
  },
  {
    slug: "dr-nivethitha",
    name: "Dr Nivethitha",
    credentials: ["Fellowship in Fetal Medicine"],
    badge: "Fetal Medicine Fellowship",
    image: "/images/doctors/nivethitha.webp",
    // No profile page until a bio is available. Card links to /doctors.
    hasProfile: false,
    bio: [],
  },
];
