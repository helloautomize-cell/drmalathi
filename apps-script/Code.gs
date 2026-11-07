/**
 * Clinic booking backend (Google Apps Script, bound to the clinic's private
 * bookings Google Sheet). Generic: everything clinic-specific is in CONFIG.
 *
 * This file also carries the legacy actions that were already deployed for
 * this clinic's website. They stay so the same web app URL keeps serving
 * every existing feature while the booking flow moves to time slots:
 *
 *   ping          -> { ok: true } when the secret matches (health check)
 *   availability  -> slots for one or more days with places left
 *   book          -> checks the slot under a lock, appends one row, emails the clinic
 *   recent        -> last rows of the 'Submissions' tab (legacy website form)
 *   append        -> append one row to 'Submissions' (legacy website form)
 *   recent_training   -> last rows of 'Training Applications' (fellowship form)
 *   append_training   -> append one training row plus the CV PDF to Drive
 *
 * Triggers (created by running setup() once from the editor):
 *   onStatusEdit   -> stamps "Status updated at" when staff change Status
 *   nudgeWaiting   -> every 30 min, emails requests still "New" after N minutes
 *   morningDigest  -> daily, emails today's and tomorrow's list
 *
 * All alerts are email to the clinic. Nothing is sent to patients.
 * The secret comes from Script properties, or from SECRET_FROM_DEPLOY in a
 * separate Secret.gs file pushed by the deploy step (never committed).
 */

/* ===== CLINIC CONFIG: the only part to edit per clinic ===== */
var CONFIG = {
  CLINIC_NAME: 'Trichy Fetal Medicine and Fertility Centre',
  ALERT_EMAIL: 'hello.automize@gmail.com',   // comma separate for more than one
  CLINIC_PHONE_LABEL: '+91 96595 95141',
  TIMEZONE: 'Asia/Kolkata',
  // Opening hours per day as [open, close] in 24h HH:mm, or null when closed.
  // The site lists Mon-Fri 9 am to 9 pm; weekend hours are unconfirmed, so
  // online slots stay weekday only until staff edit the Slots tab.
  HOURS: {
    Mon: ['09:00', '21:00'], Tue: ['09:00', '21:00'], Wed: ['09:00', '21:00'],
    Thu: ['09:00', '21:00'], Fri: ['09:00', '21:00'], Sat: null,
    Sun: null
  },
  SLOT_MINUTES: 60,        // slot length
  SLOT_CAPACITY: 4,        // patients per full slot (a shorter last slot gets half, rounded up)
  BOOKING_WINDOW_DAYS: 30,
  MIN_LEAD_MINUTES: 60,
  MAX_PER_MOBILE_PER_24H: 2,
  MAX_PER_DAY: 150,
  NUDGE_AFTER_MINUTES: 45,
  DIGEST_HOUR: 8
};
/* ===== end of config ===== */

var TZ = CONFIG.TIMEZONE;
var BOOKINGS = 'Bookings';
var SLOTS = 'Slots';
var HOLIDAYS = 'Holidays';
var SETTINGS = 'Settings';
// Tabs written by the legacy actions below; they already exist in the Sheet.
var SUBMISSIONS = 'Submissions';
var TRAINING = 'Training Applications';
var RECENT_ROWS = 3000;

var HEADERS = [
  'Submitted at (IST)', 'Booking ID', 'Source', 'Patient name', 'Mobile',
  'Visit type', 'Reason or test', 'Date', 'Slot', 'Notes', 'Consent',
  'Status', 'Staff note', 'Status updated at'
];
var C = {
  SUBMITTED: 1, ID: 2, SOURCE: 3, NAME: 4, MOBILE: 5, VISIT: 6, REASON: 7,
  DATE: 8, SLOT: 9, NOTES: 10, CONSENT: 11, STATUS: 12, STAFF_NOTE: 13,
  STATUS_AT: 14
};
var STATUSES = ['New', 'Confirmed', 'Rescheduled', 'Cancelled', 'Visited', 'No-show'];
// Statuses that give the place back to the slot.
var FREES_PLACE = { 'Cancelled': true, 'Rescheduled': true };

var DEFAULT_SETTINGS = [
  ['ClinicEmail', CONFIG.ALERT_EMAIL, 'Where booking alerts go. Comma separate for more than one.'],
  ['ClinicPhoneLabel', CONFIG.CLINIC_PHONE_LABEL, 'Clinic number, for reference.'],
  ['BookingWindowDays', String(CONFIG.BOOKING_WINDOW_DAYS), 'How many days ahead patients can book.'],
  ['MinLeadMinutes', String(CONFIG.MIN_LEAD_MINUTES), 'Same-day slots must start at least this many minutes from now.'],
  ['MaxPerDay', String(CONFIG.MAX_PER_DAY), 'Safety cap on online requests per day.'],
  ['MaxPerMobilePer24h', String(CONFIG.MAX_PER_MOBILE_PER_24H), 'Requests one mobile can send in 24 hours.'],
  ['NudgeAfterMinutes', String(CONFIG.NUDGE_AFTER_MINUTES), 'Email a reminder when a request is still New after this long.'],
  ['DigestHour', String(CONFIG.DIGEST_HOUR), 'Hour of the morning list (change needs setup() again).']
];

// Day, start, end, capacity, built from CONFIG.HOURS. Staff edit the Slots
// tab afterwards; capacity 0 blocks a slot.
function defaultSlots() {
  var rows = [];
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(function (d) {
    var h = CONFIG.HOURS[d];
    if (!h) return;
    var t = toMinutes(h[0]), close = toMinutes(h[1]);
    while (t < close) {
      var end = Math.min(t + CONFIG.SLOT_MINUTES, close);
      var cap = end - t < CONFIG.SLOT_MINUTES ? Math.ceil(CONFIG.SLOT_CAPACITY / 2) : CONFIG.SLOT_CAPACITY;
      rows.push([d, fromMinutes(t), fromMinutes(end), cap]);
      t = end;
    }
  });
  return rows;
}

function toMinutes(hhmm) { return Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5)); }
function fromMinutes(m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }

function bookingsTitle() { return CONFIG.CLINIC_NAME + ' bookings'; }

/* ------------------------------------------------------------------ */
/* Web app                                                             */
/* ------------------------------------------------------------------ */

function doPost(e) {
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return out({ ok: false });
  }
  var secret = getSecret();
  if (!secret || body.secret !== secret) return out({ ok: false });
  try {
    // Slot booking actions (new system).
    if (body.action === 'ping') return out({ ok: true });
    if (body.action === 'availability') return out(availability(body));
    if (body.action === 'book') return out(book(body.booking || {}));
    // Legacy website booking actions, kept for backwards compatibility.
    if (body.action === 'recent') return out(actionRecent());
    if (body.action === 'append') return out(actionAppend(body));
    // Fellowship training actions (different use, unchanged).
    if (body.action === 'recent_training') return out(actionRecentTraining());
    if (body.action === 'append_training') return out(actionAppendTraining(body));
  } catch (err) {
    console.error(err);
  }
  return out({ ok: false });
}

function getSecret() {
  var stored = PropertiesService.getScriptProperties().getProperty('SECRET');
  if (stored) return stored;
  return typeof SECRET_FROM_DEPLOY !== 'undefined' ? String(SECRET_FROM_DEPLOY) : '';
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ */
/* Availability                                                        */
/* ------------------------------------------------------------------ */

/** body: { from?: 'YYYY-MM-DD', days?: 1..31 } */
function availability(body) {
  var s = settings();
  var today = istDate(new Date());
  var windowDays = num(s.BookingWindowDays, 30);
  var from = isYmd(body.from) ? body.from : today;
  var days = Math.max(1, Math.min(31, Number(body.days) || 1));
  var counts = bookedCounts(recentRows());
  var holidays = holidayMap();
  var slotTable = slotRows();
  var dates = [];
  for (var i = 0; i < days; i++) {
    var date = addDays(from, i);
    if (date < today || date > addDays(today, windowDays)) continue;
    dates.push(dayView(date, slotTable, counts, holidays, s));
  }
  return {
    ok: true,
    today: today,
    lastDate: addDays(today, windowDays),
    dates: dates
  };
}

function dayView(date, slotTable, counts, holidays, s) {
  if (holidays[date] !== undefined) {
    return { date: date, closed: true, reason: holidays[date] || 'Clinic closed', slots: [] };
  }
  var dow = dayName(date);
  var slots = slotTable.filter(function (r) { return r.day === dow; }).map(function (r) {
    var label = slotLabel(r.start, r.end);
    var booked = counts[date + '|' + label] || 0;
    var left = Math.max(0, r.capacity - booked);
    return {
      start: r.start,
      end: r.end,
      label: label,
      capacity: r.capacity,
      left: left,
      open: r.capacity > 0 && left > 0 && startsLateEnough(date, r.start, s)
    };
  });
  return { date: date, closed: slots.length === 0, reason: slots.length ? '' : 'Clinic closed', slots: slots };
}

function startsLateEnough(date, start, s) {
  var startMs = Date.parse(date + 'T' + start + ':00+05:30');
  return startMs - Date.now() >= num(s.MinLeadMinutes, 60) * 60000;
}

/* ------------------------------------------------------------------ */
/* Book                                                                */
/* ------------------------------------------------------------------ */

/**
 * b: { id, source, name, mobile, visitType, reason, date, slotStart, notes, consent }
 * Returns { ok: true, code: 'ok', slot } or { ok: false, code }.
 * Codes: slot_full, slot_closed, duplicate, limit, busy, invalid.
 */
function book(b) {
  var required = ['id', 'name', 'mobile', 'visitType', 'reason', 'date', 'slotStart'];
  for (var i = 0; i < required.length; i++) {
    if (!b[required[i]] || String(b[required[i]]).length > 300) return { ok: false, code: 'invalid' };
  }
  if (!isYmd(b.date) || !/^\d{2}:\d{2}$/.test(b.slotStart)) return { ok: false, code: 'invalid' };

  var s = settings();
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { ok: false, code: 'busy' };
  var row;
  try {
    var today = istDate(new Date());
    if (b.date < today || b.date > addDays(today, num(s.BookingWindowDays, 30))) {
      return { ok: false, code: 'slot_closed' };
    }
    if (holidayMap()[b.date] !== undefined) return { ok: false, code: 'slot_closed' };
    var dow = dayName(b.date);
    var slot = slotRows().filter(function (r) { return r.day === dow && r.start === b.slotStart; })[0];
    if (!slot || slot.capacity <= 0 || !startsLateEnough(b.date, slot.start, s)) {
      return { ok: false, code: 'slot_closed' };
    }
    var label = slotLabel(slot.start, slot.end);
    var rows = recentRows();
    var active = rows.filter(function (r) { return !FREES_PLACE[r[C.STATUS - 1]]; });

    if (active.some(function (r) { return r[C.MOBILE - 1] === b.mobile && r[C.DATE - 1] === b.date; })) {
      return { ok: false, code: 'duplicate', slot: label };
    }
    var dayAgo = Date.now() - 24 * 3600000;
    var byMobile = rows.filter(function (r) {
      return r[C.MOBILE - 1] === b.mobile && parseStamp(r[C.SUBMITTED - 1]) > dayAgo;
    }).length;
    var todayCount = rows.filter(function (r) { return String(r[C.SUBMITTED - 1]).indexOf(today) === 0; }).length;
    if (byMobile >= num(s.MaxPerMobilePer24h, 2) || todayCount >= num(s.MaxPerDay, 150)) {
      return { ok: false, code: 'limit' };
    }
    var booked = active.filter(function (r) { return r[C.DATE - 1] === b.date && r[C.SLOT - 1] === label; }).length;
    if (booked >= slot.capacity) return { ok: false, code: 'slot_full' };

    row = {
      submitted: istStamp(new Date()),
      id: String(b.id),
      source: String(b.source || 'website'),
      name: String(b.name),
      mobile: String(b.mobile),
      visitType: String(b.visitType),
      reason: String(b.reason),
      date: b.date,
      slot: label,
      notes: String(b.notes || ''),
      consent: String(b.consent || 'v1')
    };
    appendBooking(row, s);
  } finally {
    lock.releaseLock();
  }

  // Alerts run after the lock so a slow email never blocks the next booking.
  safe(function () { emailNewBooking(row, s); });
  return { ok: true, code: 'ok', slot: row.slot };
}

function appendBooking(row, s) {
  var sheet = sheetByName(BOOKINGS);
  var r = sheet.getLastRow() + 1;
  var text = [
    row.submitted, row.id, row.source, row.name, row.mobile, row.visitType,
    row.reason, row.date, row.slot, row.notes, row.consent, 'New', '', ''
  ].map(sanitiseCell);
  var textRange = sheet.getRange(r, 1, 1, text.length);
  textRange.setNumberFormat('@');
  textRange.setValues([text]);
}

/* ------------------------------------------------------------------ */
/* Clinic alerts                                                       */
/* ------------------------------------------------------------------ */

function emailNewBooking(row, s) {
  if (!s.ClinicEmail) return;
  var when = prettyDate(row.date) + ', ' + row.slot;
  var lines = [
    ['Patient', row.name],
    ['Mobile', row.mobile],
    ['Visit', row.visitType + ': ' + row.reason],
    ['When', when],
    ['Notes', row.notes || 'None'],
    ['Booking ID', row.id],
    ['Source', row.source]
  ];
  var html = '<p><b>New booking request. Please confirm within 30 to 60 minutes.</b></p><table cellpadding="4">' +
    lines.map(function (l) { return '<tr><td><b>' + l[0] + '</b></td><td>' + esc(l[1]) + '</td></tr>'; }).join('') +
    '</table><p>' +
    '<a href="tel:+' + esc(dialNumber(row.mobile)) + '">Call patient</a> &middot; ' +
    '<a href="' + esc(SpreadsheetApp.getActiveSpreadsheet().getUrl()) + '">Open the Sheet</a></p>' +
    '<p>After confirming, set Status to Confirmed in the Sheet.</p>';
  MailApp.sendEmail({
    to: s.ClinicEmail,
    subject: 'New booking: ' + row.name + ', ' + when,
    body: lines.map(function (l) { return l[0] + ': ' + l[1]; }).join('\n'),
    htmlBody: html,
    name: bookingsTitle()
  });
}

/** Every 30 minutes: one email listing requests still New after NudgeAfterMinutes. */
function nudgeWaiting() {
  var s = settings();
  if (!s.ClinicEmail || !withinClinicHours()) return;
  var props = PropertiesService.getScriptProperties();
  var nudged = JSON.parse(props.getProperty('NUDGED') || '[]');
  var cutoff = Date.now() - num(s.NudgeAfterMinutes, 45) * 60000;
  var dayAgo = Date.now() - 24 * 3600000;
  var waiting = recentRows().filter(function (r) {
    var t = parseStamp(r[C.SUBMITTED - 1]);
    return r[C.STATUS - 1] === 'New' && t < cutoff && t > dayAgo && nudged.indexOf(r[C.ID - 1]) === -1;
  });
  if (!waiting.length) return;
  var html = '<p><b>' + waiting.length + ' booking request(s) still waiting for a call.</b></p><ul>' +
    waiting.map(function (r) {
      return '<li>' + esc(r[C.NAME - 1]) + ', ' + esc(r[C.MOBILE - 1]) + ', ' +
        esc(prettyDate(r[C.DATE - 1])) + ' ' + esc(r[C.SLOT - 1]) + ' (sent ' + esc(r[C.SUBMITTED - 1].slice(11)) + ')</li>';
    }).join('') + '</ul><p><a href="' + esc(SpreadsheetApp.getActiveSpreadsheet().getUrl()) + '">Open the Sheet</a></p>';
  MailApp.sendEmail({
    to: s.ClinicEmail,
    subject: 'Waiting: ' + waiting.length + ' booking request(s) not confirmed yet',
    htmlBody: html,
    name: bookingsTitle()
  });
  nudged = nudged.concat(waiting.map(function (r) { return r[C.ID - 1]; })).slice(-300);
  props.setProperty('NUDGED', JSON.stringify(nudged));
}

/** Daily: today's and tomorrow's bookings by slot, with a call link per patient. */
function morningDigest() {
  var s = settings();
  if (!s.ClinicEmail) return;
  var today = istDate(new Date());
  var tomorrow = addDays(today, 1);
  var rows = recentRows().filter(function (r) { return !FREES_PLACE[r[C.STATUS - 1]]; });
  var section = function (date) {
    var list = rows.filter(function (r) { return r[C.DATE - 1] === date; })
      .sort(function (a, b) { return slotSortKey(a[C.SLOT - 1]) - slotSortKey(b[C.SLOT - 1]); });
    if (!list.length) return '<h3>' + esc(prettyDate(date)) + '</h3><p>No online bookings.</p>';
    return '<h3>' + esc(prettyDate(date)) + ' (' + list.length + ')</h3><table cellpadding="4" border="1" style="border-collapse:collapse">' +
      '<tr><th>Slot</th><th>Patient</th><th>Mobile</th><th>Visit</th><th>Status</th></tr>' +
      list.map(function (r) {
        var obj = rowObject(r);
        return '<tr><td>' + esc(obj.slot) + '</td><td>' + esc(obj.name) +
          '</td><td><a href="tel:+' + esc(dialNumber(obj.mobile)) + '">' + esc(obj.mobile) + '</a>' +
          '</td><td>' + esc(obj.visitType + ': ' + obj.reason) + '</td><td>' + esc(r[C.STATUS - 1]) + '</td></tr>';
      }).join('') + '</table>';
  };
  var pending = rows.filter(function (r) { return r[C.STATUS - 1] === 'New'; }).length;
  MailApp.sendEmail({
    to: s.ClinicEmail,
    subject: bookingsTitle() + ' for ' + prettyDate(today) + (pending ? ' (' + pending + ' not confirmed)' : ''),
    htmlBody: section(today) + section(tomorrow) +
      '<p><a href="' + esc(SpreadsheetApp.getActiveSpreadsheet().getUrl()) + '">Open the Sheet</a></p>',
    name: bookingsTitle()
  });
}

/** Installable on-edit trigger: stamp when staff change a Status. */
function onStatusEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== BOOKINGS || e.range.getColumn() !== C.STATUS || e.range.getRow() < 2) return;
  if (e.range.getNumRows() !== 1) return;
  sheet.getRange(e.range.getRow(), C.STATUS_AT).setNumberFormat('@').setValue(istStamp(new Date()));
}

/* ------------------------------------------------------------------ */
/* One-time setup: run from the Apps Script editor                     */
/* ------------------------------------------------------------------ */

function setup() {
  if (JSON.stringify(CONFIG).indexOf('{{') !== -1) {
    throw new Error('Fill in CONFIG at the top of the script before running setup().');
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TZ);

  // The shared secret already exists on this project (set for the legacy
  // actions), so this block normally does nothing. It only creates one when
  // the property is missing. Run showSecret() to see it again.
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SECRET')) {
    var fromDeploy = typeof SECRET_FROM_DEPLOY !== 'undefined' ? String(SECRET_FROM_DEPLOY) : '';
    props.setProperty('SECRET', fromDeploy || (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, ''));
  }
  console.log('SHEETS_WEBHOOK_SECRET = ' + props.getProperty('SECRET'));

  var b = ss.getSheetByName(BOOKINGS) || ss.insertSheet(BOOKINGS);
  if (b.getLastRow() === 0) {
    b.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    b.setFrozenRows(1);
  }
  b.getRange(2, C.STATUS, b.getMaxRows() - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build()
  );

  var st = ss.getSheetByName(SLOTS) || ss.insertSheet(SLOTS);
  if (st.getLastRow() === 0) {
    st.getRange(1, 1, 1, 4).setValues([['Day', 'Start', 'End', 'Capacity']]).setFontWeight('bold');
    var slots = defaultSlots();
    st.getRange(2, 1, slots.length, 3).setNumberFormat('@');
    st.getRange(2, 1, slots.length, 4).setValues(slots);
    st.setFrozenRows(1);
  }

  var h = ss.getSheetByName(HOLIDAYS) || ss.insertSheet(HOLIDAYS);
  if (h.getLastRow() === 0) {
    h.getRange(1, 1, 1, 2).setValues([['Date (YYYY-MM-DD)', 'Reason shown to patients']]).setFontWeight('bold');
    h.getRange('A:A').setNumberFormat('@');
    h.setFrozenRows(1);
  }

  var se = ss.getSheetByName(SETTINGS) || ss.insertSheet(SETTINGS);
  if (se.getLastRow() === 0) {
    se.getRange(1, 1, 1, 3).setValues([['Key', 'Value', 'What it does']]).setFontWeight('bold');
    se.getRange(2, 1, DEFAULT_SETTINGS.length, 3).setNumberFormat('@');
    se.getRange(2, 1, DEFAULT_SETTINGS.length, 3).setValues(DEFAULT_SETTINGS);
    se.setFrozenRows(1);
  }

  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (['onStatusEdit', 'nudgeWaiting', 'morningDigest'].indexOf(t.getHandlerFunction()) !== -1) {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('onStatusEdit').forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger('nudgeWaiting').timeBased().everyMinutes(30).create();
  ScriptApp.newTrigger('morningDigest').timeBased().atHour(num(settings().DigestHour, 8))
    .everyDays(1).inTimezone(TZ).create();
}

/** Prints the secret again, for pasting into Vercel. */
function showSecret() {
  console.log('SHEETS_WEBHOOK_SECRET = ' + getSecret());
}

/** Run from the editor to check alerts reach the inbox. */
function sendTestEmail() {
  var s = settings();
  var row = {
    submitted: istStamp(new Date()), id: 'bk_test0000', source: 'test', name: 'Test Patient',
    mobile: '9876543210', visitType: 'New consultation', reason: 'Diabetes or high sugar',
    date: addDays(istDate(new Date()), 1), slot: '11 am to 12 pm', notes: 'Test only', consent: 'v1'
  };
  emailNewBooking(row, s);
}

/* ------------------------------------------------------------------ */
/* Sheet reads                                                         */
/* ------------------------------------------------------------------ */

function sheetByName(name) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error('Missing tab ' + name + '. Run setup().');
  return sh;
}

function recentRows() {
  var sheet = sheetByName(BOOKINGS);
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var start = Math.max(2, last - RECENT_ROWS + 1);
  return sheet.getRange(start, 1, last - start + 1, HEADERS.length).getDisplayValues();
}

function bookedCounts(rows) {
  var counts = {};
  rows.forEach(function (r) {
    if (FREES_PLACE[r[C.STATUS - 1]]) return;
    var key = r[C.DATE - 1] + '|' + r[C.SLOT - 1];
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function slotRows() {
  var sh = sheetByName(SLOTS);
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 4).getDisplayValues()
    .map(function (r) {
      return { day: r[0].trim().slice(0, 3), start: normTime(r[1]), end: normTime(r[2]), capacity: Number(r[3]) || 0 };
    })
    .filter(function (r) { return r.start && r.end; });
}

function holidayMap() {
  var sh = sheetByName(HOLIDAYS);
  var map = {};
  if (sh.getLastRow() < 2) return map;
  sh.getRange(2, 1, sh.getLastRow() - 1, 2).getDisplayValues().forEach(function (r) {
    if (isYmd(r[0].trim())) map[r[0].trim()] = r[1].trim();
  });
  return map;
}

function settings() {
  var map = {};
  DEFAULT_SETTINGS.forEach(function (r) { map[r[0]] = r[1]; });
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS);
  if (sh && sh.getLastRow() >= 2) {
    sh.getRange(2, 1, sh.getLastRow() - 1, 2).getDisplayValues().forEach(function (r) {
      if (r[0]) map[r[0].trim()] = r[1].trim();
    });
  }
  return map;
}

function rowObject(r) {
  return {
    submitted: r[C.SUBMITTED - 1], id: r[C.ID - 1], source: r[C.SOURCE - 1], name: r[C.NAME - 1],
    mobile: r[C.MOBILE - 1], visitType: r[C.VISIT - 1], reason: r[C.REASON - 1], date: r[C.DATE - 1],
    slot: r[C.SLOT - 1], notes: r[C.NOTES - 1], consent: r[C.CONSENT - 1], status: r[C.STATUS - 1]
  };
}

function withinClinicHours() {
  var today = istDate(new Date());
  if (holidayMap()[today] !== undefined) return false;
  var dow = dayName(today);
  var slots = slotRows().filter(function (r) { return r.day === dow; });
  if (!slots.length) return false;
  var now = istTime(new Date());
  var open = slots.map(function (r) { return r.start; }).sort()[0];
  var close = slots.map(function (r) { return r.end; }).sort().slice(-1)[0];
  return now >= open && now <= close;
}

/* ------------------------------------------------------------------ */
/* Legacy website booking actions ('Submissions' tab)                  */
/* ------------------------------------------------------------------ */

/** Last 300 data rows of the Submissions tab (A:H), unchanged. */
function actionRecent() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS);
  var last = sheet.getLastRow();
  if (last < 2) return { ok: true, rows: [] };
  var start = Math.max(2, last - 299);
  var rows = sheet.getRange(start, 1, last - start + 1, 8).getDisplayValues();
  return { ok: true, rows: rows };
}

/** Append one 13 column row to the Submissions tab, unchanged. */
function actionAppend(body) {
  var row = body.row;
  if (!Array.isArray(row) || row.length !== 13) return { ok: false };
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, 13);
    range.setNumberFormat('@');
    range.setValues([row.map(String)]);
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Fellowship training actions ('Training Applications' tab), unchanged */
/* ------------------------------------------------------------------ */

/** Last 300 data rows of the Training Applications tab (A:G). */
function actionRecentTraining() {
  var tsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRAINING);
  var tlast = tsheet.getLastRow();
  if (tlast < 2) return { ok: true, rows: [] };
  var tstart = Math.max(2, tlast - 299);
  var trows = tsheet.getRange(tstart, 1, tlast - tstart + 1, 7).getDisplayValues();
  return { ok: true, rows: trows };
}

/**
 * Append one 21 column training row and store the CV PDF in the private
 * Drive folder pointed to by the CV_FOLDER_ID script property. The alert
 * goes to the ALERT_EMAIL script property. Unchanged from the live version.
 */
function actionAppendTraining(body) {
  var trow = body.row;
  if (!Array.isArray(trow) || trow.length !== 21) return { ok: false };
  var cv = body.cv;
  if (!cv || cv.mimeType !== 'application/pdf' || !cv.base64) return { ok: false };
  var bytes = Utilities.base64Decode(cv.base64);
  if (!bytes || bytes.length === 0 || bytes.length > 3 * 1024 * 1024) return { ok: false };
  // A real PDF starts with the %PDF magic bytes.
  if (bytes[0] !== 37 || bytes[1] !== 80 || bytes[2] !== 68 || bytes[3] !== 70) return { ok: false };
  var folderId = PropertiesService.getScriptProperties().getProperty('CV_FOLDER_ID');
  var fileName = (trow[1] + ' - ' + trow[4]).replace(/[\\/:*?"<>|]/g, ' ') + '.pdf';
  var file = DriveApp.getFolderById(folderId).createFile(
    Utilities.newBlob(bytes, 'application/pdf', fileName)
  );
  // The file keeps the folder's private sharing; column Q (index 16) links it.
  trow[16] = file.getUrl();
  var tsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRAINING);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var trange = tsheet.getRange(tsheet.getLastRow() + 1, 1, 1, 21);
    trange.setNumberFormat('@');
    trange.setValues([trow.map(String)]);
  } finally {
    lock.releaseLock();
  }
  var alertTo = PropertiesService.getScriptProperties().getProperty('ALERT_EMAIL');
  if (alertTo) {
    try {
      MailApp.sendEmail(
        alertTo,
        'New training application: ' + trow[3],
        'Name: ' + trow[4] + '\nCourse: ' + trow[3] + '\nQualification: ' + trow[8] + '\nMobile: ' + trow[5] + '\n\nSheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
      );
    } catch (mailErr) {}
  }
  return { ok: true };
}

// Diagnostic only: run this in the editor to verify the Drive folder and
// email setup. It triggers the Drive/Gmail consent screen on first run and
// logs each step; a thrown error names the broken part.
function diagnoseTrainingAppend() {
  var props = PropertiesService.getScriptProperties();
  Logger.log('CV_FOLDER_ID: ' + props.getProperty('CV_FOLDER_ID'));
  Logger.log('ALERT_EMAIL: ' + props.getProperty('ALERT_EMAIL'));
  var folder = DriveApp.getFolderById(props.getProperty('CV_FOLDER_ID'));
  Logger.log('Drive folder resolves: ' + folder.getName());
  // Write probe: exercises createFile so running this also re-authorizes
  // the full Drive scope the web app needs.
  var probe = folder.createFile(
    Utilities.newBlob('diagnostic', 'text/plain', 'diagnose-probe.txt')
  );
  Logger.log('Drive write OK: ' + probe.getName());
  probe.setTrashed(true);
  Logger.log('Mail quota: ' + MailApp.getRemainingDailyQuota());
  Logger.log('All checks passed.');
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function safe(fn) {
  try { fn(); } catch (err) { console.error(err); }
}

function pad(n) { return (n < 10 ? '0' : '') + n; }

function num(v, fallback) {
  var n = Number(v);
  return isNaN(n) || v === '' ? fallback : n;
}

function isYmd(v) { return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v); }

/** "9:00", "09:00" or "9:00:00" -> "09:00". */
function normTime(v) {
  var m = String(v).trim().match(/^(\d{1,2}):(\d{2})/);
  return m ? pad(Number(m[1])) + ':' + m[2] : '';
}

function istDate(d) { return Utilities.formatDate(d, TZ, 'yyyy-MM-dd'); }
function istTime(d) { return Utilities.formatDate(d, TZ, 'HH:mm'); }
function istStamp(d) { return Utilities.formatDate(d, TZ, 'yyyy-MM-dd HH:mm'); }

function parseStamp(stamp) {
  var ms = Date.parse(String(stamp).replace(' ', 'T') + ':00+05:30');
  return isNaN(ms) ? 0 : ms;
}

function addDays(ymd, n) {
  var d = new Date(Date.parse(ymd + 'T00:00:00Z') + n * 86400000);
  return d.toISOString().slice(0, 10);
}

function dayName(ymd) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(ymd + 'T00:00:00Z').getUTCDay()];
}

/** "2026-10-28" -> "Wed 28 Oct". */
function prettyDate(ymd) {
  if (!isYmd(ymd)) return String(ymd);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return dayName(ymd) + ' ' + Number(ymd.slice(8)) + ' ' + months[Number(ymd.slice(5, 7)) - 1];
}

/** "09:00" -> "9 am", "20:30" -> "8:30 pm", "12:00" -> "12 pm". */
function clock(hhmm) {
  var h = Number(hhmm.slice(0, 2));
  var m = hhmm.slice(3, 5);
  var suffix = h >= 12 ? 'pm' : 'am';
  var h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + (m === '00' ? '' : ':' + m) + ' ' + suffix;
}

function slotLabel(start, end) { return clock(start) + ' to ' + clock(end); }

/** Sort key for a stored slot label: minutes since midnight of its start. */
function slotSortKey(label) {
  var m = String(label).match(/^(\d{1,2})(?::(\d{2}))? (am|pm)/);
  if (!m) return 9999;
  var h = Number(m[1]) % 12 + (m[3] === 'pm' ? 12 : 0);
  return h * 60 + Number(m[2] || 0);
}

/** Formula-injection guard, same as the website: =, +, -, @ or tab get an apostrophe. */
function sanitiseCell(v) {
  var s = String(v == null ? '' : v);
  return /^[=+\-@\t]/.test(s) ? "'" + s : s;
}

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Dial number: 10-digit Indian mobiles get 91, others keep their digits. */
function dialNumber(mobile) {
  var d = String(mobile).replace(/\D/g, '');
  return d.length === 10 ? '91' + d : d;
}
