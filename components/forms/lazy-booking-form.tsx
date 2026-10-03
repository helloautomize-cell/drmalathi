"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const BookingForm = dynamic(
  () => import("@/components/forms/booking-form").then((m) => m.BookingForm),
  { ssr: false }
);

/**
 * The international-patients lead form sits mid-page; its form libraries
 *  load when the visitor scrolls it into view or
 * interacts near it, keeping them out of the initial page bundle.
 */
export function LazyBookingForm({ source }: { source: string }) {
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
        <BookingForm source={source} />
      ) : (
        <div
          className="min-h-[420px] rounded-2xl bg-blush/60"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
