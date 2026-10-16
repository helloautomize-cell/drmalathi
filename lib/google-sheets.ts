import { istDateString, istStamp } from "@/lib/booking-schema";

/**
 * Google Sheets client over a private Apps Script web app.
 * The web app (docs/sheets-apps-script.gs) reads the last rows of the
 * Submissions tab for abuse checks and appends booking rows. The shared
 * secret travels in the POST body; it is server only and never logged.
 */

const TIMEOUT_MS = 15000;
const RECENT_WINDOW = 300;

// Column positions inside the A:H range returned by the "recent" action.
export const COL_SUBMITTED_AT = 0;
export const COL_MOBILE = 4;
export const COL_SERVICE = 5;
export const COL_PREFERRED_DATE = 7;

const DAY_MS = 24 * 60 * 60 * 1000;
const CONSENT_VERSION_CELL = "v1";

export function sheetsConfigured(): boolean {
  return Boolean(
    process.env.SHEETS_WEBHOOK_URL && process.env.SHEETS_WEBHOOK_SECRET
  );
}

type WebhookResponse = { ok?: boolean; rows?: unknown };

async function postToWebhook(body: {
  action: "recent" | "append";
  row?: string[];
}): Promise<WebhookResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
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
      throw new Error(`webhook ${res.status}`);
    }
    return (await res.json()) as WebhookResponse;
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
