/**
 * Shared lead-form validation. The client forms use it for inline errors;
 * the server action uses it as the authoritative check on every submit.
 * No dependencies: native HTML attributes do the first-pass checks, this
 * module does the rest.
 *
 * Phone rule: the input may contain +, digits, spaces, dashes and
 * parentheses; after normalising (strip spaces/dashes/parens) it must be
 * 10 to 15 digits with an optional leading +. This single rule is used on
 * both sides — the old client regex was looser than the server's.
 */

export const fieldErrors = {
  name: "Please enter your name.",
  phone: "Please enter a valid phone number.",
  email: "Please enter a valid email address.",
  doctor: "Please choose a doctor.",
  service: "Please choose a service.",
  preferredTime: "Please choose a preferred time.",
  qualification: "Please choose your qualification.",
  course: "Please choose a course.",
  consent: "Please accept so we can contact you.",
  consentEnquiry: "Please accept so we can respond to your enquiry.",
  generic: "Please check the form and try again.",
} as const;

/** Pattern attribute for the phone input (typed, pre-normalised form). */
export const phoneInputPattern = "^[+0-9][0-9 ()-]{7,15}$";

export function normalizePhone(value: string): string {
  return value.trim().replace(/[\s()-]/g, "");
}

export function isValidPhone(value: string): boolean {
  const p = normalizePhone(value);
  return /^\+?\d{10,15}$/.test(p);
}

export function isValidName(value: string): boolean {
  const n = value.trim();
  return n.length >= 2 && n.length <= 80;
}

export function isValidEmail(value: string): boolean {
  const n = value.trim();
  return n.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n);
}

export type LeadField = "name" | "phone" | "doctor" | "service" | "preferredTime" | "consent";

export type LeadInput = {
  name?: string;
  phone?: string;
  doctor?: string;
  service?: string;
  preferredTime?: string;
  /** "on" from FormData, or boolean from controlled state. */
  consent?: string | boolean;
};

export type LeadValues = {
  name: string;
  phone: string;
  doctor: string;
  service: string;
  preferredTime: string;
};

const TIMES = ["morning", "afternoon", "evening"];

export function validateLead(
  input: LeadInput,
  lists: { doctorSlugs: string[]; serviceSlugs: string[] }
):
  | { ok: true; data: LeadValues }
  | { ok: false; errors: Partial<Record<LeadField, string>> } {
  const errors: Partial<Record<LeadField, string>> = {};

  const name = (input.name ?? "").trim();
  if (!isValidName(name)) errors.name = fieldErrors.name;

  const phone = normalizePhone(input.phone ?? "");
  if (!isValidPhone(input.phone ?? "")) errors.phone = fieldErrors.phone;

  const doctor = input.doctor || "any";
  if (doctor !== "any" && !lists.doctorSlugs.includes(doctor))
    errors.doctor = fieldErrors.doctor;

  const service = input.service || "any";
  if (service !== "any" && !lists.serviceSlugs.includes(service))
    errors.service = fieldErrors.service;

  const preferredTime = input.preferredTime || "any";
  if (preferredTime !== "any" && !TIMES.includes(preferredTime))
    errors.preferredTime = fieldErrors.preferredTime;

  const consented = input.consent === "on" || input.consent === true;
  if (!consented) errors.consent = fieldErrors.consent;

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { name, phone, doctor, service, preferredTime } };
}

export type EnquiryField =
  | "name"
  | "phone"
  | "email"
  | "qualification"
  | "course"
  | "message"
  | "consent";

export type EnquiryInput = {
  name?: string;
  phone?: string;
  email?: string;
  qualification?: string;
  course?: string;
  message?: string;
  consent?: string | boolean;
};

export type EnquiryValues = {
  name: string;
  phone: string;
  email: string;
  qualification: string;
  course: string;
  message: string;
};

export function validateCourseEnquiry(
  input: EnquiryInput,
  lists: { courseSlugs: string[]; qualificationValues: string[] }
):
  | { ok: true; data: EnquiryValues }
  | { ok: false; errors: Partial<Record<EnquiryField, string>> } {
  const errors: Partial<Record<EnquiryField, string>> = {};

  const name = (input.name ?? "").trim();
  if (!isValidName(name)) errors.name = fieldErrors.name;

  const phone = normalizePhone(input.phone ?? "");
  if (!isValidPhone(input.phone ?? "")) errors.phone = fieldErrors.phone;

  const email = (input.email ?? "").trim();
  if (!isValidEmail(email)) errors.email = fieldErrors.email;

  const qualification = input.qualification ?? "";
  if (!lists.qualificationValues.includes(qualification))
    errors.qualification = fieldErrors.qualification;

  const course = input.course ?? "";
  if (!lists.courseSlugs.includes(course)) errors.course = fieldErrors.course;

  const message = (input.message ?? "").trim();
  if (message.length > 1000) errors.message = fieldErrors.generic;

  const consented = input.consent === "on" || input.consent === true;
  if (!consented) errors.consent = fieldErrors.consentEnquiry;

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { name, phone, email, qualification, course, message },
  };
}
