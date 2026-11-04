"use server";

import { randomInt } from "node:crypto";
import { istDateString } from "@/lib/booking-schema";
import {
  appendTrainingRow,
  buildTrainingRow,
  evaluateTrainingLimits,
  readRecentTrainingRows,
  sheetsConfigured,
} from "@/lib/google-sheets";
import {
  cvFileLooksValid,
  experienceLabel,
  heardFromLabel,
  normalisePreferredStart,
  qualificationLabel,
  statusLabel,
  trainingApplicationSchema,
} from "@/lib/training-schema";
import { courses, fellowshipProgram } from "@/data/courses";

/**
 * Server action for the /fellowship/apply training application. Pipeline:
 * honeypot, minimum fill time, zod validation, CV file check, Sheet abuse
 * limits, then append. Failures return a generic result so the UI shows the
 * calm email fallback without revealing which check rejected the request.
 * The built-in Next.js Origin check on server actions stays untouched.
 */

const MIN_SUBMIT_MS = 3000;

const OK_MESSAGE =
  "Thank you. We have received your application and will contact shortlisted candidates for an interview.";
const FALLBACK_MESSAGE = `We could not submit your application online right now. Please email your CV to ${fellowshipProgram.admissions.email} or call ${fellowshipProgram.admissions.phone}.`;

function devLog(check: string, extra?: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[training] ${check}`, extra ?? "");
  }
}

function applicationId(now: Date = new Date()): string {
  const yymmdd = istDateString(now).slice(2).replaceAll("-", "");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += alphabet[randomInt(alphabet.length)];
  return `TA-${yymmdd}-${suffix}`;
}

function text(value: FormDataEntryValue | null, max = 1200): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

async function readPdf(
  file: FormDataEntryValue | null
): Promise<{ bytes: Uint8Array; name: string } | null> {
  if (!(file instanceof File)) return null;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const header = new TextDecoder().decode(bytes.slice(0, 4));
  if (!cvFileLooksValid(file, header)) return null;
  const name =
    typeof file.name === "string" && file.name
      ? file.name.slice(0, 120)
      : "cv.pdf";
  return { bytes, name };
}

export async function submitTrainingApplication(
  formData: FormData
): Promise<{
  ok: boolean;
  message: string;
  deliveryFailed?: boolean;
  applicationId?: string;
}> {
  // 1. Honeypot: silently accept so bots do not retry or adapt.
  if (text(formData.get("website"), 200)) {
    devLog("honeypot hit, silently accepted");
    return { ok: true, message: OK_MESSAGE };
  }

  // 2. Minimum fill time.
  const startedAt = text(formData.get("startedAt"), 40);
  const started = Date.parse(startedAt);
  if (!startedAt || Number.isNaN(started) || Date.now() - started < MIN_SUBMIT_MS) {
    devLog("submitted too fast, silently accepted");
    return { ok: true, message: OK_MESSAGE };
  }

  // 3. Normalise + validate.
  const parsed = trainingApplicationSchema.safeParse({
    course: text(formData.get("course"), 80),
    fullName: text(formData.get("fullName"), 200),
    mobile: text(formData.get("mobile"), 40),
    email: text(formData.get("email"), 200),
    city: text(formData.get("city"), 200),
    qualification: text(formData.get("qualification"), 40),
    status: text(formData.get("status"), 40),
    year: text(formData.get("year"), 8),
    registration: text(formData.get("registration"), 60),
    workplace: text(formData.get("workplace"), 200),
    experience: text(formData.get("experience"), 40),
    preferredStart: text(formData.get("preferredStart"), 60),
    statement: text(formData.get("statement"), 800),
    heardFrom: text(formData.get("heardFrom"), 60),
    consent: formData.get("consent") !== null && formData.get("consent") !== "",
  });
  if (!parsed.success) {
    devLog("schema validation failed", parsed.error.issues.map((i) => i.path));
    return { ok: false, message: FALLBACK_MESSAGE, deliveryFailed: true };
  }
  const data = parsed.data;
  const course = courses.find((item) => item.slug === data.course);
  if (!course) {
    devLog("unknown course value");
    return { ok: false, message: FALLBACK_MESSAGE, deliveryFailed: true };
  }

  // 4. CV file: must be a real PDF of 3 MB or less.
  const cv = await readPdf(formData.get("cv"));
  if (!cv) {
    devLog("cv check failed");
    return { ok: false, message: FALLBACK_MESSAGE, deliveryFailed: true };
  }

  if (!sheetsConfigured()) {
    devLog("sheets env not set");
    if (process.env.NODE_ENV !== "production") {
      devLog("sheets env not set; dev passthrough", { course: course.slug });
      return {
        ok: true,
        message: OK_MESSAGE,
        applicationId: "TA-000000-DEV0",
      };
    }
    return { ok: false, message: FALLBACK_MESSAGE, deliveryFailed: true };
  }

  // 5. Sheet based limits on the last 300 training rows. If the read fails
  //    we still try to append so a real application is never lost to a
  //    check outage.
  try {
    const rows = await readRecentTrainingRows();
    const verdict = evaluateTrainingLimits(rows, {
      mobile: data.mobile,
      email: data.email,
      course: course.title,
    });
    if (verdict === "daily-limit" || verdict === "rate-limit") {
      devLog(`limit reached: ${verdict}`);
      return { ok: false, message: FALLBACK_MESSAGE, deliveryFailed: true };
    }
    if (verdict === "duplicate") {
      devLog("duplicate within 7 days, silently accepted");
      return { ok: true, message: OK_MESSAGE };
    }
  } catch {
    devLog("limit read failed, continuing to append");
  }

  const id = applicationId();
  const row = buildTrainingRow({
    applicationId: id,
    source: "website",
    course: course.title,
    fullName: data.fullName,
    mobile: data.mobile,
    email: data.email,
    city: data.city,
    qualification: qualificationLabel(data.qualification),
    status: statusLabel(data.status),
    year: String(data.year),
    registration: data.registration,
    workplace: data.workplace,
    experience: experienceLabel(data.experience),
    preferredStart: normalisePreferredStart(data.preferredStart),
    statement: data.statement,
    heardFrom: heardFromLabel(data.heardFrom),
  });

  try {
    await appendTrainingRow(row, {
      name: cv.name,
      mimeType: "application/pdf",
      base64: Buffer.from(cv.bytes).toString("base64"),
    });
  } catch {
    devLog("sheet append failed");
    return { ok: false, message: FALLBACK_MESSAGE, deliveryFailed: true };
  }
  devLog("appended", { applicationId: id });
  return { ok: true, message: OK_MESSAGE, applicationId: id };
}
