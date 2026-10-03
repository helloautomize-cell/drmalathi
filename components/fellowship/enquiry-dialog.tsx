"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/data/courses";

// The dialog + enquiry form  load on first
// interaction only; nothing form-related reaches the shared layout chunk.
const CourseEnquiryDialogContent = dynamic(
  () => import("@/components/fellowship/enquiry-dialog-content"),
  { ssr: false }
);

export function CourseEnquiryDialog({
  course,
  triggerClassName = "inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none",
}: {
  course: Course;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [preload, setPreload] = useState(false);

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onPointerEnter={() => setPreload(true)}
        onFocus={() => setPreload(true)}
        onClick={() => {
          setPreload(true);
          setOpen(true);
        }}
      >
        Enquire about this course
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
      {preload ? (
        <CourseEnquiryDialogContent
          course={course}
          open={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </>
  );
}
