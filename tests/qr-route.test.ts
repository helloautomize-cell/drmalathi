import { describe, expect, it } from "vitest";
import { GET } from "@/app/q/[location]/route";

function call(location: string) {
  return GET(new Request(`https://fmctrichy.com/q/${location}`), {
    params: Promise.resolve({ location }),
  });
}

describe("q short-link route", () => {
  it("307 redirects each allowed location to /book?src=<location>", async () => {
    for (const location of ["reception", "scan-room", "opd", "website"]) {
      const res = await call(location);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe(
        `https://fmctrichy.com/book?src=${location}`
      );
      expect(res.headers.get("cache-control")).toBe("no-store");
    }
  });

  it("307 redirects unknown locations to /book?src=unknown", async () => {
    for (const location of ["evil", "", "RECEPTION", "book"]) {
      const res = await call(location);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe(
        "https://fmctrichy.com/book?src=unknown"
      );
    }
  });
});
