import type { Metadata } from "next";
import { BookForm } from "@/components/forms/book-form";
import { bookingOptionLists } from "@/components/forms/booking-fields";
import { Container } from "@/components/shared/container";
import {
  addDays,
  istDateString,
  qrSourceOrUnknown,
} from "@/lib/booking-schema";

export const metadata: Metadata = {
  title: "Request an appointment",
  description:
    "Request an appointment at Trichy Fetal Medicine and Fertility Centre. Our team will call you to confirm the time.",
  robots: { index: false, follow: false },
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string }>;
}) {
  // src is only accepted from the clinic QR codes; anything else becomes
  // "unknown" so the Sheet rows stay trustworthy.
  const { src } = await searchParams;
  const source = qrSourceOrUnknown(src);

  const today = istDateString();
  const { serviceOptions, doctorOptions } = bookingOptionLists();

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Request an appointment
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Choose a service and a preferred day. Our team will call you to
            confirm the time.
          </p>
          <div className="mt-6 rounded-2xl border border-rose-tint bg-white p-5 shadow-sm sm:p-6">
            <BookForm
              source={source}
              serviceOptions={serviceOptions}
              doctorOptions={doctorOptions}
              minDate={addDays(today, 1)}
              maxDate={addDays(today, 60)}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
