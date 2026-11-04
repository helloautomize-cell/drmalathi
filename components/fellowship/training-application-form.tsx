"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useId,
  useState,
} from "react";
import Link from "next/link";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Phone,
  Upload,
} from "lucide-react";
import { cn } from "cn";
import { sendGAEvent } from "@/lib/gtag";
import { submitTrainingApplication } from "@/lib/training-action";
import { ContactFallbackPanel } from "@/components/forms/contact-fallback-panel";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import {
  courseQualificationOptions,
  courses,
  fellowshipProgram,
  heardFromOptions,
  traineeStatusOptions,
  ultrasoundExperienceOptions,
} from "@/data/courses";
import { site } from "@/data/site";
import {
  CV_MAX_BYTES,
  trainingApplicationSchema,
} from "@/lib/training-schema";

/**
 * Doctor training application for /fellowship/apply. Follows the booking
 * form structure: controlled values, shared zod schema for inline errors,
 * the same honeypot and minimum fill time, a generic fallback panel and a
 * success card with the application ID.
 */

type TrainingValues = {
  course: string;
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  qualification: string;
  status: string;
  year: string;
  registration: string;
  workplace: string;
  experience: string;
  preferredStart: string;
  statement: string;
  heardFrom: string;
  consent: boolean;
};

type TrainingErrors = Partial<
  Record<keyof TrainingValues | "cv", string>
>;

const STATEMENT_MAX = 600;
const currentYear = new Date().getFullYear();

function fileSizeLabel(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function isPdf(file: File): boolean {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

export function TrainingApplicationForm({
  initialCourse,
  preferredStartOptions,
}: {
  initialCourse?: string;
  /** "Next intake" plus the next 6 months, generated on the server. */
  preferredStartOptions: string[];
}) {
  const idPrefix = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [startedAt] = useState(() => new Date().toISOString());
  const [success, setSuccess] = useState<{ applicationId?: string } | null>(
    null
  );
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [values, setValues] = useState<TrainingValues>({
    course: initialCourse ?? "",
    fullName: "",
    mobile: "",
    email: "",
    city: "",
    qualification: "",
    status: "",
    year: "",
    registration: "",
    workplace: "",
    experience: "",
    preferredStart: "",
    statement: "",
    heardFrom: "",
    consent: false,
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<TrainingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = (part: string) => `${idPrefix}-${part}`;

  function setField<K extends keyof TrainingValues>(
    key: K,
    value: TrainingValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  function onCvChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setCvFile(file);
    if (!file) {
      setErrors((e) => ({ ...e, cv: undefined }));
      return;
    }
    if (!isPdf(file)) {
      setErrors((e) => ({ ...e, cv: "Upload your CV as a PDF file." }));
    } else if (file.size > CV_MAX_BYTES) {
      setErrors((e) => ({
        ...e,
        cv: "The PDF must be 3 MB or smaller.",
      }));
    } else {
      setErrors((e) => ({ ...e, cv: undefined }));
    }
  }

  function validateCv(): string | undefined {
    if (!cvFile) return "Upload your CV as a PDF file.";
    if (!isPdf(cvFile)) return "Upload your CV as a PDF file.";
    if (cvFile.size > CV_MAX_BYTES) return "The PDF must be 3 MB or smaller.";
    return undefined;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Capture the form now: currentTarget is null after the synthetic event
    // finishes, which is past the dynamic imports below.
    const form = event.currentTarget;
    const parsed = trainingApplicationSchema.safeParse({
      ...values,
      year: values.year,
    });
    const cvError = validateCv();
    if (!parsed.success || cvError) {
      const next: TrainingErrors = {};
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = issue.path[0];
          if (
            typeof key === "string" &&
            key in values &&
            !next[key as keyof TrainingValues]
          ) {
            next[key as keyof TrainingValues] = issue.message;
          }
        }
      }
      if (cvError) next.cv = cvError;
      setErrors(next);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const { toast } = await import("sonner");
      // Build from the live form so the honeypot value survives whatever a
      // bot typed into it, and the CV file travels with the request.
      const formData = new FormData(form);
      formData.set("course", parsed.data.course);
      formData.set("fullName", parsed.data.fullName);
      formData.set("mobile", parsed.data.mobile);
      formData.set("email", parsed.data.email);
      formData.set("city", parsed.data.city);
      formData.set("qualification", parsed.data.qualification);
      formData.set("status", parsed.data.status);
      formData.set("year", String(parsed.data.year));
      formData.set("registration", parsed.data.registration);
      formData.set("workplace", parsed.data.workplace);
      formData.set("experience", parsed.data.experience);
      formData.set("preferredStart", parsed.data.preferredStart);
      formData.set("statement", parsed.data.statement);
      formData.set("heardFrom", parsed.data.heardFrom);
      formData.set("consent", "on");
      formData.set("startedAt", startedAt);

      const result = await submitTrainingApplication(formData);
      if (result.ok) {
        try {
          // Only the course slug is sent; never personal data.
          sendGAEvent("event", "training_application_submit", {
            course: parsed.data.course,
          });
        } catch {
          // analytics must never break the success flow
        }
        setSuccess({ applicationId: result.applicationId });
      } else if (result.deliveryFailed) {
        setFailedMessage(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (failedMessage) {
    return (
      <div>
        <ContactFallbackPanel message={failedMessage} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Or{" "}
          <a
            href={`mailto:${fellowshipProgram.admissions.email}`}
            className="link font-semibold"
          >
            email your CV instead
          </a>
          .
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="py-5 text-center" role="status">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-teal-tint text-teal">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-ink">
          Application received
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          We will contact shortlisted candidates for an interview.
        </p>
        {success.applicationId ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Application ID:{" "}
            <span className="font-mono font-semibold text-ink">
              {success.applicationId}
            </span>
          </p>
        ) : null}
        <p className="mt-4 text-sm font-semibold text-ink">
          Questions about your application? Reach us directly:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <a
            href={fellowshipProgram.admissions.phoneHref}
            className={cn(
              buttonVariants({ size: "default" }),
              "bg-primary text-white hover:bg-primary-hover"
            )}
          >
            <Phone aria-hidden="true" />
            Call {fellowshipProgram.admissions.phone}
          </a>
          <a
            href={site.whatsapp.messageHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" })
            )}
          >
            <WhatsAppIcon aria-hidden="true" />
            WhatsApp us
          </a>
        </div>
      </div>
    );
  }

  const fieldError = (key: keyof TrainingErrors) =>
    errors[key] ? (
      <p className="text-sm text-destructive">{errors[key]}</p>
    ) : null;

  const selectControl = (
    key:
      | "course"
      | "qualification"
      | "status"
      | "experience"
      | "preferredStart"
      | "heardFrom",
    triggerId: string,
    placeholder: string,
    options: readonly { value: string; label: string }[]
  ) => {
    const label =
      options.find((option) => option.value === values[key])?.label ??
      placeholder;
    return (
      <>
        <Select
          value={values[key]}
          onValueChange={(v) => setField(key, v ?? "")}
        >
          <SelectTrigger
            id={triggerId}
            className="h-12! w-full bg-white"
            aria-invalid={!!errors[key]}
          >
            <SelectValue className="min-w-0 truncate">
              {() => label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldError(key)}
      </>
    );
  };

  const groupLabel = (children: ReactNode) => (
    <h2 className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
      {children}
    </h2>
  );

  const preferredStartSelectOptions = preferredStartOptions.map((label) => ({
    value: label,
    label,
  }));

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={id("course")}>Course</Label>
        {selectControl(
          "course",
          id("course"),
          "Choose a course",
          courses.map((item) => ({ value: item.slug, label: item.title }))
        )}
      </div>

      <section aria-label="About you" className="space-y-4 border-t border-rose-tint pt-5">
        {groupLabel("About you")}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={id("fullName")}>Full name</Label>
            <Input
              id={id("fullName")}
              name="fullName"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              value={values.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              aria-invalid={!!errors.fullName}
              className="h-12"
            />
            {fieldError("fullName")}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={id("mobile")}>Mobile</Label>
            <Input
              id={id("mobile")}
              name="mobile"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              required
              placeholder="10 digit mobile"
              value={values.mobile}
              onChange={(e) => setField("mobile", e.target.value)}
              aria-invalid={!!errors.mobile}
              className="h-12"
            />
            {fieldError("mobile")}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={id("email")}>Email</Label>
            <Input
              id={id("email")}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={160}
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={!!errors.email}
              className="h-12"
            />
            {fieldError("email")}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={id("city")}>City and state</Label>
            <Input
              id={id("city")}
              name="city"
              autoComplete="address-level2"
              required
              maxLength={120}
              value={values.city}
              onChange={(e) => setField("city", e.target.value)}
              aria-invalid={!!errors.city}
              className="h-12"
            />
            {fieldError("city")}
          </div>
        </div>
      </section>

      <section aria-label="Qualifications" className="space-y-4 border-t border-rose-tint pt-5">
        {groupLabel("Qualifications")}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={id("qualification")}>Highest qualification</Label>
            {selectControl(
              "qualification",
              id("qualification"),
              "Select qualification",
              courseQualificationOptions
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={id("status")}>Status</Label>
            {selectControl(
              "status",
              id("status"),
              "Select status",
              traineeStatusOptions
            )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={id("year")}>Year of completion</Label>
            <Input
              id={id("year")}
              name="year"
              type="number"
              inputMode="numeric"
              required
              min={1980}
              max={currentYear + 1}
              placeholder="YYYY"
              value={values.year}
              onChange={(e) => setField("year", e.target.value)}
              aria-invalid={!!errors.year}
              className="h-12"
            />
            {fieldError("year")}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={id("registration")}>
              Medical council registration number
            </Label>
            <Input
              id={id("registration")}
              name="registration"
              required
              minLength={3}
              maxLength={30}
              value={values.registration}
              onChange={(e) => setField("registration", e.target.value)}
              aria-invalid={!!errors.registration}
              className="h-12"
            />
            {fieldError("registration")}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={id("workplace")}>
              Current workplace and role (optional)
            </Label>
            <Input
              id={id("workplace")}
              name="workplace"
              autoComplete="organization"
              maxLength={160}
              value={values.workplace}
              onChange={(e) => setField("workplace", e.target.value)}
              aria-invalid={!!errors.workplace}
              className="h-12"
            />
            {fieldError("workplace")}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={id("experience")}>Ultrasound experience</Label>
            {selectControl(
              "experience",
              id("experience"),
              "Select experience",
              ultrasoundExperienceOptions
            )}
          </div>
        </div>
      </section>

      <section aria-label="Your application" className="space-y-4 border-t border-rose-tint pt-5">
        {groupLabel("Your application")}
        <div className="space-y-1.5">
          <Label htmlFor={id("preferredStart")}>
            Preferred start (optional)
          </Label>
          {selectControl(
            "preferredStart",
            id("preferredStart"),
            "Choose a start",
            preferredStartSelectOptions
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={id("statement")}>
            Why this programme (optional)
          </Label>
          <Textarea
            id={id("statement")}
            name="statement"
            rows={4}
            maxLength={STATEMENT_MAX}
            value={values.statement}
            onChange={(e) => setField("statement", e.target.value)}
            aria-invalid={!!errors.statement}
            aria-describedby={id("statement-count")}
          />
          <p
            id={id("statement-count")}
            className="text-sm text-muted-foreground"
          >
            {values.statement.length}/{STATEMENT_MAX}
          </p>
          {fieldError("statement")}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={id("cv")}>CV (PDF, max 3 MB)</Label>
          <label
            htmlFor={id("cv")}
            className={cn(
              "flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-lg border border-input bg-white px-3 py-2 text-sm transition-colors",
              errors.cv ? "border-destructive" : "hover:border-ring"
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-tint text-primary">
              {cvFile ? (
                <FileText className="size-5" aria-hidden="true" />
              ) : (
                <Upload className="size-5" aria-hidden="true" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              {cvFile ? (
                <>
                  <span className="block truncate font-semibold text-ink">
                    {cvFile.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {fileSizeLabel(cvFile.size)}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  Choose your CV as a PDF
                </span>
              )}
            </span>
          </label>
          <input
            id={id("cv")}
            name="cv"
            type="file"
            accept="application/pdf,.pdf"
            required
            onChange={onCvChange}
            aria-invalid={!!errors.cv}
            className="sr-only"
          />
          {fieldError("cv")}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={id("heardFrom")}>
            How did you hear about us (optional)
          </Label>
          {selectControl(
            "heardFrom",
            id("heardFrom"),
            "Choose an option",
            heardFromOptions
          )}
        </div>
      </section>

      <div className="flex items-start gap-3">
        <Checkbox
          checked={values.consent}
          onCheckedChange={(checked) => setField("consent", checked === true)}
          required
          aria-invalid={!!errors.consent}
          aria-labelledby={id("consent-label")}
          className="mt-0.5 shrink-0"
        />
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span id={id("consent-label")}>
            I consent to the centre storing my details and CV to process this
            training application.
          </span>{" "}
          <Link href="/privacy" className="link whitespace-nowrap">
            Privacy Policy
          </Link>
        </p>
      </div>
      {fieldError("consent")}

      <button
        type="submit"
        data-slot="button"
        data-variant="default"
        data-size="lg"
        disabled={isSubmitting}
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-12 w-full whitespace-nowrap bg-primary text-white hover:bg-primary-hover max-md:sticky max-md:bottom-0 max-md:z-10"
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          "Submit application"
        )}
      </button>
    </form>
  );
}
