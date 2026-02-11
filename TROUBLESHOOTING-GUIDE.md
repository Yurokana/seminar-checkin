# 🔧 COMPLETE TROUBLESHOOTING GUIDE

## 📋 Quick Diagnostics

Use this flowchart to identify your issue:

```
Is the issue with...
├─ Email sending? → Go to Section A
├─ QR code generation? → Go to Section B
├─ Web interface? → Go to Section C
├─ Google Sheets connection? → Go to Section D
├─ GitHub hosting? → Go to Section E
└─ Check-in process? → Go to Section F
```

---

## 🅰️ SECTION A: EMAIL ISSUES

### A1: Emails not sending at all

**Symptoms:**
- No emails received after form submission
- "QR Sent" column stays empty

**Diagnosis:**
```javascript
// In Apps Script, run this test:
function testEmail() {
  const testEmail = "your-email@example.com";
  const testName = "Test User";
  const testId = "TEST-001";
  const qrUrl = generateQRCode(testId);
  sendQREmail(testEmail, testName, testId, qrUrl);
}
```

**Solutions:**

1. **Check Gmail quota:**
   - Free Gmail: 100 emails/day limit
   - Check: Apps Script → Executions → Look for quota errors
   - Solution: Wait 24 hours or upgrade to Google Workspace

2. **Verify trigger is installed:**
   - Apps Script → Triggers (clock icon on left)
   - Should see: `onFormSubmit` trigger
   - If missing: Run `installTrigger()` function

3. **Check authorization:**
   - Run any function in Apps Script
   - If asked to authorize → Complete authorization
   - Make sure you allow all permissions

4. **Verify form is linked to sheet:**
   - Google Form → Responses → Click spreadsheet icon
   - Should say "Open existing spreadsheet"
   - If not, link form to your sheet

**Quick Fix:**
```javascript
// Manually send email for a specific row
function manualSend() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const row = 2; // Change to your row number
  
  const email = sheet.getRange(row, 2).getValue();
  const name = sheet.getRange(row, 3).getValue();
  const uniqueId = sheet.getRange(row, 5).getValue();
  const qrUrl = generateQRCode(uniqueId);
  
  sendQREmail(email, name, uniqueId, qrUrl);
  sheet.getRange(row, 6).setValue("Sent");
}
```

---

### A2: Emails going to spam

**Symptoms:**
- Participants say they didn't receive email
- Email found in spam/junk folder

**Solutions:**

1. **Update email content:**
   - Reduce ALL CAPS text
   - Avoid spam trigger words ("FREE", "URGENT", "ACT NOW")
   - Add your organization's address in footer

2. **Use custom domain (if available):**
   - Instead of personal Gmail
   - Use Google Workspace email

3. **Ask participants to:**
   - Check spam folder
   - Add your email to contacts
   - Mark as "Not Spam"

4. **Add SPF/DKIM (Advanced):**
   - If using custom domain
   - Configure in domain DNS settings

---

### A3: QR code not appearing in email

**Symptoms:**
- Email arrives but QR code is missing
- Shows broken image icon

**Solutions:**

1. **Check internet connection:**
   - QR API needs internet to generate
   - Test API manually: Open this in browser:
     `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TEST`

2. **Try alternative QR API:**
   Replace in script:
   ```javascript
   // Current
   qrApiUrl: "https://api.qrserver.com/v1/create-qr-code/",
   
   // Alternative 1
   qrApiUrl: "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=",
   
   // Alternative 2 (requires API key but more reliable)
   // Use quickchart.io
   ```

3. **Check email client:**
   - Some email clients block images
   - Participant should click "Show images"
   - QR code is also attached as file (backup)

---

## 🅱️ SECTION B: QR CODE ISSUES

### B1: QR code not generating

**Symptoms:**
- "Unique ID" column is empty
- Script execution errors

**Diagnosis:**
```javascript
// Test QR generation
function testQR() {
  const testId = "SEM-20240315-0001-123";
  const qrUrl = generateQRCode(testId);
  Logger.log("QR URL: " + qrUrl);
  
  // Try to fetch it
  const response = UrlFetchApp.fetch(qrUrl);
  Logger.log("QR generated successfully!");
}
```

**Solutions:**

1. **Check unique ID generation:**
   ```javascript
   // Test this function
   function testUniqueId() {
     const id = generateUniqueId(2);
     Logger.log("Generated ID: " + id);
   }
   ```

2. **Verify column configuration:**
   - Check CONFIG.columns.uniqueId matches your sheet
   - Count columns: A=1, B=2, C=3, etc.

3. **Check for script errors:**
   - Apps Script → Executions
   - Look for red error icons
   - Read error messages

---

### B2: QR code scanning returns wrong data

**Symptoms:**
- QR code scans but shows unexpected text
- ID format is incorrect

**Diagnosis:**
Scan a QR code and check what data it contains. Should be: `SEM-YYYYMMDD-XXXX-XXX`

**Solutions:**

1. **Verify QR generation function:**
   ```javascript
   function generateQRCode(uniqueId) {
     // Make sure it's exactly this:
     const qrUrl = `${CONFIG.qrApiUrl}?size=${CONFIG.qrSize}&data=${encodeURIComponent(uniqueId)}`;
     return qrUrl;
   }
   ```

2. **Check unique ID format:**
   - Should match: SEM-20240315-0001-123
   - If different, update `generateUniqueId()` function

3. **Test with online QR decoder:**
   - Upload QR image to: https://zxing.org/w/decode
   - Verify decoded text matches expected ID

---

## 🅲 SECTION C: WEB INTERFACE ISSUES

### C1: Web interface not loading

**Symptoms:**
- Blank white page
- "Page not found" error
- Infinite loading

**Solutions:**

1. **Check file location:**
   - Make sure `web-checkin-interface.html` exists
   - Try opening directly (double-click)

2. **Check browser console:**
   - Press F12 → Console tab
   - Look for error messages in red

3. **Verify HTML is valid:**
   - Open in different browser (Chrome, Firefox, Safari)
   - If works in one but not another → browser-specific issue

4. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

---

### C2: "Failed to process check-in" error

**Symptoms:**
- Error message when clicking "Check In Participant"
- Nothing happens after submit
- Loading forever

**Diagnosis:**
```javascript
// Check browser console (F12) for errors
// Common errors:
// - CORS error → Normal, but check script URL
// - Network error → Check internet connection
// - 404 error → Script URL is wrong
```

**Solutions:**

1. **Verify SCRIPT_URL is correct:**
   ```javascript
   // In HTML, find this line (around line 219):
   const SCRIPT_URL = 'YOUR_SCRIPT_URL_HERE';
   
   // Should be:
   const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```

2. **Test script URL directly:**
   - Paste your SCRIPT_URL in browser
   - Should return JSON data (or redirect)
   - If 404 → URL is wrong
   - If asks for login → Deployment settings wrong

3. **Check deployment settings:**
   - Apps Script → Deploy → Manage deployments
   - "Execute as" = "Me"
   - "Who has access" = "Anyone" or "Anyone with Google account"

4. **Re-deploy script:**
   - Apps Script → Deploy → New deployment
   - Copy new URL
   - Update HTML file

---

### C3: Check-in works but sheet not updating

**Symptoms:**
- Success message appears
- But Google Sheet shows no change
- "Checked In" column stays empty

**Solutions:**

1. **Verify column numbers:**
   ```javascript
   // In CONFIG, check these match your sheet:
   columns: {
     checkedIn: 7,     // Which column for "Checked In"?
     checkInTime: 8    // Which column for timestamp?
   }
   ```

2. **Check function exists:**
   ```javascript
   // Make sure checkInParticipant() function is in your script
   // Search for: function checkInParticipant
   ```

3. **Test function manually:**
   ```javascript
   // In Apps Script, run:
   function testCheckIn() {
     const result = checkInParticipant("SEM-20240315-0001-123");
     Logger.log(result);
   }
   ```

4. **Check Apps Script logs:**
   - Apps Script → Executions
   - Find recent executions
   - Look for errors

---

## 🅳 SECTION D: GOOGLE SHEETS CONNECTION

### D1: Script can't access sheet

**Symptoms:**
- "Cannot read property" errors
- "SpreadsheetApp is not defined"
- Authorization errors

**Solutions:**

1. **Re-authorize script:**
   - Run any function in Apps Script
   - Grant permissions when asked
   - Allow all requested permissions

2. **Check script container:**
   - Script must be bound to the spreadsheet
   - Open sheet → Extensions → Apps Script
   - Don't create standalone script

3. **Verify sheet access:**
   - You must be owner or editor of the sheet
   - Check: File → Share → Your permissions

---

### D2: Wrong row being updated

**Symptoms:**
- Updates happening in wrong row
- Data appears in unexpected place

**Solutions:**

1. **Check row finding logic:**
   ```javascript
   // In checkInParticipant function
   // Verify this logic finds correct row
   for (let i = 1; i < data.length; i++) {
     if (data[i][CONFIG.columns.uniqueId - 1] === uniqueId) {
       const row = i + 1;  // This should be correct
       // ...
     }
   }
   ```

2. **Verify unique IDs are unique:**
   - Check Google Sheet column E (Unique ID)
   - Should be no duplicates
   - Each should be different

3. **Check array indexing:**
   - JavaScript arrays start at 0
   - Google Sheets rows start at 1
   - Make sure conversion is correct

---

## 🅴 SECTION E: GITHUB HOSTING ISSUES

### E1: GitHub Pages not working

**Symptoms:**
- 404 error when accessing GitHub Pages URL
- "Site not found"

**Solutions:**

1. **Wait and refresh:**
   - GitHub Pages takes 1-10 minutes to build
   - Wait 5 minutes
   - Hard refresh: Ctrl+Shift+R

2. **Check Pages is enabled:**
   - Repo → Settings → Pages
   - Source should be set to "main" branch
   - Should see green success message

3. **Verify repository is public:**
   - Settings → General
   - Under "Danger Zone"
   - Should say "This repository is public"
   - If private → Change visibility to public

4. **Check file exists:**
   - Make sure `index.html` (or `web-checkin-interface.html`) is in repository
   - Check repository main page on GitHub

---

### E2: Changes not appearing

**Symptoms:**
- Made changes but old version still showing
- Updated file but site unchanged

**Solutions:**

1. **Wait for rebuild:**
   - GitHub Pages rebuilds on each commit
   - Takes 1-3 minutes
   - Check: Repo → Actions tab for build status

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
   - Or clear cache completely
   - Try incognito/private window

3. **Verify commit worked:**
   - Check repository
   - Click on file
   - Verify changes are there
   - Check commit history

4. **Force rebuild:**
   - Make tiny change (add space)
   - Commit again
   - Triggers new build

---

### E3: Script connection fails on hosted site

**Symptoms:**
- Works locally but not on GitHub Pages
- CORS errors
- Can't connect to Google Apps Script

**Solutions:**

1. **CORS is expected with Google Apps Script:**
   - This is normal
   - Script should still work
   - Browser shows error but request succeeds

2. **Verify Script URL in hosted file:**
   - Check GitHub file has correct SCRIPT_URL
   - View source of hosted page
   - Search for SCRIPT_URL

3. **Test script URL:**
   - Open SCRIPT_URL directly in browser
   - Should work (return data or redirect)

4. **Check deployment:**
   - Apps Script → Deploy → Manage deployments
   - Should show Web app deployment
   - "Who has access" = Anyone

---

## 🅵 SECTION F: CHECK-IN PROCESS ISSUES

### F1: "Participant not found"

**Symptoms:**
- Valid ID but shows "not found"
- Participant registered but can't check in

**Solutions:**

1. **Verify ID format:**
   - Check for extra spaces
   - Copy-paste exactly from sheet
   - Should match: SEM-20240315-0001-123

2. **Check correct sheet:**
   - Are you looking at right tab?
   - Sheet might have multiple tabs
   - Verify active sheet is correct

3. **Case sensitivity:**
   - IDs might be case-sensitive
   - Try exactly as shown in sheet

4. **Manual search:**
   - Open Google Sheet
   - Ctrl+F to find the ID
   - If found → Check why script can't find it
   - If not found → ID might be wrong

---

### F2: "Already checked in" but participant says first time

**Symptoms:**
- Participant insists haven't checked in
- System says already checked in

**Solutions:**

1. **Check Google Sheet:**
   - Find participant's row
   - Look at "Check-in Time" column
   - Verify timestamp

2. **Possible duplicate registration:**
   - Same person registered twice
   - Different IDs for same person
   - Check by email address

3. **Manual override (if needed):**
   - Go to Google Sheet
   - Find participant's row
   - Change "Checked In" from "Yes" to "No"
   - Clear "Check-in Time"
   - Try check-in again

4. **Reset check-in status:**
   ```javascript
   // In Apps Script, create this function:
   function resetCheckIn(uniqueId) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = sheet.getDataRange().getValues();
     
     for (let i = 1; i < data.length; i++) {
       if (data[i][CONFIG.columns.uniqueId - 1] === uniqueId) {
         const row = i + 1;
         sheet.getRange(row, CONFIG.columns.checkedIn).setValue("");
         sheet.getRange(row, CONFIG.columns.checkInTime).setValue("");
         Logger.log("Reset check-in for: " + uniqueId);
         return;
       }
     }
   }
   ```

---

### F3: QR scanner not reading code

**Symptoms:**
- Scanner app can't read QR code
- QR code too blurry
- Scanner shows error

**Solutions:**

1. **Try different scanner app:**
   - iPhone: Built-in Camera app
   - Android: Google Lens
   - Third-party: "QR Code Reader" app

2. **Increase brightness:**
   - Phone/tablet screen brightness to maximum
   - Ensure good lighting

3. **Clean screen:**
   - Wipe participant's phone screen
   - Remove any scratches/cracks affecting QR

4. **Manual entry:**
   - Ask participant for their email
   - Look up ID in Google Sheet
   - Enter manually in web interface

5. **Regenerate QR code:**
   - Re-send email to participant
   - Or manually create QR code:
     - Go to https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=SEM-20240315-0001-123
     - Replace with actual ID
     - Show this to participant

---

## 🔍 DIAGNOSTIC COMMANDS

Run these in Apps Script console to diagnose issues:

### Check Configuration:
```javascript
function checkConfig() {
  Logger.log("Seminar Name: " + CONFIG.seminarName);
  Logger.log("Email Column: " + CONFIG.columns.email);
  Logger.log("Name Column: " + CONFIG.columns.name);
  Logger.log("Unique ID Column: " + CONFIG.columns.uniqueId);
}
```

### Check Triggers:
```javascript
function listTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    Logger.log("Function: " + trigger.getHandlerFunction());
    Logger.log("Event: " + trigger.getEventType());
  });
}
```

### Check Last 5 Registrations:
```javascript
function checkRegistrations() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  const start = Math.max(2, lastRow - 4);
  
  for (let i = start; i <= lastRow; i++) {
    const email = sheet.getRange(i, CONFIG.columns.email).getValue();
    const uniqueId = sheet.getRange(i, CONFIG.columns.uniqueId).getValue();
    const qrSent = sheet.getRange(i, CONFIG.columns.qrSent).getValue();
    
    Logger.log(`Row ${i}: ${email} | ID: ${uniqueId} | Sent: ${qrSent}`);
  }
}
```

### Test Complete Flow:
```javascript
function testCompleteFlow() {
  Logger.log("1. Testing ID generation...");
  const id = generateUniqueId(999);
  Logger.log("   Generated: " + id);
  
  Logger.log("2. Testing QR code generation...");
  const qr = generateQRCode(id);
  Logger.log("   QR URL: " + qr);
  
  Logger.log("3. Testing email (using test address)...");
  sendQREmail("test@example.com", "Test User", id, qr);
  Logger.log("   Email sent!");
  
  Logger.log("4. All tests passed! ✓");
}
```

---

## 📞 GETTING HELP

### Before Asking for Help:

1. **Check execution logs:**
   - Apps Script → Executions
   - Look for error messages

2. **Note exact error message:**
   - Copy full error text
   - Include line numbers

3. **Gather information:**
   - What were you trying to do?
   - What happened instead?
   - What have you already tried?

### Where to Get Help:

- **Google Apps Script:** https://developers.google.com/apps-script
- **GitHub Pages:** https://docs.github.com/en/pages
- **Stack Overflow:** Tag your question with `google-apps-script`

---

## ✅ PREVENTION CHECKLIST

Avoid issues by following these best practices:

- [ ] Test everything before seminar day
- [ ] Have backup devices
- [ ] Keep Google Sheet open for monitoring
- [ ] Have printed participant list
- [ ] Charge all devices
- [ ] Test internet connection
- [ ] Train staff on backup procedures
- [ ] Keep Apps Script console open (for logs)
- [ ] Bookmark all important URLs
- [ ] Have admin phone number ready

---

## 🆘 EMERGENCY PROCEDURES

If everything fails on seminar day:

### Plan A: Manual Check-in
1. Print participant list from Google Sheet
2. Check names off manually
3. Update sheet after event

### Plan B: Simplified Digital
1. Open Google Sheet on tablet
2. Have staff mark "Yes" directly in sheet
3. No QR scanning needed

### Plan C: Paper Backup
1. Use sign-in sheet
2. Participants write name and sign
3. Data entry after event

---

**Remember:** Most issues are simple configuration problems. Stay calm, check the logs, and work through diagnostically!
