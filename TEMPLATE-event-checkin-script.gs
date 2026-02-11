// ============================================================
// SEMINAR/EVENT CHECK-IN SYSTEM - Google Apps Script
// ============================================================
// This script automatically generates QR codes and emails them
// to participants when they register via Google Form
// ============================================================

// ============================================================
// CONFIGURATION - UPDATE THESE VALUES FOR YOUR EVENT
// ============================================================
const CONFIG = {
  // Your event details - CUSTOMIZE THESE
  seminarName: "Your Event Name Here",
  seminarDate: "Month DD, YYYY",
  seminarLocation: "Your Venue Name and Address",
  
  // Email settings - CUSTOMIZE THESE
  senderName: "Event Registration Team",
  emailSubject: "Your Event Registration QR Code",
  
  // QR Code API (using free API - no key needed)
  qrApiUrl: "https://api.qrserver.com/v1/create-qr-code/",
  qrSize: "300x300", // Size of QR code image
  
  // Column numbers in your Google Sheet
  // IMPORTANT: Count your columns and update these numbers!
  // Example: If Email is in Column B, then email: 2
  columns: {
    timestamp: 1,      // Column A - Form submission timestamp
    email: 2,          // Column B - Participant email
    name: 3,           // Column C - Participant name
    field1: 4,         // Column D - Your custom field 1
    field2: 5,         // Column E - Your custom field 2
    field3: 6,         // Column F - Your custom field 3
    field4: 7,         // Column G - Your custom field 4
    field5: 8,         // Column H - Your custom field 5
    field6: 9,         // Column I - Your custom field 6
    // Add more fields as needed...
    uniqueId: 10,      // Column J - Unique ID (auto-generated)
    qrSent: 11,        // Column K - QR Sent status (auto-generated)
    checkedIn: 12,     // Column L - Check-in status (auto-generated)
    checkInTime: 13    // Column M - Check-in timestamp (auto-generated)
  }
};

// ============================================================
// MAIN FUNCTION - Triggered on Form Submit
// ============================================================
function onFormSubmit(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const row = e.range.getRow();
    
    // Get participant data from the submitted row
    const email = sheet.getRange(row, CONFIG.columns.email).getValue();
    const name = sheet.getRange(row, CONFIG.columns.name).getValue();
    
    // Check if email already sent (prevent duplicates)
    const qrSentStatus = sheet.getRange(row, CONFIG.columns.qrSent).getValue();
    if (qrSentStatus === "Sent") {
      Logger.log("QR code already sent to: " + email);
      return;
    }
    
    // Generate unique ID for this participant
    const uniqueId = generateUniqueId(row);
    sheet.getRange(row, CONFIG.columns.uniqueId).setValue(uniqueId);
    
    // Generate QR code URL
    const qrCodeUrl = generateQRCode(uniqueId);
    
    // Send email with QR code
    sendQREmail(email, name, uniqueId, qrCodeUrl);
    
    // Mark as sent
    sheet.getRange(row, CONFIG.columns.qrSent).setValue("Sent");
    sheet.getRange(row, CONFIG.columns.qrSent).setBackground("#d9ead3"); // Light green
    
    Logger.log("Successfully sent QR code to: " + email);
    
  } catch (error) {
    Logger.log("Error in onFormSubmit: " + error.toString());
    // Optionally send error notification to admin
    sendErrorNotification(error);
  }
}

// ============================================================
// GENERATE UNIQUE ID
// ============================================================
function generateUniqueId(rowNumber) {
  // Format: EVT-YYYYMMDD-ROWNUMBER-RANDOM
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const rowPadded = rowNumber.toString().padStart(4, '0');
  
  return `EVT-${date}-${rowPadded}-${random}`;
}

// ============================================================
// GENERATE QR CODE
// ============================================================
function generateQRCode(uniqueId) {
  // Using free QR code API
  // The QR code will contain the unique ID
  const qrUrl = `${CONFIG.qrApiUrl}?size=${CONFIG.qrSize}&data=${encodeURIComponent(uniqueId)}`;
  return qrUrl;
}

// ============================================================
// SEND EMAIL WITH QR CODE
// ============================================================
function sendQREmail(email, name, uniqueId, qrCodeUrl) {
  // Fetch the QR code image
  const qrImageBlob = UrlFetchApp.fetch(qrCodeUrl).getBlob().setName("qr-code.png");
  
  // Create email body (HTML)
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4285f4; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
        .qr-container { text-align: center; margin: 30px 0; background-color: white; padding: 20px; border-radius: 5px; }
        .qr-code { max-width: 300px; height: auto; }
        .info-box { background-color: #fff; border-left: 4px solid #4285f4; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 12px 30px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${CONFIG.seminarName}</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>Thank you for registering for our event. We're excited to have you join us!</p>
          
          <div class="info-box">
            <strong>📅 Date:</strong> ${CONFIG.seminarDate}<br>
            <strong>📍 Location:</strong> ${CONFIG.seminarLocation}<br>
            <strong>🎫 Your ID:</strong> ${uniqueId}
          </div>
          
          <h3>Your Check-in QR Code</h3>
          <p>Please save this QR code and show it at the registration desk on the event day:</p>
          
          <div class="qr-container">
            <img src="cid:qrCode" class="qr-code" alt="Your QR Code">
            <p><strong>Registration ID: ${uniqueId}</strong></p>
          </div>
          
          <div class="info-box">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>Save this email or take a screenshot of your QR code</li>
              <li>You can also show this QR code from your phone</li>
              <li>Arrive 15 minutes early for smooth check-in</li>
            </ul>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>See you at the event!</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} ${CONFIG.seminarName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Plain text version (fallback)
  const plainBody = `
Hello ${name}!

Thank you for registering for ${CONFIG.seminarName}.

Event Details:
- Date: ${CONFIG.seminarDate}
- Location: ${CONFIG.seminarLocation}
- Your Registration ID: ${uniqueId}

Your QR code is attached to this email. Please show it at the registration desk on the event day.

Important:
- Save this email or take a screenshot of your QR code
- Arrive 15 minutes early for smooth check-in

See you at the event!

---
This is an automated email. Please do not reply to this message.
  `;
  
  // Send email
  GmailApp.sendEmail(email, CONFIG.emailSubject, plainBody, {
    htmlBody: htmlBody,
    inlineImages: {
      qrCode: qrImageBlob
    },
    name: CONFIG.senderName,
    attachments: [qrImageBlob]
  });
}

// ============================================================
// CHECK-IN FUNCTION (Manual or via Web App)
// ============================================================
function checkInParticipant(uniqueId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Find the participant by unique ID
  for (let i = 1; i < data.length; i++) { // Start from 1 to skip header
    if (data[i][CONFIG.columns.uniqueId - 1] === uniqueId) {
      const row = i + 1;
      
      // Check if already checked in
      if (sheet.getRange(row, CONFIG.columns.checkedIn).getValue() === "Yes") {
        return {
          success: false,
          message: "Already checked in",
          name: data[i][CONFIG.columns.name - 1],
          checkInTime: sheet.getRange(row, CONFIG.columns.checkInTime).getValue()
        };
      }
      
      // Mark as checked in
      const checkInTime = new Date();
      sheet.getRange(row, CONFIG.columns.checkedIn).setValue("Yes");
      sheet.getRange(row, CONFIG.columns.checkInTime).setValue(checkInTime);
      sheet.getRange(row, CONFIG.columns.checkedIn).setBackground("#b6d7a8"); // Green
      
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

// ============================================================
// GET STATISTICS FUNCTION
// ============================================================
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
    Logger.log("Error in getStats: " + error.toString());
    return {
      totalRegistered: 0,
      totalCheckedIn: 0,
      percentage: 0,
      error: error.toString()
    };
  }
}

// ============================================================
// WEB APP HANDLERS
// ============================================================
function doGet(e) {
  try {
    // Handle statistics request
    if (e && e.parameter && e.parameter.action === 'getStats') {
      const stats = getStats();
      return ContentService
        .createTextOutput(JSON.stringify(stats))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "Event Check-in API is running",
        message: "Use POST for check-in or GET with ?action=getStats for statistics"
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error in doGet: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const uniqueId = e.parameter.uniqueId;
    
    // Validate input
    if (!uniqueId || uniqueId.trim() === '') {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: "Invalid ID"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Call the check-in function
    const result = checkInParticipant(uniqueId.trim());
    
    // Return result as JSON
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

// ============================================================
// SETUP FUNCTION - Run this once to set up headers
// ============================================================
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Add headers if they don't exist
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Add new columns if needed
  const newHeaders = ["Unique ID", "QR Sent", "Checked In", "Check-in Time"];
  let lastCol = sheet.getLastColumn();
  
  newHeaders.forEach((header, index) => {
    sheet.getRange(1, lastCol + index + 1).setValue(header);
  });
  
  // Format header row
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight("bold").setBackground("#4285f4").setFontColor("white");
  
  Logger.log("Sheet setup complete!");
}

// ============================================================
// INSTALL TRIGGER - Run this once to set up automatic trigger
// ============================================================
function installTrigger() {
  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Install new trigger
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(sheet)
    .onFormSubmit()
    .create();
  
  Logger.log("Trigger installed successfully!");
}

// ============================================================
// ERROR NOTIFICATION (Optional)
// ============================================================
function sendErrorNotification(error) {
  const adminEmail = Session.getActiveUser().getEmail();
  MailApp.sendEmail(
    adminEmail,
    "Error in Event Check-in System",
    "An error occurred:\n\n" + error.toString()
  );
}

// ============================================================
// TEST FUNCTIONS
// ============================================================
function testEmail() {
  const testEmail = "your-email@example.com"; // CHANGE THIS to your email
  const testName = "Test User";
  const testId = "EVT-TEST-0001-999";
  const qrUrl = generateQRCode(testId);
  
  sendQREmail(testEmail, testName, testId, qrUrl);
  Logger.log("Test email sent!");
}

function testCheckIn() {
  // Test with a real ID from your sheet
  const result = checkInParticipant("EVT-20260210-0002-123");
  Logger.log("Check-in result: " + JSON.stringify(result));
}

function testStats() {
  const stats = getStats();
  Logger.log("Statistics: " + JSON.stringify(stats));
}
