import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { BookForm } from "@/components/forms/book-form";
import { Container } from "@/components/shared/container";
import { site } from "@/data/site";
import { qrSourceOrUnknown } from "@/lib/booking-schema";

export const metadata: Metadata = {
  title: "Book an appointment",
  description:
    "Book an appointment at Trichy Fetal Medicine and Fertility Centre. Pick a day and time slot; our team will call you to confirm.",
  robots: { index: false, follow: true },
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

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto w-full max-w-4xl">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Book an appointment
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Pick a day and time slot that suits you. Our team will call you to
            confirm the appointment.
          </p>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 rounded-2xl border border-rose-tint bg-white p-5 shadow-sm sm:p-6">
              <BookForm source={source} />
            </div>
            <aside className="space-y-4 rounded-2xl border border-rose-tint bg-blush p-5">
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-ink">Address</p>
                  <a
                    href={site.address.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-sm text-muted-foreground"
                  >
                    {site.address.lines.join(" ")}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-ink">Hours</p>
                  <p className="text-sm text-muted-foreground">{site.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-ink">Phone</p>
                  {site.phones.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      className="link block text-sm text-muted-foreground"
                    >
                      {p.label}
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}
