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

## Training applications and the Google Sheet

The `Training Applications` tab holds one row per doctor training application
from `/fellowship/apply`. Columns: Submitted at (IST), Application ID, Source,
Course, Full name, Mobile, Email, City, Qualification, Status, Year,
Registration no, Workplace, Experience, Preferred start, Statement, CV link,
Heard from, Consent version, Status (staff), Staff notes. Each CV is stored
as a PDF in a private Google Drive folder and its link lands in the CV link
column. Each new application also emails `ALERT_EMAIL` through the Apps
Script, so no Resend setup is needed.

### Apps Script setup (one time)

1. In the same private Google Sheet as `Submissions`, add a tab named exactly
   `Training Applications`. Paste this header into A1 and use Data > Split
   text to columns:
   `Submitted at (IST),Application ID,Source,Course,Full name,Mobile,Email,City,Qualification,Status,Year,Registration no,Workplace,Experience,Preferred start,Statement,CV link,Heard from,Consent version,Status (staff),Staff notes`
   Then select all cells and set Format > Number > Plain text.
2. In Google Drive (same account as the Sheet), create a folder named
   `FMC Training CVs`. Do not share it. Copy the folder ID from its URL (the
   part after `/folders/`).
3. Open Extensions > Apps Script, replace the script with the current
   `docs/sheets-apps-script.gs` and save. In Project Settings > Script
   Properties add `CV_FOLDER_ID` (the folder ID) and `ALERT_EMAIL`
   (`fmc.trichy@gmail.com`). `SECRET` stays as before.
4. Deploy > Manage deployments > pencil icon > Version: New version > Deploy.
   This keeps the same web app URL, so `SHEETS_WEBHOOK_URL` and
   `SHEETS_WEBHOOK_SECRET` do not change. Google will ask you to authorise
   Drive and Gmail access; that is expected.

### Verify on a Vercel preview

1. **Happy path**: submit `/fellowship/apply` with every required field and a
   real PDF under 3 MB. A row appears in `Training Applications` with
   `Status (staff) = New`, the PDF lands in `FMC Training CVs` named
   `TA-<date>-<code> - <name>.pdf`, the CV link column holds its Drive URL,
   and an email arrives at `ALERT_EMAIL`. The success card shows the
   `TA-YYMMDD-XXXX` application ID.
2. **Course prefill**: open `/fellowship/apply?course=fellowship-obstetric-ultrasound`.
   The course select starts on Obstetric Ultrasound; an unknown value leaves
   it unselected.
3. **Duplicate**: submit again for the same course with the same mobile or
   email within 7 days. The UI shows success but no new row is written.
4. **Rate limit**: submit twice within 24 hours with the same mobile or
   email on different courses. The third submit in 24 hours is declined and
   the UI shows the call/email fallback.
5. **Wrong file**: choose a `.docx` or image. The form shows
   "Upload your CV as a PDF file." before anything is sent.
6. **Oversize file**: choose a PDF over 3 MB (for example 5 MB). The form
   shows "The PDF must be 3 MB or smaller." A renamed `.pdf` that is not a
   real PDF is rejected on the server even if it passes the browser check.
7. **Honeypot and fast submit**: fill the hidden `website` field or submit
   within 3 seconds. Success is shown but nothing is written.

Daily cap: after 30 rows in `Training Applications` for the current IST day,
new applications are declined and callers are asked to email their CV.

Unit tests for the training schema, the CV file check, preferred start
options, the 21 column row builder, the limit logic and the training webhook
actions run with `npm test` (vitest, `tests/training.test.ts`).
