# 🎨 CUSTOMIZATION GUIDE - EVENT CHECK-IN SYSTEM TEMPLATES

This guide shows you how to customize the generic templates for **any event**.

---

## 📋 STEP 1: CUSTOMIZE THE GOOGLE APPS SCRIPT

### File: `TEMPLATE-event-checkin-script.gs`

Open the script and find the `CONFIG` section at the top:

```javascript
const CONFIG = {
  // Your event details - CUSTOMIZE THESE
  seminarName: "Your Event Name Here",
  seminarDate: "Month DD, YYYY",
  seminarLocation: "Your Venue Name and Address",
  
  // Email settings - CUSTOMIZE THESE
  senderName: "Event Registration Team",
  emailSubject: "Your Event Registration QR Code",
```

### What to Change:

1. **seminarName:** Your event name
   ```javascript
   // Examples:
   seminarName: "Annual Tech Conference 2026"
   seminarName: "Medical Symposium 2026"
   seminarName: "Wedding Reception - John & Jane"
   seminarName: "Company Annual Meeting"
   ```

2. **seminarDate:** Your event date
   ```javascript
   // Examples:
   seminarDate: "December 15, 2026"
   seminarDate: "March 9-10, 2026" // Multi-day event
   seminarDate: "Q4 2026"
   ```

3. **seminarLocation:** Your venue
   ```javascript
   // Examples:
   seminarLocation: "Convention Center, Room 101, New York"
   seminarLocation: "Online via Zoom"
   seminarLocation: "Grand Ballroom, Hilton Hotel, Bangkok"
   ```

4. **senderName:** Who the email appears from
   ```javascript
   // Examples:
   senderName: "Tech Conference Registration Team"
   senderName: "Medical Symposium Organizers"
   senderName: "Wedding Coordinator"
   senderName: "HR Department"
   ```

5. **emailSubject:** Email subject line
   ```javascript
   // Examples:
   emailSubject: "Your Tech Conference Registration QR Code"
   emailSubject: "Wedding Reception - Your Entry Pass"
   emailSubject: "Annual Meeting Check-in Code"
   ```

---

## 📋 STEP 2: CUSTOMIZE COLUMN NUMBERS

**CRITICAL:** You must match these to your Google Form!

### How to Count Columns:

1. Open your Google Sheet
2. Look at the header row:
   ```
   A          B              C            D           E
   Timestamp  Email Address  Full Name    Phone       Company
   ```
3. Count from left to right (A=1, B=2, C=3, etc.)

### Update the Script:

```javascript
columns: {
  timestamp: 1,      // Column A - ALWAYS 1
  email: 2,          // Column B - Email is usually here
  name: 3,           // Column C - Name is usually here
  field1: 4,         // Column D - YOUR FIELD
  field2: 5,         // Column E - YOUR FIELD
  field3: 6,         // Column F - YOUR FIELD
  // ... add more as needed
  uniqueId: 10,      // Last column + 1
  qrSent: 11,        // Last column + 2
  checkedIn: 12,     // Last column + 3
  checkInTime: 13    // Last column + 4
}
```

### Examples for Different Events:

**Wedding Event:**
```javascript
columns: {
  timestamp: 1,      // Timestamp
  email: 2,          // Email
  name: 3,           // Guest Name
  plusOne: 4,        // +1 Guest Name
  dietaryReq: 5,     // Dietary Requirements
  tableNumber: 6,    // Table Assignment
  uniqueId: 7,       // Unique ID
  qrSent: 8,         // QR Sent
  checkedIn: 9,      // Checked In
  checkInTime: 10    // Check-in Time
}
```

**Corporate Meeting:**
```javascript
columns: {
  timestamp: 1,      // Timestamp
  email: 2,          // Email
  name: 3,           // Employee Name
  department: 4,     // Department
  employeeId: 5,     // Employee ID
  uniqueId: 6,       // Unique ID
  qrSent: 7,         // QR Sent
  checkedIn: 8,      // Checked In
  checkInTime: 9     // Check-in Time
}
```

**Concert/Festival:**
```javascript
columns: {
  timestamp: 1,      // Timestamp
  email: 2,          // Email
  name: 3,           // Name
  age: 4,            // Age
  ticketType: 5,     // VIP/General
  uniqueId: 6,       // Unique ID
  qrSent: 7,         // QR Sent
  checkedIn: 8,      // Checked In
  checkInTime: 9     // Check-in Time
}
```

---

## 📋 STEP 3: CUSTOMIZE THE HTML FILE

### File: `TEMPLATE-event-checkin-interface.html`

### 3.1: Update the Page Title

Find this section (around line 5):
```html
<title>Event Check-In System - QR Scanner</title>
```

Change to:
```html
<!-- Examples: -->
<title>Tech Conference 2026 - Check-In</title>
<title>Wedding Reception - Guest Check-In</title>
<title>Annual Meeting - Attendance</title>
```

### 3.2: Update the Header

Find this section (around line 254):
```html
<h1>📋 Event Check-In</h1>
<p>Scan QR code or enter participant ID</p>
```

Change to match your event:
```html
<!-- Examples: -->
<h1>🎪 Tech Conference Check-In</h1>
<p>Welcome! Please scan your QR code</p>

<h1>💒 Wedding Reception</h1>
<p>Welcome to our celebration!</p>

<h1>🏢 Annual Meeting Check-In</h1>
<p>Employee attendance tracking</p>
```

### 3.3: Update the Placeholder

Find this (around line 279):
```html
<input 
    type="text" 
    id="uniqueId" 
    placeholder="EVT-20260210-0001-123"
```

The placeholder shows users what format to expect. Keep it as is or customize:
```html
<!-- Examples: -->
placeholder="EVT-20260210-0001-123" (default)
placeholder="CONF-20260315-0001-456" (for conference)
placeholder="WED-20260520-0001-789" (for wedding)
```

### 3.4: Add Your Script URL

**MOST IMPORTANT STEP!**

Find this (around line 243):
```javascript
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```

Replace with your actual Web App URL from Google Apps Script:
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

---

## 🎨 STEP 4: CUSTOMIZE COLORS (OPTIONAL)

### Change the Background Gradient

Find this in the CSS (around line 14):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Popular Color Schemes:**

**Blue (Professional):**
```css
background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
```

**Green (Nature/Eco):**
```css
background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
```

**Red (Celebration):**
```css
background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
```

**Purple (Elegant):**
```css
background: linear-gradient(135deg, #7F00FF 0%, #E100FF 100%);
```

**Gold (Luxury):**
```css
background: linear-gradient(135deg, #f12711 0%, #f5af19 100%);
```

### Change Button Colors

Find button styles (around line 74):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Match it to your gradient above for consistency.

---

## 📋 STEP 5: CUSTOMIZE EMAIL TEMPLATE

In the script file, find the `sendQREmail` function.

### 5.1: Change Email Colors

Find this (around line 133):
```css
.header { background-color: #4285f4; color: white; ...
```

**Color Options:**
```css
/* Blue (default) */
background-color: #4285f4;

/* Green */
background-color: #28a745;

/* Red */
background-color: #dc3545;

/* Purple */
background-color: #6f42c1;

/* Gold */
background-color: #ffc107;
```

### 5.2: Add Your Logo (Optional)

Find the header section (around line 149):
```html
<div class="header">
  <h1>${CONFIG.seminarName}</h1>
</div>
```

Add a logo:
```html
<div class="header">
  <img src="https://your-website.com/logo.png" style="max-width: 150px; margin-bottom: 10px;">
  <h1>${CONFIG.seminarName}</h1>
</div>
```

### 5.3: Customize Email Message

Find this section (around line 153):
```html
<p>Thank you for registering for our event. We're excited to have you join us!</p>
```

Change to match your event tone:
```html
<!-- Professional -->
<p>Your registration has been confirmed. We look forward to your participation.</p>

<!-- Casual -->
<p>You're all set! Can't wait to see you there! 🎉</p>

<!-- Formal -->
<p>We are pleased to confirm your registration and anticipate your attendance.</p>

<!-- Wedding -->
<p>We're so happy you'll be celebrating with us! ❤️</p>
```

---

## 📋 STEP 6: CUSTOMIZE UNIQUE ID FORMAT

In the script, find `generateUniqueId` function (around line 102):

```javascript
return `EVT-${date}-${rowPadded}-${random}`;
```

**Change the prefix:**
```javascript
// Examples:
return `CONF-${date}-${rowPadded}-${random}`;  // Conference
return `WED-${date}-${rowPadded}-${random}`;   // Wedding
return `MED-${date}-${rowPadded}-${random}`;   // Medical
return `CORP-${date}-${rowPadded}-${random}`;  // Corporate
return `FEST-${date}-${rowPadded}-${random}`;  // Festival
```

**Result Examples:**
- CONF-20260315-0001-456
- WED-20260520-0012-789
- MED-20260810-0045-123

---

## 📋 QUICK CUSTOMIZATION CHECKLIST

Before using the templates, make sure you've customized:

**In Google Apps Script:**
- [ ] seminarName
- [ ] seminarDate
- [ ] seminarLocation
- [ ] senderName
- [ ] emailSubject
- [ ] Column numbers (CRITICAL!)
- [ ] Unique ID prefix (optional)
- [ ] Email colors (optional)
- [ ] Test email address

**In HTML File:**
- [ ] Page title
- [ ] Header text
- [ ] SCRIPT_URL (CRITICAL!)
- [ ] Background colors (optional)
- [ ] Button colors (optional)

---

## 🎯 EXAMPLE: WEDDING CUSTOMIZATION

### Script Changes:
```javascript
const CONFIG = {
  seminarName: "John & Jane Wedding Reception",
  seminarDate: "June 15, 2026",
  seminarLocation: "Garden Terrace, Grand Hotel",
  senderName: "John & Jane Wedding Team",
  emailSubject: "Your Wedding Reception Entry Pass ❤️",
  
  columns: {
    timestamp: 1,
    email: 2,
    name: 3,
    plusOne: 4,
    dietary: 5,
    tableNumber: 6,
    uniqueId: 7,
    qrSent: 8,
    checkedIn: 9,
    checkInTime: 10
  }
};
```

### HTML Changes:
```html
<h1>💒 John & Jane's Wedding</h1>
<p>Welcome to our special day!</p>
```

### CSS Changes:
```css
/* Romantic pink gradient */
background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
```

---

## 🎯 EXAMPLE: CORPORATE EVENT CUSTOMIZATION

### Script Changes:
```javascript
const CONFIG = {
  seminarName: "XYZ Corp Annual Meeting 2026",
  seminarDate: "September 10, 2026",
  seminarLocation: "HQ Auditorium, Floor 15",
  senderName: "XYZ Corp HR Department",
  emailSubject: "Annual Meeting - Your Attendance QR Code",
  
  columns: {
    timestamp: 1,
    email: 2,
    name: 3,
    department: 4,
    employeeId: 5,
    uniqueId: 6,
    qrSent: 7,
    checkedIn: 8,
    checkInTime: 9
  }
};
```

### HTML Changes:
```html
<h1>🏢 XYZ Corp Annual Meeting</h1>
<p>Employee check-in system</p>
```

### CSS Changes:
```css
/* Corporate blue */
background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
```

---

## 💡 PRO TIPS

1. **Keep it simple** - Don't over-customize, especially for time-sensitive events

2. **Test thoroughly** - After customization, test the entire flow:
   - Submit test registration
   - Check email arrives
   - Test QR scanning
   - Verify statistics

3. **Backup original** - Keep a copy of the templates before customizing

4. **Match branding** - Use your event's colors and fonts if possible

5. **Mobile-first** - Most participants will view on phones, keep text readable

6. **Accessibility** - Ensure good color contrast for readability

---

## 🆘 COMMON MISTAKES TO AVOID

❌ **Wrong column numbers** - Count carefully!
❌ **Forgot to update SCRIPT_URL** - Most common error!
❌ **Typos in event name** - Double-check spelling
❌ **Wrong date format** - Be consistent
❌ **Not testing** - Always test before the event

---

## ✅ YOU'RE READY!

After customization:
1. Follow the COMPLETE-SETUP-GUIDE.md
2. Test everything thoroughly
3. Deploy before your event
4. Enjoy stress-free check-in! 🎉

---

*Templates ready to use for: Conferences • Weddings • Meetings • Seminars • Workshops • Concerts • Festivals • Corporate Events • Any event with registration!*
