"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { requestCourseEnquiry } from "@/app/actions/appointment";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,15}$/, "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  qualification: z.string().min(1, "Please choose your qualification."),
  course: z.string().min(1, "Please choose a course."),
  message: z.string().trim().max(1000).optional(),
  consent: z.literal(true, {
    error: "Please accept so we can respond to your enquiry.",
  }),
  company_url: z.string().optional(),
});

type EnquiryValues = z.infer<typeof enquirySchema>;

export function CourseEnquiryDialog({
  course,
  triggerClassName = "inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none",
}: {
  course: Course;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      qualification: "",
      course: course.slug,
      message: "",
      company_url: "",
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setStartedAt(new Date().toISOString());
      reset({
        name: "",
        phone: "",
        email: "",
        qualification: "",
        course: course.slug,
        message: "",
        company_url: "",
      });
    }
  }

  async function onSubmit(values: EnquiryValues) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("phone", values.phone);
    formData.set("email", values.email);
    formData.set("qualification", values.qualification);
    formData.set("course", values.course);
    formData.set("message", values.message ?? "");
    formData.set("consent", values.consent ? "on" : "");
    formData.set("company_url", values.company_url ?? "");
    formData.set("startedAt", startedAt);

    const result = await requestCourseEnquiry(formData);
    if (result.ok) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  }

  const id = `course-enquiry-${course.slug}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<button type="button" className={triggerClassName} />}
      >
        Enquire about this course
        <ArrowRight className="size-4" aria-hidden="true" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Course enquiry</DialogTitle>
          <DialogDescription>
            Ask about eligibility and admissions. The selected course is already
            filled in for you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("company_url")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-name`}>Name</Label>
              <Input
                id={`${id}-name`}
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-phone`}>Phone</Label>
              <Input
                id={`${id}-phone`}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
              {errors.phone ? (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              id={`${id}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-qualification`}>Qualification</Label>
              <Controller
                control={control}
                name="qualification"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id={`${id}-qualification`}
                      className="w-full bg-white"
                      aria-invalid={!!errors.qualification}
                    >
                      <SelectValue>
                        {(value: string) =>
                          courseQualificationOptions.find(
                            (option) => option.value === value
                          )?.label ?? "Select qualification"
                        }
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
                )}
              />
              {errors.qualification ? (
                <p className="text-sm text-destructive">
                  {errors.qualification.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-course`}>Course</Label>
              <Controller
                control={control}
                name="course"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={`${id}-course`} className="w-full bg-white">
                      <SelectValue>
                        {(value: string) =>
                          courses.find((item) => item.slug === value)?.title ??
                          "Select course"
                        }
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
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${id}-message`}>Message (optional)</Label>
            <Textarea
              id={`${id}-message`}
              rows={3}
              aria-invalid={!!errors.message}
              {...register("message")}
            />
          </div>

          <div className="flex items-start gap-2.5">
            <Controller
              control={control}
              name="consent"
              render={({ field }) => (
                <Checkbox
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  aria-invalid={!!errors.consent}
                  aria-labelledby={`${id}-consent-label`}
                  className="mt-0.5 shrink-0"
                />
              )}
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
            <p className="text-sm text-destructive">{errors.consent.message}</p>
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
