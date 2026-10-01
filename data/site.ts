export const site = {
  name: "Trichy Fetal Medicine and Fertility Centre",
  shortName: "FMC Trichy",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fmctrichy.com",
  description:
    "A state-of-the-art fetal medicine centre in Trichy offering screening scans, advanced diagnostics, fetal procedures, and specialist clinics for 13 years.",
  address: {
    lines: ["#73, C/9, Annamalai Nagar,", "Thillai Nagar, Trichy - 620 018"],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Trichy%20Fetal%20Medicine%20and%20Fertility%20Centre%20Thillai%20Nagar%20Trichy",
  },
  hours: "Mon - Fri: 9:00 AM - 9:00 PM",
  phones: [
    { label: "+91 96595 95141", href: "tel:+919659595141" },
    { label: "+91 96291 33415", href: "tel:+919629133415" },
  ],
  internationalPhone: {
    label: "+91 94433 89193",
    href: "tel:+919443389193",
  },
  email: "fmc.trichy@gmail.com",
  whatsapp: {
    label: "+91 74489 39808",
    href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917448939808"}`,
    get messageHref() {
      return `${this.href}?text=${encodeURIComponent("Hello, I would like to book an appointment at Trichy Fetal Medicine and Fertility Centre.")}`;
    },
  },
  // TODO: add real social URLs before launch. Icons render only when a URL exists.
  socials: [] as { label: string; href: string }[],
} as const;

export const mainNav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", mega: true },
  { label: "Fellowship", href: "/fellowship" },
  { label: "CME Activities", href: "/cme-activities" },
  { label: "Doctors", href: "/doctors" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;
