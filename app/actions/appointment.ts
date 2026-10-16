"use server";

import { fieldErrors, validateCourseEnquiry } from "@/lib/lead-validation";
import { sendLeadEmail } from "@/lib/booking-pipeline";
import {
  courseQualificationOptions,
  courses,
} from "@/data/courses";
import { site } from "@/data/site";

const courseSlugs = courses.map((course) => course.slug);
const qualificationValues: string[] = courseQualificationOptions.map(
  (qualification) => qualification.value
);

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

  const delivered = await sendLeadEmail(
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
