"use server";

import { Resend } from "resend";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  consent: z.literal("on"),
  website: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.string().optional(),
});

export type SubscribeResult = { ok: boolean; message: string };

const MIN_SUBMIT_MS = 3000;

export async function subscribeNewsletter(
  formData: FormData
): Promise<SubscribeResult> {
  const parsed = subscribeSchema.safeParse({
    email: formData.get("email"),
    website: formData.get("website"),
    startedAt: formData.get("startedAt"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please enter a valid email and accept the consent to subscribe.",
    };
  }

  const { email, website, startedAt } = parsed.data;

  // Honeypot: bots fill hidden fields. Silently succeed so they do not retry.
  if (website) {
    return { ok: true, message: "Thank you for subscribing." };
  }

  // Minimum submit time: a human cannot fill this form in under 3 seconds.
  const elapsed = startedAt ? Date.now() - new Date(startedAt).getTime() : 0;
  if (!startedAt || elapsed < MIN_SUBMIT_MS) {
    return { ok: true, message: "Thank you for subscribing." };
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[newsletter] dev-only log: ${email}`);
      return { ok: true, message: "Thank you for subscribing." };
    }
    return {
      ok: false,
      message:
        "We could not subscribe you right now. Please call us or reach us on WhatsApp instead.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.LEADS_EMAIL_FROM ?? "website@fmctrichy.com",
      to: process.env.LEADS_EMAIL_TO ?? "fmc.trichy@gmail.com",
      subject: "Newsletter subscription",
      text: `New newsletter subscription: ${email}`,
    });
    return { ok: true, message: "Thank you for subscribing." };
  } catch {
    return {
      ok: false,
      message:
        "We could not subscribe you right now. Please call us or reach us on WhatsApp instead.",
    };
  }
}
