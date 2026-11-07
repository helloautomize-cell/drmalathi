import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addDays,
  bookingSchema,
  isBookingDateValid,
  istDateString,
  istStamp,
  maskMobile,
  normalizeMobile,
  qrSourceOrUnknown,
} from "@/lib/booking-schema";
import {
  bookSlot,
  getAvailability,
  parseSheetStamp,
  ping,
  sanitiseCell,
} from "@/lib/google-sheets";

const NOW = new Date("2026-10-16T06:12:00Z"); // 11:42 IST
const TODAY = istDateString(NOW); // "2026-10-16"

const VALID = {
  name: "Anitha R",
  mobile: "9876543210",
  visitType: "New consultation",
  reason: "Genetic Counselling",
  date: addDays(istDateString(), 10),
  slotStart: "09:00",
  notes: "",
  consent: true,
  source: "reception",
};

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

describe("visit type and reason", () => {
  it("rejects an unknown visit type", () => {
    expect(
      bookingSchema.safeParse({ ...VALID, visitType: "Checkup" }).success
    ).toBe(false);
  });

  it("rejects a reason that does not belong to the visit type", () => {
    expect(
      bookingSchema.safeParse({
        ...VALID,
        visitType: "Follow-up",
        reason: "Genetic Counselling",
      }).success
    ).toBe(false);
    expect(
      bookingSchema.safeParse({ ...VALID, reason: "Anomaly Scan" }).success
    ).toBe(false);
  });

  it("accepts a test under Test only", () => {
    expect(
      bookingSchema.safeParse({
        ...VALID,
        visitType: "Test only",
        reason: "Anomaly Scan",
      }).success
    ).toBe(true);
  });
});

describe("booking date in IST", () => {
  it("accepts today through 30 days ahead", () => {
    expect(isBookingDateValid(TODAY, TODAY)).toBe(true);
    expect(isBookingDateValid(addDays(TODAY, 30), TODAY)).toBe(true);
  });

  it("rejects the past, beyond 30 days and malformed dates", () => {
    expect(isBookingDateValid(addDays(TODAY, -1), TODAY)).toBe(false);
    expect(isBookingDateValid(addDays(TODAY, 31), TODAY)).toBe(false);
    expect(isBookingDateValid("16-10-2026", TODAY)).toBe(false);
    expect(isBookingDateValid("2026-02-30", TODAY)).toBe(false);
  });

  it("stores the stamp in IST", () => {
    expect(TODAY).toBe("2026-10-16");
    expect(istStamp(NOW)).toBe("2026-10-16 11:42");
    expect(parseSheetStamp("2026-10-16 11:42")).toBe(NOW.getTime());
  });
});

describe("slot start format", () => {
  it("requires HH:mm", () => {
    expect(
      bookingSchema.safeParse({ ...VALID, slotStart: "9 am" }).success
    ).toBe(false);
    expect(
      bookingSchema.safeParse({ ...VALID, slotStart: "9:00" }).success
    ).toBe(false);
    expect(
      bookingSchema.safeParse({ ...VALID, slotStart: "10:30" }).success
    ).toBe(true);
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

  it("ping posts the secret and reports ok", async () => {
    Object.assign(process.env, env);
    const mock = stubFetch(async () => ({
      ok: true,
      json: async () => ({ ok: true }),
    }));
    expect(await ping()).toBe(true);
    const sent = JSON.parse(String(mock.mock.calls[0][1].body));
    expect(sent).toEqual({ action: "ping", secret: "test-secret" });
  });

  it("ping returns false on a webhook failure instead of throwing", async () => {
    Object.assign(process.env, env);
    stubFetch(async () => ({ ok: true, json: async () => ({ ok: false }) }));
    expect(await ping()).toBe(false);
  });

  it("availability returns days with slots", async () => {
    Object.assign(process.env, env);
    const day = {
      date: "2026-10-20",
      closed: false,
      reason: "",
      slots: [
        {
          start: "09:00",
          end: "10:00",
          label: "9 am to 10 am",
          capacity: 4,
          left: 3,
          open: true,
        },
      ],
    };
    const mock = stubFetch(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        today: "2026-10-16",
        lastDate: "2026-11-15",
        dates: [day],
      }),
    }));
    const res = await getAvailability("2026-10-20", 1);
    expect(res).toEqual({
      ok: true,
      today: "2026-10-16",
      lastDate: "2026-11-15",
      dates: [day],
    });
    const sent = JSON.parse(String(mock.mock.calls[0][1].body));
    expect(sent).toEqual({
      action: "availability",
      from: "2026-10-20",
      days: 1,
      secret: "test-secret",
    });
  });

  it("availability maps ok false to { ok: false }", async () => {
    Object.assign(process.env, env);
    stubFetch(async () => ({ ok: true, json: async () => ({ ok: false }) }));
    await expect(getAvailability("2026-10-21", 1)).resolves.toEqual({
      ok: false,
    });
  });

  it("availability rejects on unparseable JSON", async () => {
    Object.assign(process.env, env);
    stubFetch(async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError("Unexpected token");
      },
    }));
    await expect(getAvailability("2026-10-22", 1)).rejects.toThrow();
  });

  it("book posts the booking with the secret and returns the slot label", async () => {
    Object.assign(process.env, env);
    const mock = stubFetch(async () => ({
      ok: true,
      json: async () => ({ ok: true, code: "ok", slot: "9 am to 10 am" }),
    }));
    const result = await bookSlot({
      id: "bk_abcdefgh",
      source: "website-book",
      name: "Anitha R",
      mobile: "9876543210",
      visitType: "New consultation",
      reason: "Genetic Counselling",
      date: "2026-10-20",
      slotStart: "09:00",
      notes: "",
      consent: "v1",
    });
    expect(result).toEqual({ ok: true, code: "ok", slot: "9 am to 10 am" });
    const sent = JSON.parse(String(mock.mock.calls[0][1].body));
    expect(sent.action).toBe("book");
    expect(sent.secret).toBe("test-secret");
    expect(sent.booking.id).toBe("bk_abcdefgh");
    expect(sent.booking.slotStart).toBe("09:00");
  });

  it("book maps every refusal code through", async () => {
    Object.assign(process.env, env);
    for (const code of [
      "slot_full",
      "slot_closed",
      "duplicate",
      "limit",
      "busy",
      "invalid",
    ]) {
      stubFetch(async () => ({
        ok: true,
        json: async () => ({ ok: false, code }),
      }));
      const result = await bookSlot({
        id: "bk_abcdefgh",
        source: "website-book",
        name: "Anitha R",
        mobile: "9876543210",
        visitType: "New consultation",
        reason: "Genetic Counselling",
        date: "2026-10-20",
        slotStart: "09:00",
        notes: "",
        consent: "v1",
      });
      expect(result).toEqual({ ok: false, code });
    }
  });

  it("book maps an unexpected answer to failed", async () => {
    Object.assign(process.env, env);
    stubFetch(async () => ({ ok: true, json: async () => ({ ok: false }) }));
    const result = await bookSlot({
      id: "bk_abcdefgh",
      source: "website-book",
      name: "Anitha R",
      mobile: "9876543210",
      visitType: "New consultation",
      reason: "Genetic Counselling",
      date: "2026-10-20",
      slotStart: "09:00",
      notes: "",
      consent: "v1",
    });
    expect(result).toEqual({ ok: false, code: "failed" });
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
    const promise = getAvailability("2026-10-23", 1);
    const assertion = expect(promise).rejects.toThrow();
    await vi.advanceTimersByTimeAsync(16000);
    await assertion;
  });
});
