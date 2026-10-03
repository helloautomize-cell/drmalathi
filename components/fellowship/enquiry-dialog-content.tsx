"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { requestCourseEnquiry } from "@/app/actions/appointment";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  courseQualificationOptions,
  courses,
  type Course,
} from "@/data/courses";
import {
  type EnquiryField,
  phoneInputPattern,
  validateCourseEnquiry,
} from "@/lib/lead-validation";

const courseSlugs = courses.map((course) => course.slug);
const qualificationValues = courseQualificationOptions.map(
  (option) => option.value
);

export default function CourseEnquiryDialogContent({
  course,
  open,
  onOpenChange,
}: {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const initialValues = {
    name: "",
    phone: "",
    email: "",
    qualification: "",
    course: course.slug,
    message: "",
    consent: false,
  };
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<EnquiryField, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key as EnquiryField] ? { ...e, [key]: undefined } : e));
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (nextOpen) {
      setStartedAt(new Date().toISOString());
      setValues({ ...initialValues, course: course.slug });
      setErrors({});
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = validateCourseEnquiry(values, {
      courseSlugs,
      qualificationValues,
    });
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const { toast } = await import("sonner");
      const formData = new FormData(event.currentTarget);
      formData.set("qualification", parsed.data.qualification);
      formData.set("course", parsed.data.course);
      formData.set("consent", values.consent ? "on" : "");
      formData.set("startedAt", startedAt);

      const result = await requestCourseEnquiry(formData);
      if (result.ok) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const id = `course-enquiry-${course.slug}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Course enquiry</DialogTitle>
          <DialogDescription>
            Ask about eligibility and admissions. The selected course is already
            filled in for you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input
              type="text"
              name="company_url"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-name`}>Name</Label>
              <Input
                id={`${id}-name`}
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                value={values.name}
                onChange={(e) => setField("name", e.target.value)}
                aria-invalid={!!errors.name}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-phone`}>Phone</Label>
              <Input
                id={`${id}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                pattern={phoneInputPattern}
                value={values.phone}
                onChange={(e) => setField("phone", e.target.value)}
                aria-invalid={!!errors.phone}
              />
              {errors.phone ? (
                <p className="text-sm text-destructive">{errors.phone}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={160}
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-qualification`}>Qualification</Label>
              <Select
                value={values.qualification}
                onValueChange={(v) => setField("qualification", v ?? "")}
              >
                <SelectTrigger
                  id={`${id}-qualification`}
                  className="w-full bg-white"
                  aria-invalid={!!errors.qualification}
                >
                  <SelectValue>
                    {(value: string) =>
                      courseQualificationOptions.find(
                        (option) => option.value === value
                      )?.label ?? "Select qualification"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {courseQualificationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.qualification ? (
                <p className="text-sm text-destructive">
                  {errors.qualification}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-course`}>Course</Label>
              <Select
                value={values.course}
                onValueChange={(v) => setField("course", v ?? course.slug)}
              >
                <SelectTrigger id={`${id}-course`} className="w-full bg-white">
                  <SelectValue>
                    {(value: string) =>
                      courses.find((item) => item.slug === value)?.title ??
                      "Select course"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {courses.map((item) => (
                    <SelectItem key={item.slug} value={item.slug}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${id}-message`}>Message (optional)</Label>
            <Textarea
              id={`${id}-message`}
              name="message"
              rows={3}
              maxLength={1000}
              value={values.message}
              onChange={(e) => setField("message", e.target.value)}
              aria-invalid={!!errors.message}
            />
            {errors.message ? (
              <p className="text-sm text-destructive">{errors.message}</p>
            ) : null}
          </div>

          <div className="flex items-start gap-2.5">
            <Checkbox
              checked={values.consent}
              onCheckedChange={(checked) =>
                setField("consent", checked === true)
              }
              required
              aria-invalid={!!errors.consent}
              aria-labelledby={`${id}-consent-label`}
              className="mt-0.5 shrink-0"
            />
            <p className="text-sm leading-snug text-muted-foreground">
              <span id={`${id}-consent-label`}>
                I consent to the centre contacting me about this course enquiry.
              </span>{" "}
              <Link href="/privacy" className="link whitespace-nowrap">
                Privacy Policy
              </Link>
            </p>
          </div>
          {errors.consent ? (
            <p className="text-sm text-destructive">{errors.consent}</p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="min-h-12 w-full bg-primary text-white hover:bg-primary-hover max-md:sticky max-md:bottom-0 max-md:z-10"
          >
            {isSubmitting ? "Sending..." : "Send course enquiry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
