# Google Sheets Setup Guide - Turf Expense Manager

This app uses **Google Sheets as the database** - completely FREE, no server needed, automated calculations!

---

## Step 1: Create a Google Sheet

1. Go to **https://sheets.google.com**
2. Click **"+ New"** → **Blank Spreadsheet**
3. Name it: **"Turf Expense Manager"**

---

## Step 2: Create the Sheet Tabs

You need **3 sheets** (tabs at the bottom):

### Sheet 1: **Members**
Rename first sheet to "Members"

| Name | Balance |
|------|---------|
| Pratik | =SUMIF(Ledger!B:B,A2,Ledger!D:D) |
| Avi | =SUMIF(Ledger!B:B,A3,Ledger!D:D) |

- Column A: Member names
- Column B: Balance (auto-calculated by formula)

### Sheet 2: **Sessions**
Create new sheet called "Sessions"

| Date | SplitAmount | AttendedMembers |
|------|------------|-----------------|
| 2024-10-31 | 210 | Pratik,Avi,Hari |

### Sheet 3: **Ledger** (Append-only)
Create new sheet called "Ledger"

| Date | MemberName | Type | Amount | Reason |
|------|-----------|------|--------|--------|
| 2024-10-31 | Pratik | subscription | 500 | Monthly subscription |
| 2024-10-31 | Pratik | charge | -210 | Session on 2024-10-31 |

---

## Step 3: Get Your Sheet ID

1. Open your Google Sheet
2. Look at the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
3. Copy the **[SHEET_ID]** part (long string between /d/ and /edit)

Example: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`

---

## Step 4: Enable Google Sheets API

1. Go to **https://console.cloud.google.com**
2. Create a new project (or select existing)
3. Search for **"Google Sheets API"**
4. Click **"Enable"**
5. Go to **Credentials** → **Create Credentials** → **API Key**
6. Copy your **API Key**

---

## Step 5: Update the App

1. Open the app file: `js/app-sheets.js`
2. Find this section at the top:
   ```javascript
   const CONFIG = {
       MONTHLY_SUBSCRIPTION: 500,
       MIN_BALANCE_WARNING: 150,
       CURRENCY: '₹',
       SHEET_ID: 'YOUR_GOOGLE_SHEET_ID',  // Replace here
       API_KEY: 'YOUR_GOOGLE_API_KEY'     // Replace here
   };
   ```
3. Replace with **your actual values**:
   - `SHEET_ID`: Your Sheet ID from Step 3
   - `API_KEY`: Your API Key from Step 4

Example:
```javascript
SHEET_ID: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
API_KEY: 'AIzaSyDxxx...'
```

---

## Step 6: Test the App

1. Deploy the app: `firebase deploy`
2. Open: **https://turf-expense-manager.web.app/index-sheets.html**
3. Test:
   - Add a member
   - Create a session
   - Check Google Sheet (refresh) - data should appear!

---

## How It Works

✅ **All calculations are automated** in Google Sheets:
- Balance = SUM of all ledger entries for that member
- Monthly totals auto-calculated
- Low balance warning auto-checked
- CSV export auto-generated

✅ **Data is shared** across all devices:
- Everyone accessing the app sees same data
- Google Sheets syncs in real-time
- No backend server needed

✅ **Completely FREE**:
- Google Sheets is free
- API is free (10K queries/day free)
- Hosting on Firebase is free
- Works forever

---

## Formulas Reference

### Member Balance (Automatic)
In Members sheet, column B:
```
=SUMIF(Ledger!B:B, A2, Ledger!D:D)
```

This sums all amounts in Ledger where member name matches.

### Low Balance Warning
```
=IF(B2 < 150, "⚠️ LOW", "✅ OK")
```

---

## Troubleshooting

**Q: Data not showing?**
- Check Sheet ID and API Key are correct
- Make sure Google Sheets API is enabled
- Refresh the page

**Q: Can't edit in app?**
- Make sure Sheets have correct column names
- Check API Key permissions

**Q: Need more help?**
- Google Sheets API Docs: https://developers.google.com/sheets/api
- Firebase Setup: https://firebase.google.com/docs/hosting

---

## You're All Set! 🎉

The app is ready to use with:
- ✅ Automated calculations
- ✅ Shared data across devices
- ✅ Beautiful, responsive UI
- ✅ Completely FREE forever
- ✅ No server maintenance needed

Happy tracking! ⚽
