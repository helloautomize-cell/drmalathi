import Link from "next/link";
import { cn } from "cn";
import { BOOKING_QR_URL, qrSvgPath } from "@/lib/qr-svg";

/**
 * Inline SVG QR card. The module matrix comes from QRCode.create, which is
 * synchronous, so this component renders anywhere (server or client chunk)
 * while the /contact placement still ships zero client JavaScript.
 * Pure dark modules on a real white ground so phone cameras can read it
 * inside any dark section. Visibility classes are supplied by the caller so
 * each placement picks its own breakpoint.
 */
export function BookingQr({
  className,
  heading = "Book from your phone",
  subline = "Scan with your phone camera to request an appointment",
  link = true,
}: {
  className?: string;
  heading?: string;
  subline?: string;
  /** The "Or open the booking page" link; hidden in contexts that already
      show the full booking form. */
  link?: boolean;
}) {
  const { size, d } = qrSvgPath(BOOKING_QR_URL);

  return (
    <div
      className={cn(
        "rounded-2xl border border-rose-tint bg-white p-5 shadow-soft",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-ink">{heading}</h3>
      <div className="mx-auto mt-4 w-[140px] rounded-xl bg-white p-2 ring-1 ring-rose-tint">
        <svg
          role="img"
          aria-label="QR code to request an appointment at Trichy Fetal Medicine and Fertility Centre"
          viewBox={`0 0 ${size} ${size}`}
          shapeRendering="crispEdges"
          className="block h-auto w-full"
        >
          <rect width={size} height={size} fill="#ffffff" />
          <path d={d} fill="#000000" />
        </svg>
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        {subline}
      </p>
      {link ? (
        <p className="mt-2 text-center">
          <Link
            href="/book?src=website"
            className="link text-sm font-semibold"
          >
            Or open the booking page
          </Link>
        </p>
      ) : null}
    </div>
  );
}
