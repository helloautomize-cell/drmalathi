import { NextResponse, type NextRequest } from "next/server";

// Uppercase path segments 308 to lowercase (e.g. /services/NIPT). Filenames
// under public/ keep their exact case and are excluded by the matcher.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lower = pathname.toLowerCase();
  if (pathname === lower) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = lower;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    // Skip _next, api and any path containing a dot (static assets).
    "/((?!_next|api|.*\\..*).*)",
  ],
};
