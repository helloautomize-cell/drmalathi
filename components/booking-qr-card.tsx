import Link from "next/link";
import { cn } from "cn";
import { BOOKING_QR_URL, qrSvgPath } from "@/lib/qr-svg";

/**
 * Website booking QR card for desktop viewports. Server component: the QR
 * matrix comes from QRCode.create, so the whole card renders to HTML with
 * no client JavaScript. It stays hidden below lg because a phone cannot
 * scan its own screen. At most one of these cards may render per page.
 *
 * variant="band": centered white card for the dark CTA band (QR 160px).
 * variant="compact": QR left, text right, for the /contact address block.
 */
export function BookingQrCard({
  variant = "band",
  className,
}: {
  variant?: "band" | "compact";
  className?: string;
}) {
  const { size, d } = qrSvgPath(BOOKING_QR_URL);

  const svg = (
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
  );

  const copy = (
    <>
      <p className="text-base font-semibold text-ink">Book from your phone</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        Scan with your camera to open our booking form
      </p>
      <Link
        href="/book?src=website"
        className="link mt-2 inline-block text-sm font-semibold"
      >
        Or open the booking page
      </Link>
    </>
  );

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "hidden items-center gap-5 rounded-2xl border border-rose-tint bg-white p-5 shadow-soft lg:flex",
          className
        )}
      >
        {/* 12px quiet zone around the code on pure white for reliable scans. */}
        <div className="w-[120px] shrink-0 rounded-xl bg-white p-3 ring-1 ring-rose-tint">
          {svg}
        </div>
        <div className="min-w-0">{copy}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "hidden rounded-2xl border border-rose-tint bg-white p-6 text-center shadow-soft lg:block",
        className
      )}
    >
      <div className="mx-auto w-40 rounded-xl bg-white p-3 ring-1 ring-rose-tint">
        {svg}
      </div>
      <div className="mt-4">{copy}</div>
    </div>
  );
}
