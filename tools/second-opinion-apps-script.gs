/**
 * Second opinion form backend (Google Apps Script) for /second-opinion/.
 * Saves uploaded reports in a private Google Drive folder (one sub-folder per request),
 * logs each request in a Google Sheet and emails the clinic.
 *
 * Setup (once, in the Google account that should own the reports):
 * 1. Create a Drive folder, e.g. "Second Opinion Reports". Keep it private. Copy its ID from the URL.
 * 2. Create a Google Sheet, e.g. "Second Opinion Requests". Copy its ID from the URL.
 * 3. Go to script.google.com > New project, paste this file, fill in the three values below.
 * 4. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Authorise.
 * 5. Copy the web-app URL ending in /exec into ENDPOINT in assets/second-opinion.js.
 */
const FOLDER_ID = 'PASTE_DRIVE_FOLDER_ID_HERE';
const SHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const NOTIFY_EMAIL = 'drshantanud@yahoo.com';

const MAX_FILES = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const EXT = {
  'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website) return reply({ ok: true, id: 'SO' });
    if (!d.name || !d.phone) throw new Error('Missing name or phone');
    if (!d.consent) throw new Error('Consent required');
    const files = Array.isArray(d.files) ? d.files : [];
    if (files.length > MAX_FILES) throw new Error('Too many files');

    const id = 'SO-' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyMMdd-HHmmss');
    let folderUrl = '';
    if (files.length) {
      const folder = DriveApp.getFolderById(FOLDER_ID).createFolder(id + ' ' + clean(d.name));
      files.forEach(function (f, i) {
        if (!EXT[f.type]) throw new Error('File type not allowed');
        const bytes = Utilities.base64Decode(f.data);
        if (bytes.length > MAX_BYTES) throw new Error('File larger than 10 MB');
        folder.createFile(Utilities.newBlob(bytes, f.type, (i + 1) + '_' + clean(f.name) + '.' + EXT[f.type]));
      });
      folderUrl = folder.getUrl();
    }

    SpreadsheetApp.openById(SHEET_ID).getSheets()[0].appendRow([
      new Date(), id, d.name, "'" + d.phone, d.email || '', d.city || '', d.message || '', files.length, folderUrl
    ]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'Second opinion request ' + id + ': ' + d.name,
      body: 'Name: ' + d.name + '\nMobile: ' + d.phone + '\nEmail: ' + (d.email || '') +
        '\nCity: ' + (d.city || '') + '\n\nQuestion:\n' + (d.message || '') +
        '\n\nReports (' + files.length + '): ' + (folderUrl || 'none uploaded')
    });
    return reply({ ok: true, id: id });
  } catch (err) {
    return reply({ ok: false, error: String(err && err.message || err) });
  }
}

function clean(s) { return String(s).replace(/\.[^.]*$/, '').replace(/[^A-Za-z0-9]+/g, '_').slice(0, 40); }
function reply(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
