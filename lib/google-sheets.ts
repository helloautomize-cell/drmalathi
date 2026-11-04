import { istDateString, istStamp } from "@/lib/booking-schema";

/**
 * Google Sheets client over a private Apps Script web app.
 * The web app (docs/sheets-apps-script.gs) reads the last rows of the
 * Submissions tab for abuse checks and appends booking rows. The shared
 * secret travels in the POST body; it is server only and never logged.
 */

const TIMEOUT_MS = 15000;
/** The CV upload makes append_training slower; give it more room. */
const TRAINING_TIMEOUT_MS = 30000;
const RECENT_WINDOW = 300;

// Column positions inside the A:H range returned by the "recent" action.
export const COL_SUBMITTED_AT = 0;
export const COL_MOBILE = 4;
export const COL_SERVICE = 5;
export const COL_PREFERRED_DATE = 7;

// Column positions inside the A:G range returned by "recent_training".
export const T_COL_SUBMITTED_AT = 0;
export const T_COL_COURSE = 3;
export const T_COL_MOBILE = 5;
export const T_COL_EMAIL = 6;

const DAY_MS = 24 * 60 * 60 * 1000;
const CONSENT_VERSION_CELL = "v1";

export function sheetsConfigured(): boolean {
  return Boolean(
    process.env.SHEETS_WEBHOOK_URL && process.env.SHEETS_WEBHOOK_SECRET
  );
}

type WebhookResponse = { ok?: boolean; rows?: unknown };

function devLog(msg: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[sheets] ${msg}`);
  }
}

type WebhookBody = {
  action: "recent" | "append" | "recent_training" | "append_training";
  row?: string[];
  cv?: { name: string; mimeType: string; base64: string };
};

async function postToWebhook(
  body: WebhookBody,
  timeoutMs: number = TIMEOUT_MS
): Promise<WebhookResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(process.env.SHEETS_WEBHOOK_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        secret: process.env.SHEETS_WEBHOOK_SECRET,
      }),
      // Apps Script answers POSTs with a redirect to the web app content.
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) {
      devLog(`${body.action}: HTTP ${res.status}`);
      throw new Error(`webhook ${res.status}`);
    }
    let json: WebhookResponse;
    try {
      json = (await res.json()) as WebhookResponse;
    } catch {
      devLog(`${body.action}: HTTP ${res.status}, non-JSON response (script threw)`);
      throw new Error("webhook non-JSON");
    }
    devLog(`${body.action}: HTTP ${res.status}, ok=${String(json.ok)}`);
    return json;
  } finally {
    clearTimeout(timer);
  }
}

/** Last RECENT_WINDOW data rows of the Submissions tab (A:H). */
export async function readRecentRows(): Promise<string[][]> {
  const json = await postToWebhook({ action: "recent" });
  if (json.ok !== true || !Array.isArray(json.rows)) {
    throw new Error("recent failed");
  }
  const rows = json.rows
    .filter((r): r is unknown[] => Array.isArray(r))
    .map((r) => r.map((v) => String(v ?? "")));
  return rows.slice(-RECENT_WINDOW);
}

/**
 * Formula-injection guard: a cell starting with =, +, -, @ or a tab is
 * prefixed with a single apostrophe so Sheets keeps it as plain text.
 */
export function sanitiseCell(value: string): string {
  return /^[=+\-@\t]/.test(value) ? `'${value}` : value;
}

export type LimitVerdict = "ok" | "daily-limit" | "duplicate" | "rate-limit";

/**
 * Evaluate the Sheet based limits against already-read rows.
 * Rows are A:H slices; times are the "YYYY-MM-DD HH:mm" IST stamps we write.
 */
export function evaluateLimits(
  rows: string[][],
  ctx: { mobile: string; service: string; preferredDate: string },
  now: Date = new Date()
): LimitVerdict {
  const today = istDateString(now);
  const todayCount = rows.filter((r) =>
    (r[COL_SUBMITTED_AT] ?? "").startsWith(today)
  ).length;
  if (todayCount > 100) return "daily-limit";

  const recent = rows.filter((r) => {
    const t = parseSheetStamp(r[COL_SUBMITTED_AT] ?? "");
    return t !== null && now.getTime() - t < DAY_MS;
  });

  if (
    recent.some(
      (r) =>
        r[COL_MOBILE] === ctx.mobile &&
        r[COL_SERVICE] === ctx.service &&
        r[COL_PREFERRED_DATE] === ctx.preferredDate
    )
  ) {
    return "duplicate";
  }

  if (recent.filter((r) => r[COL_MOBILE] === ctx.mobile).length >= 2) {
    return "rate-limit";
  }
  return "ok";
}

/** Parse "YYYY-MM-DD HH:mm" written in IST back to a timestamp. */
export function parseSheetStamp(stamp: string): number | null {
  const ms = Date.parse(`${stamp.replace(" ", "T")}:00+05:30`);
  return Number.isNaN(ms) ? null : ms;
}

/** Build the A:M row in the fixed column order. */
export function buildRow(input: {
  bookingId: string;
  source: string;
  name: string;
  mobile: string;
  service: string;
  doctor: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  now?: Date;
}): string[] {
  const now = input.now ?? new Date();
  return [
    istStamp(now),
    input.bookingId,
    input.source,
    input.name,
    input.mobile,
    input.service,
    input.doctor,
    input.preferredDate,
    input.preferredTime,
    input.notes,
    CONSENT_VERSION_CELL,
    "New",
    "",
  ].map(sanitiseCell);
}

/** Append one row. Throws on HTTP, parse or webhook failure; callers catch. */
export async function appendRow(row: string[]): Promise<void> {
  const json = await postToWebhook({ action: "append", row });
  if (json.ok !== true) {
    throw new Error("append failed");
  }
}

/** Last RECENT_WINDOW data rows of the Training Applications tab (A:G). */
export async function readRecentTrainingRows(): Promise<string[][]> {
  const json = await postToWebhook({ action: "recent_training" });
  if (json.ok !== true || !Array.isArray(json.rows)) {
    throw new Error("recent_training failed");
  }
  const rows = json.rows
    .filter((r): r is unknown[] => Array.isArray(r))
    .map((r) => r.map((v) => String(v ?? "")));
  return rows.slice(-RECENT_WINDOW);
}

export type TrainingLimitVerdict =
  | "ok"
  | "daily-limit"
  | "duplicate"
  | "rate-limit";

const TRAINING_DAILY_CAP = 30;
const TRAINING_DUPLICATE_WINDOW_MS = 7 * DAY_MS;

/**
 * Sheet based limits for training applications, against A:G rows.
 * Order: 30 submissions a day, then a repeat for the same course within
 * 7 days (same mobile or email) is a silent duplicate, then 2 or more
 * applications from the same mobile or email within 24 hours is declined.
 */
export function evaluateTrainingLimits(
  rows: string[][],
  ctx: { mobile: string; email: string; course: string },
  now: Date = new Date()
): TrainingLimitVerdict {
  const today = istDateString(now);
  const todayCount = rows.filter((r) =>
    (r[T_COL_SUBMITTED_AT] ?? "").startsWith(today)
  ).length;
  if (todayCount >= TRAINING_DAILY_CAP) return "daily-limit";

  const email = ctx.email.toLowerCase();
  const within = (stamp: string, windowMs: number) => {
    const t = parseSheetStamp(stamp);
    return t !== null && now.getTime() - t < windowMs;
  };

  const samePerson = (r: string[]) =>
    r[T_COL_MOBILE] === ctx.mobile ||
    (r[T_COL_EMAIL] ?? "").toLowerCase() === email;

  if (
    rows.some(
      (r) =>
        within(r[T_COL_SUBMITTED_AT] ?? "", TRAINING_DUPLICATE_WINDOW_MS) &&
        samePerson(r) &&
        r[T_COL_COURSE] === ctx.course
    )
  ) {
    return "duplicate";
  }

  if (
    rows.filter(
      (r) =>
        within(r[T_COL_SUBMITTED_AT] ?? "", DAY_MS) && samePerson(r)
    ).length >= 2
  ) {
    return "rate-limit";
  }

  return "ok";
}

/**
 * Build the 21 column row for the Training Applications tab, in the exact
 * header order: Submitted at (IST), Application ID, Source, Course,
 * Full name, Mobile, Email, City, Qualification, Status, Year,
 * Registration no, Workplace, Experience, Preferred start, Statement,
 * CV link (left empty; the Apps Script fills it), Heard from,
 * Consent version, Status (staff), Staff notes.
 */
export function buildTrainingRow(input: {
  applicationId: string;
  source: string;
  course: string;
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  qualification: string;
  status: string;
  year: string;
  registration: string;
  workplace: string;
  experience: string;
  preferredStart: string;
  statement: string;
  heardFrom: string;
  now?: Date;
}): string[] {
  const now = input.now ?? new Date();
  return [
    istStamp(now),
    input.applicationId,
    input.source,
    input.course,
    input.fullName,
    input.mobile,
    input.email,
    input.city,
    input.qualification,
    input.status,
    input.year,
    input.registration,
    input.workplace,
    input.experience,
    input.preferredStart,
    input.statement,
    "",
    input.heardFrom,
    CONSENT_VERSION_CELL,
    "New",
    "",
  ].map(sanitiseCell);
}

/**
 * Append one training application row together with the CV file. The Apps
 * Script stores the PDF in a private Drive folder and writes its link into
 * the CV link column. Throws on failure; callers catch.
 */
export async function appendTrainingRow(
  row: string[],
  cv: { name: string; mimeType: string; base64: string }
): Promise<void> {
  const json = await postToWebhook(
    { action: "append_training", row, cv },
    TRAINING_TIMEOUT_MS
  );
  if (json.ok !== true) {
    throw new Error("append_training failed");
  }
}
