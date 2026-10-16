# Testing

## Booking requests and the Google Sheet

The `Submissions` tab holds one row per booking request. Columns: Submitted at
(IST), Booking ID, Source, Patient name, Mobile, Service, Preferred doctor,
Preferred date, Preferred time, Notes, Consent version, Status, Staff notes.

### Apps Script setup (one time)

1. In the private Google Sheet, format the `Submissions` tab as plain text
   (Format > Number > Plain text) so values are stored exactly as sent.
2. Open Extensions > Apps Script, paste `docs/sheets-apps-script.gs` and save.
3. Project Settings > Script Properties: add `SECRET` with a long random value.
4. Deploy > New deployment > Web app: Execute as **Me**, access **Anyone**
   (the secret, not the URL, guards writes).
5. Copy the web app URL into `SHEETS_WEBHOOK_URL` and the same secret into
   `SHEETS_WEBHOOK_SECRET` (Vercel env vars and `.env.local`).

### Verify on a Vercel preview

1. **QR page**: submit `/book?src=scan-room` with a valid mobile, a service,
   tomorrow's date and a time. The row appears with `Source = scan-room` and
   the success card shows the masked mobile and a `bk_` booking ID.
   `/book` without `src`, or with any other value, writes `Source = unknown`.
2. **Website form**: submit the booking form from the home page. Its row
   shows a `website-` prefixed source (for example `website-hero`).
3. **Same mobile, third request**: submit twice from the same mobile within
   24 hours with different services or dates. The third request is declined
   and the UI shows the Call/WhatsApp fallback.
4. **Duplicate**: send the exact same mobile, service and preferred date
   twice within 24 hours. Only one row is written; the second submit still
   shows the success card.
5. **Formula text**: submit a note of `=HYPERLINK("x")`. It lands in the
   Sheet as plain text (prefixed with an apostrophe), never as a formula.
6. **Honeypot**: fill the hidden `website` field (for example through
   browser devtools) and submit. The UI shows success but no row is written.
7. **Fast submit**: submitting within 3 seconds of page load behaves like
   the honeypot, success shown, nothing written.

Daily cap: if the `Submissions` tab already has more than 100 rows for the
current IST day, new requests are declined and callers are asked to phone.

Unit tests for the schema, mobile normalisation, IST date window, sanitiser,
the Sheet limit logic and the webhook client (success, ok false, bad JSON,
timeout) run with `npm test` (vitest, `tests/booking.test.ts`).
