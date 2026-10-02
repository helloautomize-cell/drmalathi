"use server";

import { Resend } from "resend";
import { z } from "zod";
import {
  courseQualificationOptions,
  courses,
} from "@/data/courses";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { site } from "@/data/site";

const doctorSlugs = doctors.map((d) => d.slug);
const serviceSlugs = services.map((s) => s.slug);

const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .max(24)
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .refine((v) => /^\+?\d{10,15}$/.test(v), "Please enter a valid phone number."),
  doctor: z
    .string()
    .refine((v) => v === "any" || doctorSlugs.includes(v), "Please choose a doctor.")
    .default("any"),
  service: z
    .string()
    .refine((v) => v === "any" || serviceSlugs.includes(v), "Please choose a service.")
    .default("any"),
  preferredTime: z
    .string()
    .refine(
      (v) => v === "any" || ["morning", "afternoon", "evening"].includes(v),
      "Please choose a preferred time."
    )
    .default("any"),
  source: z.string().max(40).optional(),
  consent: z.literal("on"),
  company_url: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.string().max(40).optional(),
});

export type AppointmentResult = { ok: boolean; message: string };

const MIN_SUBMIT_MS = 3000;

const FALLBACK_MESSAGE = `We could not submit your request online right now. Please call us on ${site.phones[0].label} or reach us on WhatsApp.`;

export async function requestAppointment(
  formData: FormData
): Promise<AppointmentResult> {
  const parsed = appointmentSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    doctor: formData.get("doctor") ?? "any",
    service: formData.get("service") ?? "any",
    preferredTime: formData.get("preferredTime") ?? "any",
    source: formData.get("source") ?? "",
    consent: formData.get("consent"),
    company_url: formData.get("company_url"),
    startedAt: formData.get("startedAt"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the form and try again.",
    };
  }

  const {
    name,
    phone,
    doctor,
    service,
    preferredTime,
    source,
    company_url,
    startedAt,
  } = parsed.data;

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

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[appointment] dev-only log: ${name}, ${phone}, doctor=${doctorName}, service=${serviceName}, source=${source ?? "unknown"}`
      );
      return {
        ok: true,
        message:
          "Thank you. We have received your request and will call you back shortly.",
      };
    }
    return { ok: false, message: FALLBACK_MESSAGE };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.LEADS_EMAIL_FROM ?? "website@fmctrichy.com",
      to: process.env.LEADS_EMAIL_TO ?? site.email,
      subject: `Appointment request: ${name}`,
      text: [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Preferred doctor: ${doctorName}`,
        `Service: ${serviceName}`,
        `Preferred time: ${timeLabel}`,
        `Source: ${source ?? "website"}`,
        `Submitted: ${new Date().toISOString()}`,
      ].join("\n"),
    });
    return {
      ok: true,
      message:
        "Thank you. We have received your request and will call you back shortly.",
    };
  } catch {
    return { ok: false, message: FALLBACK_MESSAGE };
  }
}

const courseSlugs = courses.map((course) => course.slug);
const qualificationValues: string[] = courseQualificationOptions.map(
  (qualification) => qualification.value
);

const courseEnquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .max(24)
    .transform((value) => value.replace(/[\s()-]/g, ""))
    .refine((value) => /^\+?\d{10,15}$/.test(value)),
  email: z.string().trim().email().max(160),
  qualification: z.string().refine((value) => qualificationValues.includes(value)),
  course: z.string().refine((value) => courseSlugs.includes(value)),
  message: z.string().trim().max(1000).optional(),
  consent: z.literal("on"),
  company_url: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.string().max(40).optional(),
});

const COURSE_FALLBACK_MESSAGE = `We could not submit your course enquiry online right now. Please email ${site.email} or call ${site.internationalPhone.label}.`;

export async function requestCourseEnquiry(
  formData: FormData
): Promise<AppointmentResult> {
  const parsed = courseEnquirySchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    qualification: formData.get("qualification"),
    course: formData.get("course"),
    message: formData.get("message") ?? "",
    consent: formData.get("consent"),
    company_url: formData.get("company_url"),
    startedAt: formData.get("startedAt"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Please check the form and try again." };
  }

  const {
    name,
    phone,
    email,
    qualification,
    course,
    message,
    company_url,
    startedAt,
  } = parsed.data;
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
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[course-enquiry] dev-only log: ${name}, ${phone}, ${email}, qualification=${qualificationLabel}, course=${courseName}`
      );
      return {
        ok: true,
        message: "Thank you. We have received your course enquiry.",
      };
    }
    return { ok: false, message: COURSE_FALLBACK_MESSAGE };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.LEADS_EMAIL_FROM ?? "website@fmctrichy.com",
      to: process.env.LEADS_EMAIL_TO ?? site.email,
      subject: `Course enquiry: ${courseName}`,
      text: [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Qualification: ${qualificationLabel}`,
        `Course: ${courseName}`,
        `Message: ${message || "None"}`,
        `Submitted: ${new Date().toISOString()}`,
      ].join("\n"),
    });
    return {
      ok: true,
      message: "Thank you. We have received your course enquiry.",
    };
  } catch {
    return { ok: false, message: COURSE_FALLBACK_MESSAGE };
  }
}
