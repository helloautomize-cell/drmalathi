import {
  email,
  hours,
  internationalPhone,
  phones,
  whatsappInternationalNumber,
  whatsappNumber,
  yearsOfCare,
} from "@/lib/site";

export const site = {
  name: "Trichy Fetal Medicine and Fertility Centre",
  shortName: "FMC Trichy",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fmctrichy.com",
  get description() {
    return `A fetal medicine centre in Trichy offering screening scans, advanced diagnostics, fetal procedures, and specialist clinics for ${yearsOfCare()} years.`;
  },
  address: {
    lines: ["#73, C/9, Annamalai Nagar,", "Thillai Nagar, Trichy - 620 018"],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Trichy%20Fetal%20Medicine%20and%20Fertility%20Centre%20Thillai%20Nagar%20Trichy",
  },
  hours,
  phones: [...phones],
  internationalPhone,
  email,
  whatsapp: {
    label: "+91 74489 39808",
    href: `https://wa.me/${whatsappNumber}`,
    get messageHref() {
      return `${this.href}?text=${encodeURIComponent("Hello, I would like to book an appointment at Trichy Fetal Medicine and Fertility Centre.")}`;
    },
  },
  whatsappInternational: {
    href: `https://wa.me/${whatsappInternationalNumber}`,
    get messageHref() {
      return `${this.href}?text=${encodeURIComponent("Hello, I am an international patient planning a visit to Trichy Fetal Medicine and Fertility Centre.")}`;
    },
  },
  // TODO: add real social URLs before launch. Icons render only when a URL exists.
  socials: [] as { label: string; href: string }[],

  // Typed-null fields: nothing renders while these are empty. Fill with
  // client-confirmed data only; see LAUNCH-CHECKLIST.md.
  /** PCPNDT registration number, rendered in the footer when supplied. */
  pcpndtRegistration: null as string | null,
  /** Tamil Nadu Clinical Establishments Act registration number. */
  clinicalEstablishmentRegistration: null as string | null,
  /** ART (Surrogacy/IVF) registration, only if the centre provides IUI/IVF. */
  artRegistration: null as string | null,
  /** DPDP grievance officer; shown on the privacy page when supplied. */
  grievanceOfficer: null as {
    name: string;
    designation: string;
    email: string;
    phone: string;
  } | null,
  /** Exact founding date for schema; year alone lives in lib/site.ts. */
  foundingDate: null as string | null,
  /** Clinic coordinates for LocalBusiness schema. */
  geo: null as { latitude: number; longitude: number } | null,
  /** Maps URL for schema hasMap; use site.address.mapsUrl when confirmed. */
  hasMap: null as string | null,
  /** Areas served, e.g. ["Tiruchirappalli", "Thanjavur"]. */
  areaServed: [] as string[],
  /** Same-as profile URLs for the clinic entity. */
  sameAs: [] as string[],
};

export const mainNav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", mega: true },
  { label: "Patient Guides", href: "/guides" },
  {
    label: "For doctors",
    children: [
      { label: "Fellowship", href: "/fellowship" },
      { label: "CME Activities", href: "/cme-activities" },
    ],
  },
  { label: "Doctors", href: "/doctors" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;
