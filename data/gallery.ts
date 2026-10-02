// TODO: client to confirm the category names and groupings below, and to
// supply a consultation room photo so the "Consultation" category can render
// (it is hidden until an image is assigned to it). Alt text is descriptive
// draft copy pending client approval. No patient-identifiable images are
// used; event photos show staff and guests at the grand opening.

export type GalleryCategoryId =
  | "reception"
  | "scan-rooms"
  | "consultation"
  | "team"
  | "events";

export const galleryCategories: { id: GalleryCategoryId; label: string }[] = [
  { id: "reception", label: "Reception" },
  { id: "scan-rooms", label: "Scan rooms" },
  { id: "consultation", label: "Consultation" },
  { id: "team", label: "Team" },
  { id: "events", label: "Events" },
];

export type GalleryImage = {
  src: string;
  alt: string;
  category: GalleryCategoryId;
  width: number;
  height: number;
};

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/banners/banner1.webp",
    alt: "The reception desk at the centre, staffed during opening hours",
    category: "reception",
    width: 1000,
    height: 1000,
  },
  {
    src: "/images/banners/banner9.webp",
    alt: "The waiting area seating inside the centre",
    category: "reception",
    width: 1000,
    height: 1000,
  },
  {
    src: "/images/banners/banner6.webp",
    alt: "An ultrasound machine and exam bed inside a scan room",
    category: "scan-rooms",
    width: 1000,
    height: 1000,
  },
  {
    src: "/images/banners/banner7.webp",
    alt: "The reporting desk and workstation inside a scan room",
    category: "scan-rooms",
    width: 1000,
    height: 1000,
  },
  {
    src: "/images/banners/banner8.webp",
    alt: "A procedure room with an exam bed and ultrasound machine",
    category: "scan-rooms",
    width: 1000,
    height: 1000,
  },
  {
    src: "/images/gallery/g15.webp",
    alt: "The team outside the IVF and obstetric theatres on opening day",
    category: "team",
    width: 1600,
    height: 1066,
  },
  {
    src: "/images/gallery/g10.webp",
    alt: "The team cutting the ribbon at the centre's grand opening",
    category: "team",
    width: 1600,
    height: 1066,
  },
  {
    src: "/images/gallery/g16.webp",
    alt: "The centre's entrance decorated for its grand opening day",
    category: "events",
    width: 1600,
    height: 1066,
  },
  {
    src: "/images/gallery/g4.webp",
    alt: "Lamp lighting at the centre's grand opening ceremony",
    category: "events",
    width: 1600,
    height: 1066,
  },
  {
    src: "/images/gallery/g5.webp",
    alt: "Lamp lighting near the consultants' rooms at the grand opening",
    category: "events",
    width: 1600,
    height: 1066,
  },
  {
    src: "/images/gallery/g6.webp",
    alt: "A guest welcomed with a shawl at the grand opening",
    category: "events",
    width: 1600,
    height: 1066,
  },
  {
    src: "/images/gallery/g9.webp",
    alt: "Guests inside a consultation room during the grand opening",
    category: "events",
    width: 1600,
    height: 1066,
  },
  {
    src: "/images/gallery/g11.webp",
    alt: "Guests at the centre's grand opening ceremony",
    category: "events",
    width: 1600,
    height: 1066,
  },
  {
    src: "/images/gallery/g14.webp",
    alt: "Families and guests at the centre's grand opening",
    category: "events",
    width: 1600,
    height: 1066,
  },
  {
    src: "/images/gallery/g3.webp",
    alt: "Guests gathered at the centre's grand opening",
    category: "events",
    width: 1600,
    height: 1066,
  },
  {
    src: "/images/gallery/g13.webp",
    alt: "Grand opening celebrations at the centre",
    category: "events",
    width: 1600,
    height: 1066,
  },
];
