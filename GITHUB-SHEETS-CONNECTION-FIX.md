# FIXING GITHUB PAGES → GOOGLE SHEETS CONNECTION

## 🔍 PROBLEM DIAGNOSIS

Your GitHub Pages site can't fetch data because:
1. GitHub Pages only hosts **static HTML** files
2. It cannot directly access Google Sheets API
3. You need **Google Apps Script Web App** as a bridge

```
GitHub Pages (Frontend)
    ↓ (through SCRIPT_URL)
Google Apps Script (Backend/Bridge)
    ↓
Google Sheets (Database)
```

---

## ✅ STEP-BY-STEP FIX

### STEP 1: Verify Your Google Apps Script is Deployed

1. **Open your Google Sheet**
2. Click **Extensions** → **Apps Script**
3. Check if you have the `doPost` function:

```javascript
function doPost(e) {
  try {
    const uniqueId = e.parameter.uniqueId;
    
    if (!uniqueId || uniqueId.trim() === '') {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: "Invalid ID"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const result = checkInParticipant(uniqueId.trim());
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: "System error: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

**If you DON'T have this function:** Copy and paste it into your script, then save.

---

### STEP 2: Deploy as Web App

1. In Apps Script, click **Deploy** → **New deployment**

2. Click gear icon → Select **Web app**

3. Configure:
   ```
   Description: Seminar Check-in API v1
   Execute as: Me
   Who has access: Anyone
   ```

4. Click **Deploy**

5. **Authorize** when prompted:
   - Click "Authorize access"
   - Choose your account
   - Click "Advanced" → "Go to [project name] (unsafe)"
   - Click "Allow"

6. **COPY THE WEB APP URL** - looks like:
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXX/exec
   ```

---

### STEP 3: Update Your GitHub HTML File

1. Go to your GitHub repository

2. Click on your HTML file (`index.html` or `web-checkin-with-qr-scanner.html`)

3. Click the **pencil icon** (Edit)

4. Find this line (around line 219 or 244):
   ```javascript
   const SCRIPT_URL = 'YOUR_SCRIPT_URL_HERE';
   ```

5. Replace with your actual URL:
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXX/exec';
   ```

6. Scroll down and click **Commit changes**

7. Wait 2-3 minutes for GitHub Pages to rebuild

---

### STEP 4: Test the Connection

1. **Test the Script URL directly:**
   - Open a new browser tab
   - Paste your SCRIPT_URL
   - Add `?uniqueId=TEST` to the end
   - Full URL: `https://script.google.com/.../exec?uniqueId=TEST`
   - You should see JSON response (even if it says "not found")

2. **Test from GitHub Pages:**
   - Open your GitHub Pages site
   - Try to check in a test participant
   - Open browser console (F12) to see any errors

---

## 🔧 COMMON ISSUES & FIXES

### Issue 1: "Failed to fetch" or "Network error"

**Cause:** SCRIPT_URL is wrong or not set

**Fix:**
```javascript
// Check your HTML has this EXACT format:
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

// NOT these:
❌ 'YOUR_SCRIPT_URL_HERE'  // Never updated
❌ 'https://script.google.com/.../dev'  // Wrong - should be /exec
❌ Missing quotes
❌ Extra spaces
```

**How to verify:**
1. Open your GitHub Pages site
2. Press F12 → Console tab
3. Type: `SCRIPT_URL`
4. Press Enter
5. Should show your full Google Apps Script URL

---

### Issue 2: "CORS error" in console

**This is NORMAL!** ✅

Google Apps Script shows CORS warnings but the request still works.

**Example console error you can ignore:**
```
Access to fetch at 'https://script.google.com/...' from origin 'https://yourusername.github.io' 
has been blocked by CORS policy
```

**The request still works** - just check if you get success/error message in the interface.

**If it's NOT working despite CORS error:**
- Check deployment settings: "Who has access" = "Anyone"
- Make sure you're using POST request (code already does this)
- Verify the doPost function exists in your script

---

### Issue 3: Gets "Authorization required"

**Cause:** Deployment settings wrong

**Fix:**
1. Apps Script → Deploy → Manage deployments
2. Click pencil icon (Edit)
3. Make sure:
   - Execute as: **Me** (not "User accessing the web app")
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy NEW URL if it changed
6. Update HTML file on GitHub

---

### Issue 4: "Participant not found" for valid IDs

**Cause:** Script can't access the sheet or wrong column configuration

**Fix:**

1. **Test the checkInParticipant function:**
   ```javascript
   // In Apps Script, run this:
   function testCheckInFunction() {
     // Use a real ID from your sheet
     const result = checkInParticipant("SEM-20240315-0001-123");
     Logger.log(result);
   }
   ```

2. **Check CONFIG column numbers:**
   ```javascript
   // In your script, verify these match your sheet:
   const CONFIG = {
     columns: {
       timestamp: 1,    // Column A
       email: 2,        // Column B
       name: 3,         // Column C
       phone: 4,        // Column D
       uniqueId: 5,     // Column E - check this!
       qrSent: 6,
       checkedIn: 7,
       checkInTime: 8
     }
   };
   ```

3. **Verify the function exists:**
   - Search your script for: `function checkInParticipant`
   - Make sure it's there and complete

---

### Issue 5: Statistics not updating (shows 0/0)

**Cause:** Statistics fetching not implemented

**Fix - Add this to your Apps Script:**

```javascript
function doGet(e) {
  // Handle statistics request
  if (e.parameter.action === 'getStats') {
    const stats = getStats();
    return ContentService
      .createTextOutput(JSON.stringify(stats))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Default response
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "API is running"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getStats() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    let totalRegistered = data.length - 1; // Exclude header
    let totalCheckedIn = 0;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][CONFIG.columns.checkedIn - 1] === "Yes") {
        totalCheckedIn++;
      }
    }
    
    return {
      totalRegistered: totalRegistered,
      totalCheckedIn: totalCheckedIn,
      percentage: totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0
    };
  } catch (error) {
    return {
      totalRegistered: 0,
      totalCheckedIn: 0,
      percentage: 0,
      error: error.toString()
    };
  }
}
```

Then **re-deploy** your script (Deploy → New deployment).

---

## 🧪 COMPLETE TEST PROCEDURE

Follow these steps to verify everything works:

### Test 1: Script URL is Valid

```bash
# In browser, visit:
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

# Should see JSON response like:
{"status":"API is running"}
```

✅ **Pass:** JSON appears
❌ **Fail:** 404 error or blank page → Check deployment

---

### Test 2: Check-in Function Works

```bash
# In browser, visit:
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?uniqueId=TEST-123

# Should see JSON like:
{"success":false,"message":"Participant not found"}
```

✅ **Pass:** JSON with "not found" (expected for fake ID)
❌ **Fail:** Error message → Check doPost/doGet functions

---

### Test 3: Statistics Work

```bash
# In browser, visit:
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getStats

# Should see JSON like:
{"totalRegistered":10,"totalCheckedIn":5,"percentage":50}
```

✅ **Pass:** Shows actual numbers from your sheet
❌ **Fail:** All zeros or error → Check getStats function

---

### Test 4: GitHub Pages Connection

1. Open your GitHub Pages site
2. Open browser console (F12)
3. Type: `SCRIPT_URL`
4. Should show your full script URL

✅ **Pass:** Shows correct URL
❌ **Fail:** Shows 'YOUR_SCRIPT_URL_HERE' → Edit HTML on GitHub

---

### Test 5: Real Check-in

1. Submit a test registration through your Google Form
2. Check email for QR code
3. Get the Unique ID from email or sheet
4. Try checking in on GitHub Pages site
5. Check Google Sheet for update

✅ **Pass:** Sheet updates, success message appears
❌ **Fail:** See error troubleshooting above

---

## 📝 COMPLETE WORKING EXAMPLE

Here's what your setup should look like:

### In Google Apps Script:

```javascript
// CONFIG at top
const CONFIG = {
  seminarName: "My Seminar 2024",
  // ... other config
  columns: {
    timestamp: 1,
    email: 2,
    name: 3,
    phone: 4,
    uniqueId: 5,
    qrSent: 6,
    checkedIn: 7,
    checkInTime: 8
  }
};

// ... other functions (generateUniqueId, sendQREmail, etc.)

// CHECK-IN FUNCTION
function checkInParticipant(uniqueId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][CONFIG.columns.uniqueId - 1] === uniqueId) {
      const row = i + 1;
      
      if (sheet.getRange(row, CONFIG.columns.checkedIn).getValue() === "Yes") {
        return {
          success: false,
          message: "Already checked in",
          name: data[i][CONFIG.columns.name - 1],
          checkInTime: sheet.getRange(row, CONFIG.columns.checkInTime).getValue()
        };
      }
      
      const checkInTime = new Date();
      sheet.getRange(row, CONFIG.columns.checkedIn).setValue("Yes");
      sheet.getRange(row, CONFIG.columns.checkInTime).setValue(checkInTime);
      
      return {
        success: true,
        message: "Check-in successful",
        name: data[i][CONFIG.columns.name - 1],
        email: data[i][CONFIG.columns.email - 1],
        checkInTime: checkInTime
      };
    }
  }
  
  return {
    success: false,
    message: "Participant not found",
    name: null
  };
}

// WEB APP HANDLERS
function doGet(e) {
  if (e.parameter.action === 'getStats') {
    const stats = getStats();
    return ContentService
      .createTextOutput(JSON.stringify(stats))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({status: "API is running"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const uniqueId = e.parameter.uniqueId;
    
    if (!uniqueId || uniqueId.trim() === '') {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: "Invalid ID"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const result = checkInParticipant(uniqueId.trim());
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: "System error: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getStats() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    let totalRegistered = data.length - 1;
    let totalCheckedIn = 0;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][CONFIG.columns.checkedIn - 1] === "Yes") {
        totalCheckedIn++;
      }
    }
    
    return {
      totalRegistered: totalRegistered,
      totalCheckedIn: totalCheckedIn,
      percentage: totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0
    };
  } catch (error) {
    return {
      totalRegistered: 0,
      totalCheckedIn: 0,
      percentage: 0
    };
  }
}
```

### In GitHub HTML file:

```javascript
// Around line 219 or 244:
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxYOUR_ACTUAL_DEPLOYMENT_ID_HERE/exec';
```

---

## 🎯 QUICK DIAGNOSTIC SCRIPT

Copy this into your browser console (F12) when on your GitHub Pages site:

```javascript
// Test 1: Check if SCRIPT_URL is set
console.log("SCRIPT_URL:", SCRIPT_URL);

// Test 2: Try to fetch stats
fetch(SCRIPT_URL + '?action=getStats')
  .then(r => r.json())
  .then(data => console.log("Stats:", data))
  .catch(err => console.error("Error fetching stats:", err));

// Test 3: Try a check-in
fetch(SCRIPT_URL, {
  method: 'POST',
  body: new URLSearchParams({ uniqueId: 'TEST-123' })
})
  .then(r => r.json())
  .then(data => console.log("Check-in test:", data))
  .catch(err => console.error("Error checking in:", err));
```

**What you should see:**
```javascript
SCRIPT_URL: https://script.google.com/macros/s/.../exec
Stats: {totalRegistered: 10, totalCheckedIn: 5, percentage: 50}
Check-in test: {success: false, message: "Participant not found"}
```

---

## 🆘 STILL NOT WORKING?

### Check These:

1. **Apps Script Deployment:**
   - [ ] doPost function exists
   - [ ] doGet function exists (for stats)
   - [ ] Deployed as Web App
   - [ ] "Execute as" = Me
   - [ ] "Who has access" = Anyone
   - [ ] URL copied correctly

2. **GitHub Pages:**
   - [ ] HTML file has correct SCRIPT_URL
   - [ ] No typos in URL
   - [ ] Waited 2-3 minutes after commit
   - [ ] Hard refresh (Ctrl+Shift+R)

3. **Google Sheet:**
   - [ ] Column numbers in CONFIG match actual columns
   - [ ] checkInParticipant function exists
   - [ ] Test data exists in sheet

4. **Browser:**
   - [ ] JavaScript enabled
   - [ ] Console shows no critical errors
   - [ ] Not blocking third-party cookies
   - [ ] Try different browser

---

## 📞 GET DETAILED ERROR INFO

Add this to your HTML to see detailed errors:

```javascript
// Add after the checkIn function
async function checkIn(uniqueId) {
    console.log("=== CHECK-IN DEBUG ===");
    console.log("Unique ID:", uniqueId);
    console.log("Script URL:", SCRIPT_URL);
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: new URLSearchParams({ uniqueId: uniqueId.trim() })
        });
        
        console.log("Response status:", response.status);
        console.log("Response OK:", response.ok);
        
        const result = await response.json();
        console.log("Result:", result);
        
        handleCheckInResult(result);
    } catch (error) {
        console.error("=== ERROR ===");
        console.error("Error type:", error.name);
        console.error("Error message:", error.message);
        console.error("Full error:", error);
    }
}
```

This will show you exactly what's happening in the browser console!

---

## ✅ VERIFICATION CHECKLIST

Before your event, verify:

- [ ] Google Apps Script deployed as Web App
- [ ] SCRIPT_URL in HTML matches deployment URL exactly
- [ ] Test check-in works from GitHub Pages
- [ ] Statistics display (if implemented)
- [ ] Browser console shows no critical errors
- [ ] Tested on actual device you'll use
- [ ] Internet connection confirmed

---

**Remember:** GitHub Pages → Google Apps Script → Google Sheets

All three pieces must be connected correctly! The most common issue is a wrong or missing SCRIPT_URL.
