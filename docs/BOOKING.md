# Online booking

How the slot booking system works, where the data lives, and how to run it.

## How it works

A visitor picks a visit type, a reason or test, a day and a 60 minute time
slot, then leaves their name and mobile. The site asks a private Google
Apps Script web app (bound to the clinic's Google Sheet) what is open,
and the same web app writes the booking row under a lock so two people can
never take the last place in a slot.

- The web app code is `apps-script/Code.gs`. It is pushed to the Sheet's
  bound Apps Script project with clasp.
- Every request is a POST with a shared `secret`. The URL and secret live in
  `SHEETS_WEBHOOK_URL` / `SHEETS_WEBHOOK_SECRET` (server only, never
  `NEXT_PUBLIC_`).
- The same web app also serves the legacy `recent`/`append` actions and the
  fellowship `recent_training`/`append_training` actions. One URL, one
  secret, three features.
- The clinic gets all alerts by email from the Sheet itself: one email per
  booking, a reminder email for requests still `New` after the nudge time,
  and a morning list of today's and tomorrow's bookings. Nothing is sent to
  patients. Gmail's free quota is about 100 emails a day.

## The Sheet tabs

| Tab | What it holds |
| --- | --- |
| `Bookings` | One row per online request. Columns: Submitted at (IST), Booking ID, Source, Patient name, Mobile, Visit type, Reason or test, Date, Slot, Notes, Consent, Status, Staff note, Status updated at. |
| `Submissions` | Rows from the earlier callback form (legacy, kept for history). |
| `Training Applications` | Fellowship applications with CV links (separate feature). |
| `Slots` | Day, Start, End, Capacity. This is the live slot table; edit it to change hours or block a time (capacity `0` blocks that slot). |
| `Holidays` | Date (YYYY-MM-DD) + reason shown to patients. A row closes that day. |
| `Settings` | Key/value settings the script reads: ClinicEmail, BookingWindowDays, MinLeadMinutes, MaxPerDay, MaxPerMobilePer24h, NudgeAfterMinutes, DigestHour. |

### Status

The `Status` column on `Bookings` is a dropdown: `New`, `Confirmed`,
`Rescheduled`, `Cancelled`, `Visited`, `No-show`. `Cancelled` and
`Rescheduled` free the place back to the slot; the other statuses hold it.
Editing a status stamps `Status updated at`.

## Giving the doctor access

Share the Sheet itself as Editor (Share button, top right). To send the
alert emails to a different inbox, change `ClinicEmail` in the `Settings`
tab; comma separate several addresses.

## Updating the script without changing the URL

1. Edit `apps-script/Code.gs` locally.
2. From `apps-script/`: `npx @google/clasp push -f` (needs `.clasp.json`
   with the script ID; never commit it).
3. Redeploy the same deployment so the URL stays:
   `npx @google/clasp update-deployment <deploymentId>`.
   The deployment ID is the long string in the web app URL.

## Checking the system

- `GET /api/booking-health` returns `{ ok: true }` (200) when the web app
  answers, `{ ok: false }` (503) when it does not. Check this first when
  bookings stop; it reveals nothing else.
- If the form shows "Online booking is unavailable right now", the site
  cannot reach the Sheet.

## Troubleshooting

| Symptom | Likely cause and fix |
| --- | --- |
| Form shows the offline notice | Check `/api/booking-health`. If 503, open Apps Script > Executions for failed runs. "Authorization required" or scope errors mean run `setup()` again and Allow. |
| Web app answers HTML, not JSON | The permissions step was not completed or the deployment access is wrong. In the editor: Deploy > Manage deployments > edit > make sure access is "Anyone", then run `setup()` again and Allow. |
| A third request from one mobile is refused | By design: `MaxPerMobilePer24h` in Settings (default 2). Raise it only if the clinic asks. |
| A day shows closed for no reason | Check the `Holidays` tab for that date, then the `Slots` tab (capacity 0 or missing rows mean closed). |
| Booking emails stopped | Gmail's ~100 emails/day quota may be spent, or `ClinicEmail` in Settings is empty. |
| Fellowship applications fail | The `CV_FOLDER_ID` and `ALERT_EMAIL` script properties must exist; run `diagnoseTrainingAppend` in the editor to check. |
