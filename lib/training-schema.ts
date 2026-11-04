import { z } from "zod";
import { mobileSchema } from "@/lib/booking-schema";
import {
  courseQualificationOptions,
  courses,
  heardFromOptions,
  traineeStatusOptions,
  ultrasoundExperienceOptions,
} from "@/data/courses";

/**
 * Shared schema for the /fellowship/apply training application. The client
 * form uses it for inline errors; the server action parses again before
 * anything reaches the Sheet. The CV file itself is checked in the action
 * (type, size and the %PDF header) because zod cannot read file bytes.
 */

export const courseSlugs = new Set<string>(
  courses.map((course) => course.slug)
);
const qualificationValues = new Set<string>(
  courseQualificationOptions.map((option) => option.value)
);
const statusValues = new Set<string>(
  traineeStatusOptions.map((option) => option.value)
);
const experienceValues = new Set<string>(
  ultrasoundExperienceOptions.map((option) => option.value)
);
const heardFromValues = new Set<string>(
  heardFromOptions.map((option) => option.value)
);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTRATION_PATTERN = /^[A-Za-z0-9/-]+$/;

export const CV_MAX_BYTES = 3 * 1024 * 1024;

/**
 * Server side CV check: PDF mime type, 3 MB or less, and the %PDF magic
 * bytes at the start of the file.
 */
export function cvFileLooksValid(
  meta: { type: string; size: number },
  header: string
): boolean {
  return (
    meta.type === "application/pdf" &&
    meta.size > 0 &&
    meta.size <= CV_MAX_BYTES &&
    header === "%PDF"
  );
}

const inSet = (set: Set<string>, message: string) =>
  z.string().refine((value) => set.has(value), message);

/**
 * "Next intake" plus the next 6 calendar months as "Month YYYY" labels,
 * computed in IST so the option list matches the Sheet's timezone.
 */
export function preferredStartOptions(now: Date = new Date()): string[] {
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const options = ["Next intake"];
  for (let i = 0; i < 6; i++) {
    const d = new Date(
      Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth() + i, 1)
    );
    options.push(
      d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    );
  }
  return options;
}

/** Keep a submitted preferred start only when it is a current option. */
export function normalisePreferredStart(
  value: string,
  now: Date = new Date()
): string {
  const v = value.trim().slice(0, 40);
  return preferredStartOptions(now).includes(v) ? v : "";
}

const maxYear = new Date().getFullYear() + 1;

export const trainingApplicationSchema = z.object({
  course: inSet(courseSlugs, "Please choose a course."),
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "Please enter your name."),
  mobile: mobileSchema,
  email: z
    .string()
    .trim()
    .max(160, "Please enter a valid email address.")
    .regex(EMAIL_PATTERN, "Please enter a valid email address."),
  city: z
    .string()
    .trim()
    .min(2, "Please enter your city and state.")
    .max(120, "Please enter your city and state."),
  qualification: inSet(
    qualificationValues,
    "Please choose your qualification."
  ),
  status: inSet(statusValues, "Please choose your status."),
  year: z.coerce
    .number()
    .int("Enter a valid year.")
    .min(1980, "Enter a valid year.")
    .max(maxYear, "Enter a valid year."),
  registration: z
    .string()
    .trim()
    .min(3, "Enter your medical council registration number.")
    .max(30, "Enter your medical council registration number.")
    .regex(
      REGISTRATION_PATTERN,
      "Use only letters, numbers, / and - in the registration number."
    ),
  workplace: z.string().trim().max(160).default(""),
  experience: inSet(experienceValues, "Please choose your experience."),
  preferredStart: z.string().trim().max(40).default(""),
  statement: z.string().trim().max(600).default(""),
  heardFrom: z
    .string()
    .trim()
    .max(40)
    .refine((value) => value === "" || heardFromValues.has(value))
    .default(""),
  consent: z.literal(true),
});

export type TrainingApplicationInput = z.input<
  typeof trainingApplicationSchema
>;
export type TrainingApplicationData = z.output<
  typeof trainingApplicationSchema
>;
export type TrainingApplicationField = keyof TrainingApplicationData;

/** Option label lookups used when building the Sheet row. */
export function qualificationLabel(value: string): string {
  return (
    courseQualificationOptions.find((option) => option.value === value)
      ?.label ?? value
  );
}

export function statusLabel(value: string): string {
  return (
    traineeStatusOptions.find((option) => option.value === value)?.label ??
    value
  );
}

export function experienceLabel(value: string): string {
  return (
    ultrasoundExperienceOptions.find((option) => option.value === value)
      ?.label ?? value
  );
}

export function heardFromLabel(value: string): string {
  return (
    heardFromOptions.find((option) => option.value === value)?.label ?? ""
  );
}
