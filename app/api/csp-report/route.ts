import { NextResponse } from "next/server";

/**
 * Receives Content-Security-Policy violation reports while the site runs in
 * Report-Only mode. Both formats are handled:
 *  - report-uri  -> { "csp-report": {...} }
 *  - report-to / Reporting-Endpoints -> [ { type, body: {...} } ]
 * Reports are logged so the hosting logs hold the baseline needed before the
 * policy is flipped to enforce.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 64_000) {
      return new NextResponse(null, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (Array.isArray(body)) {
    for (const entry of body) {
      if (entry && typeof entry === "object" && "type" in entry) {
        console.warn(
          "[csp-report]",
          JSON.stringify({ type: entry.type, body: entry.body })
        );
      }
    }
  } else if (
    body &&
    typeof body === "object" &&
    "csp-report" in body
  ) {
    console.warn("[csp-report]", JSON.stringify(body["csp-report"]));
  }

  return new NextResponse(null, { status: 204 });
}
