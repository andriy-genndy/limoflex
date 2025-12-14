const SCRIPT_PROP = PropertiesService.getScriptProperties();

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // Get the active sheet (Only works if script is container-bound)
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the JSON data sent from the website
    const data = JSON.parse(e.postData.contents);
    
    // Prepare data for the row
    // Order: Timestamp, Name, Phone, Date, Time, Pickup, Dropoff, Service, Options, Notes
    const newRow = [
      new Date(),
      data.fullName || '',
      data.phone || '',
      data.date || '',
      data.time || '',
      data.pickup || '',
      data.dropoff || '',
      data.serviceType || '',
      Array.isArray(data.options) ? data.options.join(', ') : (data.options || ''),
      data.notes || ''
    ];

    // Append to Google Sheet
    sheet.appendRow(newRow);

    // Send Email to Driver (You)
    try {
      sendDriverNotification(data);
    } catch (driverError) {
      throw new Error("Driver Email Failed: " + driverError.message);
    }

    // Send Confirmation to Customer (Email or SMS)
    if (data.phone) {
        if (data.phone.includes('@')) {
            // It's an email
            try {
                sendCustomerConfirmation(data.phone, data);
            } catch (authError) {
                console.log("Customer Email Failed: " + authError.message);
            }
        } else {
            // Assume it's a phone number
            try {
                sendSms(data.phone, data);
            } catch (smsError) {
                console.log("Customer SMS Failed: " + smsError.message);
            }
        }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ 
          result: 'success', 
          message: 'Reservation received',
          version: '2.0-FIXED'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
          result: 'error', 
          error: error.message,
          stack: error.stack,
          version: '2.0-FIXED'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    lock.releaseLock();
  }
}

// Handle OPTIONS request for CORS (Cross-Origin Resource Sharing)
function doGet(e) {
   return HtmlService.createHtmlOutput("LimoFlex Backend Server is Running");
}

function sendDriverNotification(data) {
  const recipient = 'zvolkov@gmail.com'; 
  const subject = `New LimoFlex Reservation: ${data.fullName}`;
  const body = `
    New Reservation Received!
    
    Name: ${data.fullName}
    Contact: ${data.phone}
    
    Pickup Date: ${data.date}
    Pickup Time: ${data.time}
    
    From: ${data.pickup}
    To: ${data.dropoff}
    
    Service: ${data.serviceType}
    Options: ${Array.isArray(data.options) ? data.options.join(', ') : data.options}
    
    Notes: ${data.notes}
  `;
  
  // Explicit check for recipient
  if (!recipient) throw new Error("Driver recipient email is missing/empty");
  
  MailApp.sendEmail(recipient, subject, body);
}

function sendCustomerConfirmation(email, data) {
    if (!email) throw new Error("Customer email is missing");
    
    MailApp.sendEmail({
        to: email,
        subject: "Reservation Confirmation - LimoFlex",
        body: `Dear ${data.fullName},\n\nWe have received your reservation request for ${data.date} at ${data.time}.\n\nWe will review your request and contact you shortly to confirm details.\n\nThank you,\nLimoFlex Team`
    });
}

// Twilio Configuration - Replace these with your actual values from Twilio Console
const TWILIO_ACCOUNT_SID = 'AC...';
const TWILIO_AUTH_TOKEN = '...';
const TWILIO_PHONE_NUMBER = '+1...';

function sendSms(to, data) {
  if (!to) throw new Error("Phone number is missing");
  
  // Basic cleaning of phone number (remove non-digits)
  // Twilio generally requires E.164 format (e.g., +12405551234)
  let cleanPhone = to.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
      cleanPhone = '1' + cleanPhone;
  }
  if (!cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone;
  }
  
  const body = `LimoFlex Request Received!\n\nHi ${data.fullName}, thanks for booking for ${data.date} at ${data.time}. We'll contact you shortly to confirm.`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const payload = {
    "To": cleanPhone,
    "From": TWILIO_PHONE_NUMBER,
    "Body": body
  };

  const options = {
    "method": "post",
    "payload": payload,
    "headers": {
      "Authorization": "Basic " + Utilities.base64Encode(TWILIO_ACCOUNT_SID + ":" + TWILIO_AUTH_TOKEN)
    }
  };

  UrlFetchApp.fetch(url, options);
}
