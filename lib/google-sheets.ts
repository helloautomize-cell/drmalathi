import { istDateString, istStamp } from "@/lib/booking-schema";

/**
 * Google Sheets client over a private Apps Script web app.
 * The web app (apps-script/Code.gs) answers three slot-booking actions:
 *   ping          -> health check
 *   availability  -> days with per-slot places left
 *   book          -> validates under a lock, appends one Bookings row
 * plus the legacy "recent"/"append" pair and the fellowship "recent_training"/
 * "append_training" pair (CV PDF to Drive). The shared secret travels in the
 * POST body; it is server only and never logged.
 */

const TIMEOUT_MS = 15000;
/** The CV upload makes append_training slower; give it more room. */
const TRAINING_TIMEOUT_MS = 30000;
const RECENT_WINDOW = 300;
/** How long an availability answer is reused before refetching. */
const AVAILABILITY_CACHE_MS = 30 * 1000;

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
  action:
    | "ping"
    | "availability"
    | "book"
    | "recent"
    | "append"
    | "recent_training"
    | "append_training";
  from?: string;
  days?: number;
  booking?: Record<string, string>;
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

/* ------------------------------------------------------------------ */
/* Slot booking actions (ping / availability / book)                   */
/* ------------------------------------------------------------------ */

export type SlotView = {
  start: string;
  end: string;
  /** "9 am to 10 am", the same string the Sheet stores. */
  label: string;
  capacity: number;
  left: number;
  open: boolean;
};

export type DayView = {
  date: string;
  closed: boolean;
  reason: string;
  slots: SlotView[];
};

export type AvailabilityResult =
  | { ok: true; today: string; lastDate: string; dates: DayView[] }
  | { ok: false };

export type BookingPayload = {
  id: string;
  source: string;
  name: string;
  mobile: string;
  visitType: string;
  reason: string;
  date: string;
  slotStart: string;
  notes: string;
  consent: string;
};

export type BookResult =
  | { ok: true; code: "ok"; slot: string }
  | {
      ok: false;
      code:
        | "slot_full"
        | "slot_closed"
        | "duplicate"
        | "limit"
        | "busy"
        | "invalid"
        | "failed";
    };

/** Health check for /api/booking-health. Never throws. */
export async function ping(): Promise<boolean> {
  try {
    const json = await postToWebhook({ action: "ping" });
    return json.ok === true;
  } catch {
    return false;
  }
}

// Short in-memory cache so a form mount + day pick within half a minute
// does not hammer the Sheet. Cleared after every successful booking.
const availabilityCache = new Map<
  string,
  { at: number; result: AvailabilityResult }
>();

/** Slots for `days` days starting at `from` (YYYY-MM-DD). Throws on failure. */
export async function getAvailability(
  from: string,
  days: number
): Promise<AvailabilityResult> {
  const key = `${from}|${days}`;
  const hit = availabilityCache.get(key);
  if (hit && Date.now() - hit.at < AVAILABILITY_CACHE_MS) return hit.result;

  const json = (await postToWebhook({
    action: "availability",
    from,
    days,
  })) as WebhookResponse & Partial<AvailabilityResult>;
  const result: AvailabilityResult =
    json.ok === true && Array.isArray(json.dates)
      ? {
          ok: true,
          today: String(json.today ?? ""),
          lastDate: String(json.lastDate ?? ""),
          dates: json.dates as DayView[],
        }
      : { ok: false };
  if (result.ok) {
    availabilityCache.set(key, { at: Date.now(), result });
    if (availabilityCache.size > 40) {
      const oldest = availabilityCache.keys().next().value;
      if (oldest) availabilityCache.delete(oldest);
    }
  }
  return result;
}

/** Book one slot. Throws on HTTP, parse or timeout; returns codes otherwise. */
export async function bookSlot(booking: BookingPayload): Promise<BookResult> {
  const json = (await postToWebhook({
    action: "book",
    booking: { ...booking },
  })) as WebhookResponse & { code?: string; slot?: string };
  availabilityCache.clear();
  if (json.ok === true && json.code === "ok") {
    return { ok: true, code: "ok", slot: String(json.slot ?? "") };
  }
  const code = [
    "slot_full",
    "slot_closed",
    "duplicate",
    "limit",
    "busy",
    "invalid",
  ].includes(String(json.code))
    ? (json.code as Exclude<BookResult, { ok: true }>["code"])
    : "failed";
  return { ok: false, code };
}

/**
 * Formula-injection guard: a cell starting with =, +, -, @ or a tab is
 * prefixed with a single apostrophe so Sheets keeps it as plain text.
 */
export function sanitiseCell(value: string): string {
  return /^[=+\-@\t]/.test(value) ? `'${value}` : value;
}

/** Parse "YYYY-MM-DD HH:mm" written in IST back to a timestamp. */
export function parseSheetStamp(stamp: string): number | null {
  const ms = Date.parse(`${stamp.replace(" ", "T")}:00+05:30`);
  return Number.isNaN(ms) ? null : ms;
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
