"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { BookingOption } from "@/components/forms/booking-fields";

const QuickConsultForm = dynamic(
  () =>
    import("@/components/forms/quick-consult-form").then(
      (m) => m.QuickConsultForm
    ),
  { ssr: false }
);

/**
 * The contact-page callback form sits below the fold; its JS loads only when
 * the visitor scrolls it near the viewport or focuses/points at it. Until
 * then it renders `placeholder`, the same form markup rendered server-side
 * in non-interactive mode, so the page is identical before hydration.
 */
export function LazyQuickConsultForm({
  doctorOptions,
  serviceOptions,
  placeholder,
}: {
  doctorOptions: BookingOption[];
  serviceOptions: BookingOption[];
  placeholder: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (load) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  return (
    <div
      ref={ref}
      onPointerEnter={() => setLoad(true)}
      onFocus={() => setLoad(true)}
    >
      {load ? (
        <QuickConsultForm
          doctorOptions={doctorOptions}
          serviceOptions={serviceOptions}
        />
      ) : (
        placeholder
      )}
    </div>
  );
}
