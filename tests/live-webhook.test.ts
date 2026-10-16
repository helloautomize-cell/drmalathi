import { describe, expect, it } from "vitest";
import { processBookingSubmission } from "@/lib/booking-pipeline";

// Live end-to-end check against the real Apps Script webhook, using the
// credentials in .env.local. Writes one clearly labelled test row; staff can
// delete it. Runs only when the env vars are present.
process.loadEnvFile(".env.local");

const live = Boolean(
  process.env.SHEETS_WEBHOOK_URL && process.env.SHEETS_WEBHOOK_SECRET
);

describe("live webhook", () => {
  it.skipIf(!live)(
    "a real booking submission appends a row to the Sheet",
    async () => {
      const result = await processBookingSubmission({
        name: "Automated Test Booking",
        mobile: "+91 90000 00001",
        service: "Not sure, please advise",
        doctor: "No preference",
        preferredDate: "Not given",
        preferredTime: "Not given",
        notes: "Automated end to end test row, safe to delete",
        consent: "on",
        startedAt: new Date(Date.now() - 5000).toISOString(),
        source: "reception",
      });
      expect(result.ok).toBe(true);
      expect(result.bookingId).toMatch(/^bk_[0-9a-z]{8}$/);
      expect(result.appended).toBe(true);
    },
    20000
  );
});
