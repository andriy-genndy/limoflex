# Google Forms Integration Guide for LimoFlex

## Overview
This guide shows you how to integrate your website's contact form with Google Forms to automatically collect submissions in a Google Spreadsheet.

## Step-by-Step Setup

### 1. Create a Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Click "Create a new form"
3. Add the following fields (in this exact order):
   - **Name** (Short answer) - "Name, nickname or organization"
   - **Contacts** (Short answer) - "Phone number or Email"
   - **Service Type** (Multiple choice) - Options: Point-to-Point Ride ($85/hour), Airport Transfer, Corporate Event, Wedding, Special Occasion, Hourly Service ($85/hour), Other
   - **Pickup Date** (Date)
   - **Pickup Time** (Time) - Add description: "Reservations must be made at least two hours in advance"
   - **Pickup Location** (Short answer)
   - **Drop-off Location** (Short answer)
   - **Options** (Checkboxes) - Options: Round-trip (10% discount), I'm riding with a pet (must be in a container)
   - **Is there a waiting time** (Multiple choice) - Options: Yes, No - Add description: "Waiting time begins after 15 minutes. Minimum waiting charge is $30. Every additional 10 minutes is $15."
   - **Your explanations and wishes** (Paragraph)
   - **I have read and agree to the rates and conditions** (Checkboxes) - Option: I agree

### 2. Get the Form Action URL

1. In your Google Form, click "Send"
2. Click the link icon (<>)
3. Copy the URL that appears
4. Remove everything after `/viewform` and replace it with `/formResponse`
   
   Example:
   ```
   Original: https://docs.google.com/forms/d/e/1FAIpQLSe.../viewform
   Modified: https://docs.google.com/forms/d/e/1FAIpQLSe.../formResponse
   ```

### 3. Get Field IDs

1. Open your Google Form in a new tab
2. Right-click and select "View Page Source"
3. Search for `entry.` to find field IDs
4. You'll see entries like `entry.123456789`

### 4. Update Your Website

Replace the placeholders in `index.html`:

```html
<!-- Replace these in your form -->
action="YOUR_GOOGLE_FORM_ACTION_URL"      <!-- Use the /formResponse URL -->
name="entry.NAME_FIELD_ID"                <!-- Name field ID -->
name="entry.CONTACTS_FIELD_ID"            <!-- Contacts field ID -->
name="entry.PICKUP_DATE_FIELD_ID"         <!-- Pickup date field ID -->
name="entry.PICKUP_TIME_FIELD_ID"         <!-- Pickup time field ID -->
name="entry.PICKUP_LOCATION_FIELD_ID"     <!-- Pickup location field ID -->
name="entry.DROPOFF_LOCATION_FIELD_ID"    <!-- Drop-off location field ID -->
name="entry.SERVICE_TYPE_FIELD_ID"        <!-- Service type field ID -->
name="entry.OPTIONS_FIELD_ID"             <!-- Options checkboxes field ID -->
name="entry.WAITING_TIME_FIELD_ID"        <!-- Waiting time field ID -->
name="entry.EXPLANATIONS_FIELD_ID"        <!-- Explanations field ID -->
name="entry.TERMS_FIELD_ID"               <!-- Terms agreement field ID -->
```

### Example Configuration:
```html
<form class="reservation-form" action="https://docs.google.com/forms/d/e/1FAIpQLSe123.../formResponse" method="POST" target="hidden-iframe">
    <input type="text" name="entry.123456789" placeholder="Name, nickname or organization" required>
    <input type="text" name="entry.987654321" placeholder="Phone number or Email" required>
    <input type="date" name="entry.456789123" placeholder="Pickup Date" required>
    <input type="time" name="entry.789123456" placeholder="Pickup Time" required>
    <!-- etc... -->
</form>
```

## Alternative Options

### Option 1: Google Apps Script (More Advanced)
- Create a Google Apps Script to handle form submissions
- Provides more control and can send confirmation emails
- Requires some coding knowledge

### Option 2: Third-Party Services
- **Formspree**: Easy integration, free tier available
- **Netlify Forms**: If hosting on Netlify
- **Zapier**: Connect to multiple services

### Option 3: Emailjs (JavaScript-based)
- Send emails directly from JavaScript
- No backend required
- Good for simple contact forms

## Google Forms Benefits

✅ **Free and reliable**
✅ **Automatic spreadsheet creation**
✅ **Email notifications**
✅ **Data validation**
✅ **Easy to set up**
✅ **Mobile-friendly admin interface**

## Setup Checklist

- [ ] Create Google Form with matching fields
- [ ] Get form action URL (with /formResponse)
- [ ] Find all field IDs using page source
- [ ] Update index.html with correct URLs and field names
- [ ] Test form submission
- [ ] Check Google Sheets for data
- [ ] Set up email notifications in Google Forms

## Testing

1. Submit a test form on your website
2. Check if data appears in the linked Google Spreadsheet
3. Verify all fields are captured correctly
4. Test email notifications (if enabled)

## Email Notifications Setup

1. In your Google Form, click the "Responses" tab
2. Click the three dots menu → "Get email notifications for new responses"
3. Enter limoflexcare@gmail.com to receive notifications

This integration will automatically collect all form submissions in a Google Spreadsheet and can send you email notifications for each new quote request!
