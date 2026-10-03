// Canonical practice facts. Contact details, hours and the founding year live
// here; every page and component derives from this file.

// TODO: confirm founding year with the client. The home page copy says
// "13 years" while Dr Malathi's bio says 14. Computed copy uses this value.
export const foundedYear = 2012;

// Launch-gate confirmations. check:launch reads these flags; flip each to
// true only after the client confirms the underlying fact in writing.
export const foundedYearConfirmed = false;
export const whatsappNumberConfirmed = false;
export const saturdayHoursConfirmed = false;

export function yearsOfCare() {
  return new Date().getFullYear() - foundedYear;
}

export const email = "fmc.trichy@gmail.com";

export const phones = [
  { label: "+91 96595 95141", href: "tel:+919659595141" },
  { label: "+91 96291 33415", href: "tel:+919629133415" },
] as const;

// Dedicated line for international patients and course admissions.
export const internationalPhone = {
  label: "+91 94433 89193",
  href: "tel:+919443389193",
} as const;

export const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917448939808";

// TODO: set NEXT_PUBLIC_WHATSAPP_INTL_NUMBER when the client confirms a
// separate international WhatsApp line. Falls back to the general number.
export const whatsappInternationalNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_INTL_NUMBER ?? whatsappNumber;

// TODO: confirm Saturday hours with the client before launch.
export const hours = "Mon - Fri: 9:00 AM - 9:00 PM";
