import { afterEach, describe, expect, it, vi } from "vitest";
import { istStamp } from "@/lib/booking-schema";
import {
  appendTrainingRow,
  buildTrainingRow,
  evaluateTrainingLimits,
  readRecentTrainingRows,
} from "@/lib/google-sheets";
import {
  cvFileLooksValid,
  CV_MAX_BYTES,
  normalisePreferredStart,
  preferredStartOptions,
  trainingApplicationSchema,
} from "@/lib/training-schema";

const NOW = new Date("2026-10-16T06:12:00Z"); // 11:42 IST

const VALID = {
  course: "fellowship-obstetric-ultrasound",
  fullName: "Anitha R",
  mobile: "9876543210",
  email: "anitha@example.com",
  city: "Tiruchirappalli, Tamil Nadu",
  qualification: "md-obg",
  status: "completed",
  year: "2019",
  registration: "TNMC12345",
  workplace: "",
  experience: "1-to-3-years",
  preferredStart: "",
  statement: "",
  heardFrom: "",
  consent: true,
};

function row(
  over: Partial<{
    submittedAt: string;
    course: string;
    mobile: string;
    email: string;
  }> = {}
): string[] {
  const r = new Array(7).fill("");
  r[0] = over.submittedAt ?? istStamp(NOW);
  r[3] = over.course ?? "Fellowship in Obstetric Ultrasound";
  r[5] = over.mobile ?? "9999999999";
  r[6] = over.email ?? "someone@example.com";
  return r;
}

describe("training application schema", () => {
  it("accepts a complete valid application", () => {
    const parsed = trainingApplicationSchema.safeParse(VALID);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.mobile).toBe("9876543210");
  });

  it("rejects a bad mobile", () => {
    for (const bad of ["12345", "abcdefghij", "+9100"]) {
      expect(
        trainingApplicationSchema.safeParse({ ...VALID, mobile: bad }).success
      ).toBe(false);
    }
  });

  it("normalises +91 mobiles", () => {
    const parsed = trainingApplicationSchema.safeParse({
      ...VALID,
      mobile: "+91 98765 43210",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.mobile).toBe("9876543210");
  });

  it("rejects years outside 1980 to next year", () => {
    for (const bad of ["1979", String(new Date().getFullYear() + 2), "abcd"]) {
      expect(
        trainingApplicationSchema.safeParse({ ...VALID, year: bad }).success
      ).toBe(false);
    }
    expect(
      trainingApplicationSchema.safeParse({
        ...VALID,
        year: String(new Date().getFullYear() + 1),
      }).success
    ).toBe(true);
  });

  it("rejects bad registration numbers", () => {
    for (const bad of ["ab", "reg number!", "x".repeat(31)]) {
      expect(
        trainingApplicationSchema.safeParse({ ...VALID, registration: bad })
          .success
      ).toBe(false);
    }
    expect(
      trainingApplicationSchema.safeParse({
        ...VALID,
        registration: "TN/1234-56",
      }).success
    ).toBe(true);
  });

  it("rejects an unknown course, qualification or status", () => {
    expect(
      trainingApplicationSchema.safeParse({ ...VALID, course: "evil" }).success
    ).toBe(false);
    expect(
      trainingApplicationSchema.safeParse({ ...VALID, qualification: "mba" })
        .success
    ).toBe(false);
    expect(
      trainingApplicationSchema.safeParse({ ...VALID, status: "dropped" })
        .success
    ).toBe(false);
  });

  it("requires consent", () => {
    expect(
      trainingApplicationSchema.safeParse({ ...VALID, consent: false }).success
    ).toBe(false);
  });
});

describe("CV file check", () => {
  it("accepts a real PDF within the size limit", () => {
    expect(
      cvFileLooksValid(
        { type: "application/pdf", size: 500_000 },
        "%PDF"
      )
    ).toBe(true);
  });

  it("rejects the wrong file type", () => {
    expect(
      cvFileLooksValid({ type: "image/png", size: 500_000 }, "%PDF")
    ).toBe(false);
  });

  it("rejects a file over 3 MB", () => {
    expect(
      cvFileLooksValid(
        { type: "application/pdf", size: CV_MAX_BYTES + 1 },
        "%PDF"
      )
    ).toBe(false);
  });

  it("rejects an empty file and a fake PDF without %PDF", () => {
    expect(
      cvFileLooksValid({ type: "application/pdf", size: 0 }, "%PDF")
    ).toBe(false);
    expect(
      cvFileLooksValid(
        { type: "application/pdf", size: 500_000 },
        "PK\x03\x04"
      )
    ).toBe(false);
  });
});

describe("preferred start options", () => {
  it("lists next intake plus six months", () => {
    const options = preferredStartOptions(NOW);
    expect(options).toHaveLength(7);
    expect(options[0]).toBe("Next intake");
    expect(options[1]).toBe("October 2026");
    expect(options[6]).toBe("March 2027");
  });

  it("keeps only a current option", () => {
    expect(normalisePreferredStart("Next intake", NOW)).toBe("Next intake");
    expect(normalisePreferredStart("October 2026", NOW)).toBe("October 2026");
    expect(normalisePreferredStart("June 2030", NOW)).toBe("");
    expect(normalisePreferredStart("", NOW)).toBe("");
  });
});

describe("training row shape", () => {
  it("writes the 21 columns in the fixed order", () => {
    const r = buildTrainingRow({
      applicationId: "TA-261016-ABCD",
      source: "website",
      course: "Fellowship in Obstetric Ultrasound",
      fullName: "Anitha R",
      mobile: "9876543210",
      email: "anitha@example.com",
      city: "Trichy",
      qualification: "MD OBG",
      status: "Completed",
      year: "2019",
      registration: "TNMC12345",
      workplace: "",
      experience: "1 to 3 years",
      preferredStart: "Next intake",
      statement: '=HYPERLINK("x")',
      heardFrom: "Colleague",
      now: NOW,
    });
    expect(r).toHaveLength(21);
    expect(r[0]).toBe("2026-10-16 11:42");
    expect(r[1]).toBe("TA-261016-ABCD");
    expect(r[2]).toBe("website");
    expect(r[3]).toBe("Fellowship in Obstetric Ultrasound");
    expect(r[15]).toBe("'=HYPERLINK(\"x\")");
    expect(r[16]).toBe("");
    expect(r[17]).toBe("Colleague");
    expect(r[18]).toBe("v1");
    expect(r[19]).toBe("New");
    expect(r[20]).toBe("");
  });
});

describe("training limits", () => {
  const ctx = {
    mobile: "9876543210",
    email: "anitha@example.com",
    course: "Fellowship in Obstetric Ultrasound",
  };

  it("stops after 30 rows today", () => {
    const rows = Array.from({ length: 30 }, () => row());
    expect(evaluateTrainingLimits(rows, ctx, NOW)).toBe("daily-limit");
    expect(evaluateTrainingLimits(rows.slice(0, 29), ctx, NOW)).toBe("ok");
  });

  it("silently accepts the same person and course within 7 days", () => {
    const rows = [
      row({ mobile: ctx.mobile, submittedAt: "2026-10-12 09:00" }),
    ];
    expect(evaluateTrainingLimits(rows, ctx, NOW)).toBe("duplicate");
    const byEmail = [row({ email: ctx.email })];
    expect(evaluateTrainingLimits(byEmail, ctx, NOW)).toBe("duplicate");
  });

  it("does not flag the same course after 7 days", () => {
    const rows = [
      row({ mobile: ctx.mobile, submittedAt: "2026-10-08 09:00" }),
    ];
    expect(evaluateTrainingLimits(rows, ctx, NOW)).toBe("ok");
  });

  it("does not flag the same person on a different course", () => {
    const rows = [row({ mobile: ctx.mobile, course: "Other course" })];
    // One other row from the same person within 24h is still under the cap.
    expect(evaluateTrainingLimits(rows, ctx, NOW)).toBe("ok");
  });

  it("declines a third application from the same person within 24 hours", () => {
    const rows = [
      row({ mobile: ctx.mobile, course: "A" }),
      row({ email: ctx.email, course: "B" }),
    ];
    expect(evaluateTrainingLimits(rows, ctx, NOW)).toBe("rate-limit");
  });

  it("matches email case insensitively", () => {
    const rows = [row({ email: "ANITHA@example.com", course: ctx.course })];
    expect(evaluateTrainingLimits(rows, ctx, NOW)).toBe("duplicate");
  });
});

describe("training webhook client", () => {
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

  it("posts recent_training with the secret and returns rows", async () => {
    Object.assign(process.env, env);
    const mock = stubFetch(async () => ({
      ok: true,
      json: async () => ({ ok: true, rows: [["a", "b"], ["c"]] }),
    }));
    const rows = await readRecentTrainingRows();
    expect(rows).toEqual([["a", "b"], ["c"]]);
    const sent = JSON.parse(String(mock.mock.calls[0][1].body));
    expect(sent).toEqual({ action: "recent_training", secret: "test-secret" });
  });

  it("rejects recent_training on ok false and bad JSON", async () => {
    Object.assign(process.env, env);
    stubFetch(async () => ({ ok: true, json: async () => ({ ok: false }) }));
    await expect(readRecentTrainingRows()).rejects.toThrow();
    stubFetch(async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError("Unexpected token");
      },
    }));
    await expect(readRecentTrainingRows()).rejects.toThrow();
  });

  it("posts append_training with row, cv and secret", async () => {
    Object.assign(process.env, env);
    const mock = stubFetch(async () => ({
      ok: true,
      json: async () => ({ ok: true }),
    }));
    const trainingRow = buildTrainingRow({
      applicationId: "TA-261016-ABCD",
      source: "website",
      course: "Fellowship in Obstetric Ultrasound",
      fullName: "Anitha R",
      mobile: "9876543210",
      email: "anitha@example.com",
      city: "Trichy",
      qualification: "MD OBG",
      status: "Completed",
      year: "2019",
      registration: "TNMC12345",
      workplace: "",
      experience: "1 to 3 years",
      preferredStart: "",
      statement: "",
      heardFrom: "",
      now: NOW,
    });
    await appendTrainingRow(trainingRow, {
      name: "cv.pdf",
      mimeType: "application/pdf",
      base64: "JVBERi0=",
    });
    const sent = JSON.parse(String(mock.mock.calls[0][1].body));
    expect(sent.action).toBe("append_training");
    expect(sent.secret).toBe("test-secret");
    expect(sent.row).toHaveLength(21);
    expect(sent.cv).toEqual({
      name: "cv.pdf",
      mimeType: "application/pdf",
      base64: "JVBERi0=",
    });
  });

  it("rejects append_training on ok false", async () => {
    Object.assign(process.env, env);
    stubFetch(async () => ({ ok: true, json: async () => ({ ok: false }) }));
    await expect(
      appendTrainingRow(["x"], {
        name: "cv.pdf",
        mimeType: "application/pdf",
        base64: "AA==",
      })
    ).rejects.toThrow();
  });

  it("aborts append_training after 30 seconds", async () => {
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
    const promise = appendTrainingRow(["x"], {
      name: "cv.pdf",
      mimeType: "application/pdf",
      base64: "AA==",
    });
    const assertion = expect(promise).rejects.toThrow();
    let settled = false;
    void promise.then(
      () => {
        settled = true;
      },
      () => {
        settled = true;
      }
    );
    // The longer training timeout must still be running past 15 seconds.
    await vi.advanceTimersByTimeAsync(16000);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(15000);
    await assertion;
    expect(settled).toBe(true);
  });
});
