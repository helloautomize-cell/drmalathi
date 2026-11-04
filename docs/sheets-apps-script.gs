function doPost(e) {
var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
var body = {};
try { body = JSON.parse(e.postData.contents || '{}'); } catch (err) { return out({ ok: false }); }
if (!secret || body.secret !== secret) return out({ ok: false });
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Submissions');
if (body.action === 'recent') {
var last = sheet.getLastRow();
if (last < 2) return out({ ok: true, rows: [] });
var start = Math.max(2, last - 299);
var rows = sheet.getRange(start, 1, last - start + 1, 8).getDisplayValues();
return out({ ok: true, rows: rows });
}
if (body.action === 'append') {
var row = body.row;
if (!Array.isArray(row) || row.length !== 13) return out({ ok: false });
var lock = LockService.getScriptLock();
lock.waitLock(10000);
try {
var range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, 13);
range.setNumberFormat('@');
range.setValues([row.map(String)]);
} finally {
lock.releaseLock();
}
return out({ ok: true });
}
if (body.action === 'recent_training') {
var tsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Training Applications');
var tlast = tsheet.getLastRow();
if (tlast < 2) return out({ ok: true, rows: [] });
var tstart = Math.max(2, tlast - 299);
var trows = tsheet.getRange(tstart, 1, tlast - tstart + 1, 7).getDisplayValues();
return out({ ok: true, rows: trows });
}
if (body.action === 'append_training') {
var trow = body.row;
if (!Array.isArray(trow) || trow.length !== 21) return out({ ok: false });
var cv = body.cv;
if (!cv || cv.mimeType !== 'application/pdf' || !cv.base64) return out({ ok: false });
var bytes = Utilities.base64Decode(cv.base64);
if (!bytes || bytes.length === 0 || bytes.length > 3 * 1024 * 1024) return out({ ok: false });
// A real PDF starts with the %PDF magic bytes.
if (bytes[0] !== 37 || bytes[1] !== 80 || bytes[2] !== 68 || bytes[3] !== 70) return out({ ok: false });
var folderId = PropertiesService.getScriptProperties().getProperty('CV_FOLDER_ID');
var fileName = (trow[1] + ' - ' + trow[4]).replace(/[\\/:*?"<>|]/g, ' ') + '.pdf';
var file = DriveApp.getFolderById(folderId).createFile(
Utilities.newBlob(bytes, 'application/pdf', fileName)
);
// The file keeps the folder's private sharing; column Q (index 16) links it.
trow[16] = file.getUrl();
var tsheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Training Applications');
var tlock = LockService.getScriptLock();
tlock.waitLock(10000);
try {
var trange = tsheet2.getRange(tsheet2.getLastRow() + 1, 1, 1, 21);
trange.setNumberFormat('@');
trange.setValues([trow.map(String)]);
} finally {
tlock.releaseLock();
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
return out({ ok: true });
}
return out({ ok: false });
}
function out(obj) {
return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
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
Logger.log('Mail quota: ' + MailApp.getRemainingDailyQuota());
Logger.log('All checks passed.');
}
