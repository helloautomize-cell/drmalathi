import { qrSourceOrUnknown } from "@/lib/booking-schema";

/**
 * Short links behind the printed QR codes: /q/reception, /q/scan-room,
 * /q/opd and /q/website. A 307 (temporary) redirect is used so browsers do
 * not cache the destination and the clinic can repoint or retire a code
 * later without reprinting. Unknown locations land on /book as "unknown".
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ location: string }> }
): Promise<Response> {
  const { location } = await context.params;
  const src = qrSourceOrUnknown(location);
  const target = new URL(`/book?src=${src}`, request.url);
  return new Response(null, {
    status: 307,
    headers: {
      Location: target.toString(),
      "Cache-Control": "no-store",
    },
  });
}
