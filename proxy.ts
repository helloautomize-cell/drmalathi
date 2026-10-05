import { NextResponse, type NextRequest } from "next/server";

// Only the public domain may be crawled. Every other host serving this app
// (drmalathi.vercel.app, preview deploys, localhost) gets a disallow-all
// robots.txt and noindex/nofollow on every response.
const CANONICAL_HOSTS = new Set(["fmctrichy.com", "www.fmctrichy.com"]);

const DISALLOW_ALL = "User-Agent: *\nDisallow: /\n";

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const canonical =
    CANONICAL_HOSTS.has(host) || process.env.INDEXABLE === "1";
  const { pathname } = request.nextUrl;

  if (pathname === "/robots.txt") {
    if (canonical) return NextResponse.next();
    return new NextResponse(DISALLOW_ALL, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Uppercase path segments 308 to lowercase (e.g. /services/NIPT). Filenames
  // under public/ keep their exact case and are excluded by the matcher.
  const lower = pathname.toLowerCase();
  let response: NextResponse;
  if (pathname === lower) {
    response = NextResponse.next();
  } else {
    const url = request.nextUrl.clone();
    url.pathname = lower;
    response = NextResponse.redirect(url, 308);
  }

  if (!canonical) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: [
    "/robots.txt",
    // Skip _next, api and any path containing a dot (static assets).
    "/((?!_next|api|.*\\..*).*)",
  ],
};
