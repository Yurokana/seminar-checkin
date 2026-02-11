# 📘 COMPLETE SETUP GUIDE - E-WASTE SPECIAL SESSION CHECK-IN SYSTEM

## 🎯 Overview

This system will:
- ✅ Send QR codes automatically when people register via Google Form
- ✅ Allow QR code scanning for instant check-in
- ✅ Track attendance in real-time on Google Sheets
- ✅ Display live statistics on a web interface
- ✅ Host everything online for free on GitHub Pages

---

## 📋 PART 1: GOOGLE FORM & SHEET SETUP

### Step 1.1: Create Your Google Form

1. Go to **https://forms.google.com**
2. Click **+ Blank** to create a new form
3. Name your form: **"E-waste Special Session Registration"**

4. **Add these questions** (match the order exactly):
   ```
   Question 1: Email address (Email validation)
   Question 2: Full Name (Short answer, Required)
   Question 3: Gender (Multiple choice: Male/Female/Prefer not to say)
   Question 4: Country (Short answer, Required)
   Question 5: Phone Number (Short answer, Required)
   Question 6: Organization/Company (Short answer, Required)
   Question 7: Position/Title (Short answer, Required)
   Question 8: Area of Interest (Multiple choice or Checkboxes)
   Question 9: Dinner Attendance (Multiple choice: Yes/No)
   ```

5. **Enable email collection:**
   - Click Settings (gear icon)
   - Check ✓ "Collect email addresses"
   - Click Save

### Step 1.2: Link Form to Google Sheet

1. In your Google Form, click **Responses** tab
2. Click the green **Google Sheets** icon
3. Choose "Create a new spreadsheet"
4. Name it: **"E-waste Special Session Registrations"**
5. Click **Create**

Your Google Sheet will open with these columns:
```
A: Timestamp
B: Email Address  
C: Full Name
D: Gender
E: Country
F: Phone Number
G: Organization/Company
H: Position/Title
I: Area of Interest
J: Dinner Attendance
```

**✅ Checkpoint:** Submit a test registration to verify columns are correct!

---

## 📋 PART 2: GOOGLE APPS SCRIPT SETUP

### Step 2.1: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. You'll see a code editor with a blank function
3. **Delete all existing code** in the editor

### Step 2.2: Paste the Script

1. Copy the ENTIRE script from your `3RINCs 2026 - E-waste special session.gs` file
2. Paste it into the Apps Script editor
3. The file should be named `Code.gs` (default name is fine)

### Step 2.3: Verify Configuration

Look at the top of your script and verify these column numbers match your sheet:

```javascript
const CONFIG = {
  seminarName: "E-waste Special Session",
  seminarDate: "March 9, 2026",
  seminarLocation: "Grande Centre Point Prestige Bangkok, Prestige Hall 1",
  
  columns: {
    timestamp: 1,      // Column A
    email: 2,          // Column B
    name: 3,           // Column C
    gender: 4,         // Column D
    country: 5,        // Column E
    phone: 6,          // Column F
    organization: 7,   // Column G
    position: 8,       // Column H
    interest: 9,       // Column I
    dinner: 10,        // Column J
    uniqueId: 11,      // Column K (will be added)
    qrSent: 12,        // Column L (will be added)
    checkedIn: 13,     // Column M (will be added)
    checkInTime: 14    // Column N (will be added)
  }
};
```

**IMPORTANT:** Count your columns carefully! If your form has different fields, update these numbers.

### Step 2.4: Save the Script

1. Click the **disk icon** or press `Ctrl+S` (Windows) or `Cmd+S` (Mac)
2. You may be asked to name your project
3. Name it: **"E-waste Check-in System"**
4. Click **OK**

### Step 2.5: Set Up the Sheet

1. In the Apps Script editor, find the function dropdown at the top
2. Select **`setupSheet`** from the dropdown
3. Click the **Run** button (▶️ play icon)

4. **First time authorization:**
   - Click **Review Permissions**
   - Choose your Google account
   - You'll see a warning: "Google hasn't verified this app"
   - Click **Advanced**
   - Click **Go to E-waste Check-in System (unsafe)**
   - Click **Allow**

5. **Check your Google Sheet:**
   - Go back to your spreadsheet
   - You should see 4 new columns added:
     - Column K: Unique ID
     - Column L: QR Sent
     - Column M: Checked In
     - Column N: Check-in Time
   - Headers should be blue with white text

**✅ Checkpoint:** New columns added with blue headers!

### Step 2.6: Install the Trigger

1. Back in Apps Script editor
2. Select **`installTrigger`** from the function dropdown
3. Click **Run** button (▶️)
4. Check the logs: Should say "Trigger installed successfully!"

5. **Verify trigger is installed:**
   - In Apps Script, click **Triggers** (clock icon on left sidebar)
   - You should see: `onFormSubmit` trigger
   - Event source: From spreadsheet
   - Event type: On form submit

**✅ Checkpoint:** Trigger appears in the Triggers page!

### Step 2.7: Test Email Sending

1. In Apps Script, select **`testEmail`** from dropdown
2. Update the test email in the code:
   ```javascript
   const testEmail = "your-actual-email@example.com"; // Change this!
   ```
3. Click **Save**
4. Click **Run**
5. Check your email inbox (and spam folder)
6. You should receive an email with a QR code!

**✅ Checkpoint:** Test email received with QR code!

---

## 📋 PART 3: DEPLOY AS WEB APP

### Step 3.1: Create New Deployment

1. In Apps Script, click **Deploy** → **New deployment**
2. Click the **gear icon** next to "Select type"
3. Choose **Web app**

### Step 3.2: Configure Deployment

Fill in these settings:

```
Description: E-waste Check-in System v1
Execute as: Me (your-email@gmail.com)
Who has access: Anyone
```

**IMPORTANT:** 
- "Execute as" MUST be "Me"
- "Who has access" MUST be "Anyone" (for GitHub Pages to work)

### Step 3.3: Deploy

1. Click **Deploy**
2. You may need to authorize again:
   - Click "Authorize access"
   - Choose your account
   - Click "Advanced" → "Go to [project] (unsafe)"
   - Click "Allow"

3. **Copy your Web App URL:**
   - You'll see a URL like:
     ```
     https://script.google.com/macros/s/AKfycbx1v_2Z7QLjoMPfCef76ukJ2299VNOJ91Pol7uMfANZJDvCfH3ppEs1HpbnQ1UIQVu6/exec
     ```
   - **COPY THIS ENTIRE URL** - you'll need it soon!
   - Save it somewhere safe (Notepad, etc.)

4. Click **Done**

### Step 3.4: Test the Deployment

1. Open a new browser tab
2. Paste your Web App URL
3. You should see:
   ```json
   {
     "status": "Seminar Check-in API is running",
     "message": "Use POST for check-in or GET with ?action=getStats for statistics"
   }
   ```

**✅ Checkpoint:** Web App URL returns JSON response!

---

## 📋 PART 4: GITHUB PAGES SETUP

### Step 4.1: Create GitHub Account

1. Go to **https://github.com**
2. Click **Sign up** (if you don't have an account)
3. Fill in:
   - Email: your email
   - Password: create a strong password
   - Username: choose a username (e.g., `ewaste-session-2026`)
4. Verify your email
5. Choose **Free** plan

### Step 4.2: Create Repository

1. After logging in, click **+** icon (top right)
2. Click **New repository**

3. Fill in repository details:
   ```
   Repository name: ewaste-checkin
   Description: E-waste Special Session Check-in System
   ✓ Public (MUST be public for free GitHub Pages)
   ✓ Add a README file
   ```

4. Click **Create repository**

### Step 4.3: Upload HTML File

1. In your repository, click **Add file** → **Upload files**

2. **FIRST: Update your HTML file locally:**
   - Open your HTML file in a text editor (Notepad, VS Code, etc.)
   - Find this line (around line 243):
     ```javascript
     const SCRIPT_URL = 'YOUR_SCRIPT_URL_HERE';
     ```
   - Replace with your ACTUAL Web App URL:
     ```javascript
     const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1v_2Z7QLjoMPfCef76ukJ2299VNOJ91Pol7uMfANZJDvCfH3ppEs1HpbnQ1UIQVu6/exec';
     ```
   - **Save the file**

3. **Rename the file to `index.html`:**
   - This makes your URL cleaner (no need to type filename)
   - Right-click file → Rename → `index.html`

4. **Upload to GitHub:**
   - Drag and drop `index.html` into the upload area
   - OR click "choose your files" and select it

5. Scroll down to commit:
   ```
   Commit message: Add check-in interface
   ```

6. Click **Commit changes**

### Step 4.4: Enable GitHub Pages

1. In your repository, click **Settings** (top menu)
2. Click **Pages** in left sidebar
3. Under "Source":
   ```
   Branch: main
   Folder: / (root)
   ```
4. Click **Save**

5. Wait 1-2 minutes, then **refresh the page**

6. You should see a green success message:
   ```
   ✅ Your site is published at https://YOUR-USERNAME.github.io/ewaste-checkin/
   ```

7. **Copy this URL** - this is your check-in site!

### Step 4.5: Test Your Site

1. Click on your GitHub Pages URL
2. The check-in interface should load
3. Check browser console (F12):
   - Should see: "✅ QR Scanner loaded successfully"
   - Should see: "📊 Fetching statistics..."

4. Look at the statistics at the bottom:
   - Should show actual numbers (not "-")
   - If you have test registrations, you'll see real counts

**✅ Checkpoint:** GitHub Pages site loads and shows statistics!

---

## 📋 PART 5: COMPLETE SYSTEM TEST

### Step 5.1: Test Registration Flow

1. Open your Google Form
2. Submit a **real test registration** with your email
3. Check your email (within 1-2 minutes)
4. You should receive an email with QR code
5. Check Google Sheet:
   - New row with your data
   - Column K: Unique ID (e.g., SEM-20260210-0002-456)
   - Column L: "Sent" (green background)

**✅ Checkpoint:** Registration triggers email with QR code!

### Step 5.2: Test Check-In (Manual Entry)

1. Open your GitHub Pages site
2. Copy the Unique ID from the email (e.g., SEM-20260210-0002-456)
3. Click **"⌨️ Manual Entry"** tab
4. Paste the ID
5. Click **"Check In Participant"**
6. You should see: ✅ "Check-In Successful! Welcome, [Your Name]!"

7. Check Google Sheet:
   - Column M: "Yes" (green background)
   - Column N: Current timestamp

**✅ Checkpoint:** Manual check-in works!

### Step 5.3: Test QR Scanner

1. On your GitHub Pages site, click **"📷 QR Scanner"** tab
2. Click **"Start Scanner"**
3. Allow camera access when prompted
4. Open the QR code email on your phone
5. Point your computer camera at the phone's QR code
6. **BEEP!** → Success message should appear
7. Statistics should update

**✅ Checkpoint:** QR scanner works!

### Step 5.4: Test Statistics

1. On your GitHub Pages site, look at the bottom statistics:
   - Should show: Registered: 1 (or more)
   - Should show: Checked In: 1
2. Wait 30 seconds - statistics auto-refresh
3. Do another check-in - numbers update

**✅ Checkpoint:** Statistics display and update!

---

## 📋 PART 6: EVENT DAY PREPARATION

### Step 6.1: Pre-Event Setup (1 week before)

**Test Everything:**
- [ ] Submit 3-5 test registrations
- [ ] Verify all emails arrive
- [ ] Test check-in on actual devices you'll use
- [ ] Test QR scanner with different phones
- [ ] Verify statistics update

**Prepare Equipment:**
- [ ] 2-3 tablets or laptops for check-in
- [ ] Fully charge all devices
- [ ] Bookmark your GitHub Pages URL on all devices
- [ ] Test camera on all devices
- [ ] Prepare backup power banks

**Prepare Staff:**
- [ ] Train 2-3 staff members
- [ ] Show them the interface
- [ ] Practice scanning QR codes
- [ ] Show manual entry backup
- [ ] Give them admin contact

### Step 6.2: Event Day Setup (15 minutes before)

**Setup Stations:**

1. **Check-in Station 1:**
   - Tablet/laptop with GitHub Pages site open
   - Click "Start Scanner"
   - Test with one person

2. **Check-in Station 2:**
   - Second device as backup
   - Same setup

3. **Monitoring Station:**
   - Laptop with Google Sheet open
   - Monitor check-ins in real-time
   - Handle any issues

**Quick Test:**
- [ ] Open sites on all devices
- [ ] Start scanners
- [ ] Test with dummy QR code
- [ ] Check statistics appear
- [ ] Verify internet connection

### Step 6.3: Check-In Process

**For Each Participant:**

1. Participant arrives and shows QR code (on phone or printed)
2. Staff points tablet camera at QR code
3. **BEEP!** → Success sound
4. Green message: "✅ Check-In Successful! Welcome, [Name]!"
5. Stats update automatically
6. Next participant!

**Average time:** 2-3 seconds per person

**If QR code doesn't scan:**
1. Switch to "Manual Entry" tab
2. Ask participant for their email
3. Find their ID in Google Sheet
4. Type ID manually
5. Click "Check In Participant"

---

## 📋 PART 7: TROUBLESHOOTING

### Issue: Email not sending

**Symptoms:** Participant registered but no email received

**Solutions:**
1. Check spam/junk folder
2. Check Google Sheet Column L - should say "Sent"
3. If blank, check Apps Script → Executions for errors
4. Gmail quota: 100 emails/day (upgrade to Google Workspace if needed)
5. Manually run: Extensions → Apps Script → Select row → Run onFormSubmit

### Issue: QR code not scanning

**Symptoms:** Camera on but QR won't scan

**Solutions:**
1. Increase phone screen brightness
2. Get closer (10-15 cm / 4-6 inches)
3. Clean phone screen and camera lens
4. Try different angle
5. Switch to Manual Entry tab
6. Use different device

### Issue: Statistics not updating

**Symptoms:** Shows "-" or wrong numbers

**Solutions:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Check console (F12) for errors
3. Verify SCRIPT_URL is correct
4. Re-deploy Apps Script: Deploy → Manage deployments → New version
5. Wait 30 seconds for auto-refresh

### Issue: "Participant not found"

**Symptoms:** Valid QR code shows error

**Solutions:**
1. Verify ID exists in Google Sheet Column K
2. Check for extra spaces in ID
3. Verify column numbers in CONFIG match your sheet
4. Check Google Sheet has data in that row

### Issue: Camera access denied

**Symptoms:** Red error message, camera won't start

**Solutions:**
1. Grant camera permission in browser settings
2. Try different browser (Chrome recommended)
3. Check device camera isn't used by another app
4. Use Manual Entry tab as backup

---

## 📋 PART 8: POST-EVENT

### Step 8.1: Export Data

1. Open Google Sheet
2. File → Download → Microsoft Excel (.xlsx)
3. OR File → Download → CSV
4. Save attendance records

### Step 8.2: Generate Report

In Google Sheet, add these formulas:

**Total Registered:**
```
=COUNTA(C2:C)
```

**Total Checked In:**
```
=COUNTIF(M2:M,"Yes")
```

**Attendance Rate:**
```
=COUNTIF(M2:M,"Yes")/COUNTA(C2:C)*100&"%"
```

**By Country:**
```
=UNIQUE(E2:E)
```

### Step 8.3: Thank You Emails

You can send thank you emails to checked-in participants:

1. Filter Google Sheet: Column M = "Yes"
2. Copy email addresses
3. Send bulk thank you email via Gmail

---

## 📋 APPENDIX: QUICK REFERENCE

### Your Important URLs

```
Google Form: 
https://forms.google.com/...

Google Sheet:
https://docs.google.com/spreadsheets/d/...

Apps Script:
https://script.google.com/...

Web App API:
https://script.google.com/macros/s/AKfycbx.../exec

GitHub Repository:
https://github.com/YOUR-USERNAME/ewaste-checkin

GitHub Pages Site:
https://YOUR-USERNAME.github.io/ewaste-checkin/
```

### Quick Commands

**Test Statistics (Browser Console):**
```javascript
fetch(SCRIPT_URL + '?action=getStats')
  .then(r => r.json())
  .then(d => console.log(d))
```

**Manual Check-in (Apps Script):**
```javascript
checkInParticipant("SEM-20260309-0001-123")
```

**View Logs (Apps Script):**
```
View → Logs (or Ctrl+Enter)
```

### Staff Quick Guide

**START:**
1. Open site
2. Click "Start Scanner"
3. Ready!

**CHECK-IN:**
1. Point at QR code
2. Listen for BEEP
3. Check green ✓
4. Next!

**BACKUP:**
1. Manual Entry tab
2. Type ID
3. Click button

### Emergency Contacts

```
IT Support: [Your Phone]
Google Sheet: [Share Link]
GitHub Pages: [Your Site URL]
Form Link: [Your Form URL]
```

---

## 🎉 CONGRATULATIONS!

Your system is ready! You now have:

✅ Automated QR code generation and email delivery
✅ Professional web-based check-in interface  
✅ Real-time attendance tracking
✅ Live statistics dashboard
✅ Free hosting on GitHub Pages
✅ Backup manual entry option

**On event day, you'll check in 100+ people in minutes, not hours!**

---

## 📞 SUPPORT

If you need help:

1. Check the Troubleshooting section
2. Open browser console (F12) for error details
3. Check Apps Script → Executions for logs
4. Use the connection-test.html to diagnose
5. Verify all URLs are correct

**Good luck with your E-waste Special Session! 🌱**

---

*Last updated: February 2026*
*System: E-waste Special Session Check-in System*
*Version: 1.0*
