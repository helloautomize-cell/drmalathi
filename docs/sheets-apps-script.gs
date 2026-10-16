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
return out({ ok: false });
}
function out(obj) {
return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
