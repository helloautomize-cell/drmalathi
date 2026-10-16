import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addDays,
  bookingSchema,
  isPreferredDateValid,
  istDateString,
  istStamp,
  maskMobile,
  normalizeMobile,
  qrSourceOrUnknown,
} from "@/lib/booking-schema";
import {
  appendRow,
  buildRow,
  evaluateLimits,
  parseSheetStamp,
  readRecentRows,
  sanitiseCell,
} from "@/lib/google-sheets";

const NOW = new Date("2026-10-16T06:12:00Z"); // 11:42 IST
const TODAY = istDateString(NOW); // "2026-10-16"

const VALID = {
  name: "Anitha R",
  mobile: "9876543210",
  service: "Anomaly Scan",
  doctor: "Dr Malathi G. Prasad",
  preferredDate: addDays(TODAY, 10),
  preferredTime: "Morning",
  notes: "",
  consent: true,
  source: "reception",
};

function row(over: Partial<{
  submittedAt: string;
  mobile: string;
  service: string;
  preferredDate: string;
}> = {}): string[] {
  const r = new Array(8).fill("");
  r[0] = over.submittedAt ?? istStamp(NOW);
  r[4] = over.mobile ?? "9999999999";
  r[5] = over.service ?? "Other";
  r[7] = over.preferredDate ?? "2026-10-20";
  return r;
}

describe("mobile normalisation", () => {
  it("strips +91, spaces and a leading zero", () => {
    expect(normalizeMobile("+91 98765 43210")).toBe("9876543210");
    expect(normalizeMobile("09876543210")).toBe("9876543210");
    expect(normalizeMobile("91 9876543210")).toBe("9876543210");
    expect(normalizeMobile("  98765 43210 ")).toBe("9876543210");
  });

  it("accepts a valid 10 digit mobile through the schema", () => {
    const parsed = bookingSchema.safeParse({ ...VALID, mobile: "+91 98765 43210" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.mobile).toBe("9876543210");
  });

  it("rejects numbers that are not phones", () => {
    for (const bad of ["12345", "abcdefghij", "+9100"]) {
      expect(
        bookingSchema.safeParse({ ...VALID, mobile: bad }).success
      ).toBe(false);
    }
  });

  it("still accepts plausible international numbers", () => {
    // The website forms (including international-patients) share this
    // schema, so non Indian numbers in a sane format must not be rejected.
    expect(
      bookingSchema.safeParse({ ...VALID, mobile: "+14155552671" }).success
    ).toBe(true);
  });
});

describe("name and notes lengths", () => {
  it("trims the name and enforces 2 to 60 characters", () => {
    expect(
      bookingSchema.safeParse({ ...VALID, name: "  Anitha R  " }).success
    ).toBe(true);
    expect(bookingSchema.safeParse({ ...VALID, name: "A" }).success).toBe(false);
    expect(
      bookingSchema.safeParse({ ...VALID, name: "x".repeat(61) }).success
    ).toBe(false);
  });

  it("caps notes at 300 characters and defaults to empty", () => {
    expect(
      bookingSchema.safeParse({ ...VALID, notes: "x".repeat(301) }).success
    ).toBe(false);
    const parsed = bookingSchema.safeParse({ ...VALID, notes: undefined });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.notes).toBe("");
  });
});

describe("preferred date in IST", () => {
  it("accepts tomorrow through 60 days ahead", () => {
    const tomorrow = addDays(TODAY, 1);
    const last = addDays(TODAY, 60);
    expect(isPreferredDateValid(tomorrow, TODAY)).toBe(true);
    expect(isPreferredDateValid(last, TODAY)).toBe(true);
  });

  it("rejects today, the past, beyond 60 days and malformed dates", () => {
    expect(isPreferredDateValid(TODAY, TODAY)).toBe(false);
    expect(isPreferredDateValid(addDays(TODAY, -1), TODAY)).toBe(false);
    expect(isPreferredDateValid(addDays(TODAY, 61), TODAY)).toBe(false);
    expect(isPreferredDateValid("16-10-2026", TODAY)).toBe(false);
    expect(isPreferredDateValid("2026-02-30", TODAY)).toBe(false);
  });

  it("stores the stamp in IST", () => {
    expect(TODAY).toBe("2026-10-16");
    expect(istStamp(NOW)).toBe("2026-10-16 11:42");
    expect(parseSheetStamp("2026-10-16 11:42")).toBe(NOW.getTime());
  });
});

describe("source validation", () => {
  it("keeps the three QR sources and maps the rest to unknown", () => {
    expect(qrSourceOrUnknown("reception")).toBe("reception");
    expect(qrSourceOrUnknown("scan-room")).toBe("scan-room");
    expect(qrSourceOrUnknown("opd")).toBe("opd");
    expect(qrSourceOrUnknown("evil")).toBe("unknown");
    expect(qrSourceOrUnknown(undefined)).toBe("unknown");
  });
});

describe("cell sanitiser", () => {
  it("prefixes formula leading characters with an apostrophe", () => {
    expect(sanitiseCell('=HYPERLINK("x")')).toBe("'=HYPERLINK(\"x\")");
    expect(sanitiseCell("+91 x")).toBe("'+91 x");
    expect(sanitiseCell("-1")).toBe("'-1");
    expect(sanitiseCell("@cmd")).toBe("'@cmd");
    expect(sanitiseCell("\t=1")).toBe("'\t=1");
    expect(sanitiseCell("plain text")).toBe("plain text");
  });
});

describe("sheet row shape", () => {
  it("writes the 13 columns in the fixed order", () => {
    const r = buildRow({
      bookingId: "bk_abcdefgh",
      source: "reception",
      name: "Anitha R",
      mobile: "9876543210",
      service: "Anomaly Scan",
      doctor: "Dr Malathi G. Prasad",
      preferredDate: "2026-10-20",
      preferredTime: "Morning",
      notes: '=HYPERLINK("x")',
      now: NOW,
    });
    expect(r).toHaveLength(13);
    expect(r[0]).toBe("2026-10-16 11:42");
    expect(r[1]).toBe("bk_abcdefgh");
    expect(r[2]).toBe("reception");
    expect(r[9]).toBe("'=HYPERLINK(\"x\")");
    expect(r[10]).toBe("v1");
    expect(r[11]).toBe("New");
    expect(r[12]).toBe("");
  });
});

describe("sheet limits", () => {
  const ctx = { mobile: "9876543210", service: "Anomaly Scan", preferredDate: "2026-10-20" };

  it("blocks when more than 100 rows were submitted today", () => {
    const rows = [row(), ...Array.from({ length: 101 }, () => row())];
    expect(evaluateLimits(rows, ctx, NOW)).toBe("daily-limit");
  });

  it("silently accepts a same mobile, service and date within 24 hours", () => {
    const rows = [row({ mobile: ctx.mobile, service: ctx.service, preferredDate: ctx.preferredDate })];
    expect(evaluateLimits(rows, ctx, NOW)).toBe("duplicate");
  });

  it("blocks a third request from the same mobile within 24 hours", () => {
    const rows = [
      row({ mobile: ctx.mobile, service: "NIPT" }),
      row({ mobile: ctx.mobile, service: "Growth Scan" }),
    ];
    expect(evaluateLimits(rows, ctx, NOW)).toBe("rate-limit");
  });

  it("ignores rows older than 24 hours", () => {
    const rows = [
      row({ mobile: ctx.mobile, submittedAt: "2026-10-10 09:00" }),
      row({ mobile: ctx.mobile, submittedAt: "2026-10-10 10:00" }),
      row({ mobile: ctx.mobile, service: ctx.service, preferredDate: ctx.preferredDate, submittedAt: "2026-10-10 11:00" }),
    ];
    expect(evaluateLimits(rows, ctx, NOW)).toBe("ok");
  });

  it("passes a normal first request", () => {
    expect(evaluateLimits([row()], ctx, NOW)).toBe("ok");
  });
});

describe("misc helpers", () => {
  it("masks the mobile for the success card", () => {
    expect(maskMobile("9876543210")).toBe("98XXXXXX10");
  });
});

describe("webhook client", () => {
  const env = {
    SHEETS_WEBHOOK_URL: "https://script.example/exec",
    SHEETS_WEBHOOK_SECRET: "test-secret",
  };

  function stubFetch(impl: (body: string) => Promise<Partial<Response>>) {
    const mock = vi.fn((_url: string, init: RequestInit) =>
      impl(String(init.body))
    );
    vi.stubGlobal("fetch", mock);
    return mock;
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    delete process.env.SHEETS_WEBHOOK_URL;
    delete process.env.SHEETS_WEBHOOK_SECRET;
  });

  it("posts the secret and action, and returns rows on success", async () => {
    Object.assign(process.env, env);
    const mock = stubFetch(async () => ({
      ok: true,
      json: async () => ({ ok: true, rows: [["a", "b"], ["c"]] }),
    }));
    const rows = await readRecentRows();
    expect(rows).toEqual([["a", "b"], ["c"]]);
    const sent = JSON.parse(String(mock.mock.calls[0][1].body));
    expect(sent).toEqual({ action: "recent", secret: "test-secret" });
  });

  it("rejects when the webhook answers ok false", async () => {
    Object.assign(process.env, env);
    stubFetch(async () => ({
      ok: true,
      json: async () => ({ ok: false }),
    }));
    await expect(readRecentRows()).rejects.toThrow();
  });

  it("rejects on unparseable JSON", async () => {
    Object.assign(process.env, env);
    stubFetch(async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError("Unexpected token");
      },
    }));
    await expect(readRecentRows()).rejects.toThrow();
  });

  it("appends a 13 value row with the secret", async () => {
    Object.assign(process.env, env);
    const mock = stubFetch(async () => ({
      ok: true,
      json: async () => ({ ok: true }),
    }));
    const row = buildRow({
      bookingId: "bk_abcdefgh",
      source: "reception",
      name: "Anitha R",
      mobile: "9876543210",
      service: "Anomaly Scan",
      doctor: "Dr Malathi G. Prasad",
      preferredDate: "2026-10-20",
      preferredTime: "Morning",
      notes: "",
      now: NOW,
    });
    await appendRow(row);
    const sent = JSON.parse(String(mock.mock.calls[0][1].body));
    expect(sent.action).toBe("append");
    expect(sent.secret).toBe("test-secret");
    expect(sent.row).toHaveLength(13);
  });

  it("append rejects on ok false", async () => {
    Object.assign(process.env, env);
    stubFetch(async () => ({
      ok: true,
      json: async () => ({ ok: false }),
    }));
    await expect(appendRow(["x"])).rejects.toThrow();
  });

  it("aborts the request after 15 seconds", async () => {
    Object.assign(process.env, env);
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener("abort", () =>
              reject(new DOMException("The operation was aborted", "AbortError"))
            );
          })
      )
    );
    const promise = appendRow(["x"]);
    const assertion = expect(promise).rejects.toThrow();
    await vi.advanceTimersByTimeAsync(16000);
    await assertion;
  });
});
