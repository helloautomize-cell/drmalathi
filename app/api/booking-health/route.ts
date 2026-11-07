import { ping } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

/**
 * Two second check that the Sheet backend is alive. Returns only a boolean
 * and status: no webhook URL, no error text, nothing else. Used to tell
 * "the Sheet is down" from "the form is broken" when bookings stop.
 */
export async function GET() {
  const ok = await ping();
  return new Response(JSON.stringify({ ok }), {
    status: ok ? 200 : 503,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
