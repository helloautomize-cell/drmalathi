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
    return `A state-of-the-art fetal medicine centre in Trichy offering screening scans, advanced diagnostics, fetal procedures, and specialist clinics for ${yearsOfCare()} years.`;
  },
  address: {
    lines: ["#73, C/9, Annamalai Nagar,", "Thillai Nagar, Trichy - 620 018"],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Trichy%20Fetal%20Medicine%20and%20Fertility%20Centre%20Thillai%20Nagar%20Trichy",
    // TODO: replace with the official Google Maps embed share URL once the
    // client confirms the listing.
    mapsEmbedUrl:
      "https://www.google.com/maps?q=Trichy%20Fetal%20Medicine%20and%20Fertility%20Centre%20Thillai%20Nagar%20Trichy&output=embed",
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
};

export const mainNav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", mega: true },
  { label: "Fellowship", href: "/fellowship" },
  { label: "CME Activities", href: "/cme-activities" },
  { label: "Doctors", href: "/doctors" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;
