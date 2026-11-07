# Testing

## Slot booking requests and the Google Sheet

The `Bookings` tab holds one row per booking request. Columns: Submitted at
(IST), Booking ID, Source, Patient name, Mobile, Visit type, Reason or test,
Date, Slot, Notes, Consent, Status, Staff note, Status updated at. The
`Slots`, `Holidays` and `Settings` tabs control what is bookable; see
`docs/BOOKING.md` for the full reference.

### Apps Script setup (one time)

The web app code lives in `apps-script/Code.gs` and is pushed to the Sheet's
bound Apps Script project with clasp (`npx @google/clasp push -f` from
`apps-script/`). It serves the slot actions (`ping`, `availability`,
`book`) and the existing `recent`/`append`/`recent_training`/
`append_training` actions on the same deployment, so `SHEETS_WEBHOOK_URL`
and `SHEETS_WEBHOOK_SECRET` do not change. Run `setup()` once in the editor
to create the new tabs and triggers, then redeploy the same deployment.

### Verify on a Vercel preview

1. **Health check**: `GET /api/booking-health` returns `{ "ok": true }`.
2. **QR page**: submit `/book?src=scan-room` with a visit type, a reason, a
   day and a slot. The row appears with `Source = scan-room` and the
   success card shows the slot label, the masked mobile and a `bk_`
   booking ID. `/book` without `src`, or with any other value, writes
   `Source = unknown`.
3. **Website forms**: submit the booking sheet (any Book button) or the
   /contact callback form. Their rows show a `website-` prefixed source
   (for example `website-hero`, `website-contact-page`).
4. **Slot fills up**: after `Capacity` bookings for the same date and slot
   (default 4), the next submit is declined with "that time just filled
   up" and the day reloads with the slot marked Full.
5. **Duplicate**: submit the same mobile for the same date twice. The
   second submit shows "You already have a request for that day".
6. **Rate limit**: a third request from one mobile within 24 hours shows
   "You have sent several requests today".
7. **Formula text**: submit a note of `=HYPERLINK("x")`. It lands in the
   Sheet as plain text (prefixed with an apostrophe), never as a formula.
8. **Honeypot**: fill the hidden `website` field (for example through
   browser devtools) and submit. The UI shows success but no row is written.
9. **Fast submit**: submitting within 3 seconds of page load behaves like
   the honeypot, success shown, nothing written.
10. **Offline**: with the webhook URL emptied, the form shows "Online
    booking is unavailable right now" with a call button instead of slots.

Daily cap: after `MaxPerDay` rows in `Bookings` for the current IST day
(default 150), new requests are declined and callers are asked to phone.

Unit tests for the schema, mobile normalisation, IST date window, visit
type and reason rules, the sanitiser and the webhook client (ping,
availability, book, bad JSON, timeout) run with `npm test` (vitest,
`tests/booking.test.ts`).

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
   `apps-script/Code.gs` and save. In Project Settings > Script
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
