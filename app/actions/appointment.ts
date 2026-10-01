"use server";

import { Resend } from "resend";
import { z } from "zod";
import { doctors } from "@/data/doctors";
import { site } from "@/data/site";

const doctorSlugs = doctors.map((d) => d.slug);

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
  consent: z.literal("on"),
  website: z.string().max(0).optional().or(z.literal("")),
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
    consent: formData.get("consent"),
    website: formData.get("website"),
    startedAt: formData.get("startedAt"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the form and try again.",
    };
  }

  const { name, phone, doctor, website, startedAt } = parsed.data;

  // Honeypot and minimum submit time: silently accept so bots do not retry.
  const elapsed = startedAt ? Date.now() - new Date(startedAt).getTime() : 0;
  if (website || !startedAt || elapsed < MIN_SUBMIT_MS) {
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

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[appointment] dev-only log: ${name}, ${phone}, doctor=${doctorName}`
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
