"use server";

import { Resend } from "resend";
import {
  fieldErrors,
  validateCourseEnquiry,
  validateLead,
} from "@/lib/lead-validation";
import {
  courseQualificationOptions,
  courses,
} from "@/data/courses";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { site } from "@/data/site";

const doctorSlugs = doctors.map((d) => d.slug);
const serviceSlugs = services.map((s) => s.slug);

function text(value: FormDataEntryValue | null, max = 200): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

export type AppointmentResult = {
  ok: boolean;
  message: string;
  /** True when the lead could not be delivered; the UI shows direct
      contact options so no enquiry is ever lost silently. */
  deliveryFailed?: boolean;
};

const MIN_SUBMIT_MS = 3000;

const LEAD_ENV_VARS = [
  "RESEND_API_KEY",
  "LEADS_EMAIL_TO",
  "LEADS_EMAIL_FROM",
] as const;

const FALLBACK_MESSAGE = `We could not submit your request online right now. Please call us on ${site.phones[0].label} or reach us on WhatsApp.`;

/**
 * Delivers a lead email through Resend. Returns true only when Resend
 * accepted the message; on missing env vars, an API rejection or a thrown
 * error it logs the lead server-side and returns false.
 */
async function deliverLead(
  subject: string,
  lines: string[],
  tag: string
): Promise<boolean> {
  const missing = LEAD_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      `[${tag}] lead not delivered, missing env: ${missing.join(", ")}. Lead: ${lines.join(" | ")}`
    );
    return false;
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY as string);
    const { error } = await resend.emails.send({
      from: process.env.LEADS_EMAIL_FROM as string,
      to: process.env.LEADS_EMAIL_TO as string,
      subject,
      text: lines.join("\n"),
    });
    if (error) {
      console.error(
        `[${tag}] resend rejected lead: ${JSON.stringify(error)}. Lead: ${lines.join(" | ")}`
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error(
      `[${tag}] lead send threw: ${String(err)}. Lead: ${lines.join(" | ")}`
    );
    return false;
  }
}

export async function requestAppointment(
  formData: FormData
): Promise<AppointmentResult> {
  const source = text(formData.get("source"), 40);
  const company_url = text(formData.get("company_url"), 120);
  const startedAt = text(formData.get("startedAt"), 40);

  const parsed = validateLead(
    {
      name: text(formData.get("name")),
      phone: text(formData.get("phone"), 40),
      doctor: text(formData.get("doctor")) || "any",
      service: text(formData.get("service")) || "any",
      preferredTime: text(formData.get("preferredTime")) || "any",
      consent: text(formData.get("consent")),
    },
    { doctorSlugs, serviceSlugs }
  );

  if (!parsed.ok) {
    return { ok: false, message: fieldErrors.generic };
  }

  const { name, phone, doctor, service, preferredTime } = parsed.data;

  // Honeypot and minimum submit time: silently accept so bots do not retry.
  const elapsed = startedAt ? Date.now() - new Date(startedAt).getTime() : 0;
  if (company_url || !startedAt || elapsed < MIN_SUBMIT_MS) {
    return {
      ok: true,
      message:
        "Thank you. We have received your request and will call you back shortly.",
    };
  }

  const doctorName =
    doctor === "any"
      ? "No preference"
      : (doctors.find((d) => d.slug === doctor)?.name ?? doctor);
  const serviceName =
    service === "any"
      ? "No preference"
      : (services.find((s) => s.slug === service)?.name ?? service);
  const timeLabel =
    preferredTime === "any"
      ? "No preference"
      : preferredTime.charAt(0).toUpperCase() + preferredTime.slice(1);

  if (!process.env.RESEND_API_KEY && process.env.NODE_ENV === "development") {
    console.log(
      `[appointment] dev-only log: ${name}, ${phone}, doctor=${doctorName}, service=${serviceName}, source=${source ?? "unknown"}`
    );
    return {
      ok: true,
      message:
        "Thank you. We have received your request and will call you back shortly.",
    };
  }

  const delivered = await deliverLead(
    `Appointment request: ${name}`,
    [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Preferred doctor: ${doctorName}`,
      `Service: ${serviceName}`,
      `Preferred time: ${timeLabel}`,
      `Source: ${source ?? "website"}`,
      `Submitted: ${new Date().toISOString()}`,
    ],
    "appointment"
  );

  if (!delivered) {
    return { ok: false, message: FALLBACK_MESSAGE, deliveryFailed: true };
  }
  return {
    ok: true,
    message:
      "Thank you. We have received your request and will call you back shortly.",
  };
}

const courseSlugs = courses.map((course) => course.slug);
const qualificationValues: string[] = courseQualificationOptions.map(
  (qualification) => qualification.value
);

const COURSE_FALLBACK_MESSAGE = `We could not submit your course enquiry online right now. Please email ${site.email} or call ${site.internationalPhone.label}.`;

export async function requestCourseEnquiry(
  formData: FormData
): Promise<AppointmentResult> {
  const company_url = text(formData.get("company_url"), 120);
  const startedAt = text(formData.get("startedAt"), 40);

  const parsed = validateCourseEnquiry(
    {
      name: text(formData.get("name")),
      phone: text(formData.get("phone"), 40),
      email: text(formData.get("email"), 200),
      qualification: text(formData.get("qualification")),
      course: text(formData.get("course")),
      message: text(formData.get("message"), 1200),
      consent: text(formData.get("consent")),
    },
    { courseSlugs, qualificationValues }
  );

  if (!parsed.ok) {
    return { ok: false, message: fieldErrors.generic };
  }

  const { name, phone, email, qualification, course, message } = parsed.data;
  const elapsed = startedAt ? Date.now() - new Date(startedAt).getTime() : 0;

  if (company_url || !startedAt || elapsed < MIN_SUBMIT_MS) {
    return {
      ok: true,
      message: "Thank you. We have received your course enquiry.",
    };
  }

  const selectedCourse = courses.find((item) => item.slug === course);
  const courseName = selectedCourse?.title ?? course;
  const qualificationLabel =
    courseQualificationOptions.find((item) => item.value === qualification)
      ?.label ?? qualification;
  if (!process.env.RESEND_API_KEY && process.env.NODE_ENV === "development") {
    console.log(
      `[course-enquiry] dev-only log: ${name}, ${phone}, ${email}, qualification=${qualificationLabel}, course=${courseName}`
    );
    return {
      ok: true,
      message: "Thank you. We have received your course enquiry.",
    };
  }

  const delivered = await deliverLead(
    `Course enquiry: ${courseName}`,
    [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Qualification: ${qualificationLabel}`,
      `Course: ${courseName}`,
      `Message: ${message || "None"}`,
      `Submitted: ${new Date().toISOString()}`,
    ],
    "course-enquiry"
  );

  if (!delivered) {
    return {
      ok: false,
      message: COURSE_FALLBACK_MESSAGE,
      deliveryFailed: true,
    };
  }
  return {
    ok: true,
    message: "Thank you. We have received your course enquiry.",
  };
}
