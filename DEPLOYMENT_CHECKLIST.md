# 📋 Deployment Checklist

## Before You Deploy

- [ ] Read **QUICKSTART.md** (3-step overview)
- [ ] Read **SETUP.md** (detailed step-by-step)
- [ ] Have a Google account (for Firebase)
- [ ] Node.js installed (for Firebase CLI) — or use browser upload

---

## Firebase Setup (5 min)

- [ ] Create Firebase project at [firebase.google.com](https://firebase.google.com)
- [ ] Enable **Firestore Database** (production mode)
- [ ] Enable **Authentication** (Email/Password)
- [ ] Enable **Hosting**
- [ ] Copy **Firebase config** from Project Settings

---

## Update Config

- [ ] Open `js/config.js`
- [ ] Replace `YOUR_API_KEY` with your actual API key
- [ ] Replace `YOUR_PROJECT_ID` with your project ID (appears 3 times)
- [ ] Replace `YOUR_SENDER_ID` with your sender ID
- [ ] Replace `YOUR_APP_ID` with your app ID
- [ ] Save the file

---

## Deploy (Choose One)

### Option A: Firebase CLI (Recommended)

- [ ] Install Node.js from [nodejs.org](https://nodejs.org)
- [ ] Open terminal/command prompt in project folder
- [ ] Run: `npm install -g firebase-tools`
- [ ] Run: `firebase login` (opens browser)
- [ ] Run: `firebase deploy`
- [ ] Copy the **Hosting URL** from the output

### Option B: Manual Upload (No CLI)

- [ ] Go to Firebase Console → **Hosting**
- [ ] Click **Upload files** or **Connect to Git**
- [ ] Upload all files from this folder (except `.git`, `.tools`, `*.md`)
- [ ] Get your hosting URL

---

## First Time Login

- [ ] Open your app in browser (the hosting URL)
- [ ] Click **"Create Account"**
- [ ] Enter your name, email, password
- [ ] You're now **ADMIN** (first user always is)
- [ ] ✅ You're ready to manage the group!

---

## Configure Firestore (Important)

After first deploy, set up security rules:

### Option A: CLI
```bash
firebase deploy --only firestore:rules
```

### Option B: Console
- [ ] Go to Firebase Console → **Firestore** → **Rules**
- [ ] Copy contents of `firestore.rules` file
- [ ] Paste into the editor
- [ ] Click **Publish**

---

## Test the App

### Admin Functions
- [ ] Login as admin
- [ ] View **Dashboard** (no transactions yet, so empty)
- [ ] Go to **Members** tab
- [ ] Click **"+ Add Member"**
- [ ] Add 2-3 test members (name and email)
- [ ] Go to **Sessions** tab
- [ ] Click **"+ New Session"**
- [ ] Create a test session:
  - Date: Today
  - Split: 210
  - Total: 1050 (optional)
- [ ] Click session to mark attendance
  - Mark 2 members as "attended"
  - Leave 1 as "absent"
- [ ] Click **"Apply Charges"**
- [ ] Go back to **Members** → check balances updated

### Member Functions
- [ ] Logout (click **Logout** in top right)
- [ ] Open app in **new private browser window** (so different login)
- [ ] Sign up as one of the members you added
- [ ] View **Dashboard** → should see negative balance (e.g., -210)
- [ ] Go to **My Statement** → select current month
- [ ] See the charge transaction
- [ ] Click **"📥 Export CSV"** → check it downloads

### Admin Functions (continued)
- [ ] Login as admin again
- [ ] Go to **Reports** → select month → view all members' balances
- [ ] Go to **Members** → click **Adjust** on someone
- [ ] Add a refund or manual adjustment
- [ ] Check their balance updated

---

## Share with Group

- [ ] Copy your hosting URL: `https://YOUR_PROJECT_ID.web.app`
- [ ] Send to group via **WhatsApp**, email, etc
- [ ] Each member creates account (you don't add them in Firebase)
- [ ] They see their balance and transaction history

---

## Post-Launch Monitoring

- [ ] Check Firebase free tier usage: **Usage** tab
  - Should show <50K reads/day and <20K writes/day for small group
- [ ] Monitor **Firestore** size (should stay <1GB)
- [ ] Set up **Backups** (Firebase auto-exports daily)

---

## Troubleshooting

**If signup doesn't work:**
- Check Firebase Console → Authentication → Email/Password is enabled
- Check Firestore rules are deployed
- Check browser console (F12) for errors

**If app is slow:**
- First load: ~3 seconds (Firebase SDK download, then cached)
- Refresh page if data doesn't appear
- Check Network tab (F12) for failed requests

**If changes don't appear:**
- Firestore syncs within seconds
- Try refreshing the page
- Check browser console for errors

**If you can't deploy:**
- Make sure `js/config.js` has all fields filled
- Make sure Firebase CLI is installed: `firebase --version`
- Make sure you're logged in: `firebase login`

---

## What Happens Next

✅ **Day 1:** Deploy, test, add members  
✅ **Week 1:** First session, apply charges  
✅ **Month 1:** First member report  
✅ **Going forward:** Auto-manage balances  

The app handles:
- Monthly subscriptions (add to balance)
- Session charges (deduct from attendees)
- Carry-forward (pending dues go to next month)
- Low balance warnings
- Audit history (append-only, never deleted)

---

## Still Have Questions?

📖 **Detailed setup:** See **SETUP.md**  
📖 **Full docs:** See **README.md**  
📖 **Why Firebase?:** See **HANDOFF.md**  

---

## Success Criteria

When this is done, you should have:

✅ A live web app at a URL (https://...)  
✅ First user (you) as admin  
✅ Members can sign up  
✅ Balances auto-update  
✅ Statements export to CSV  
✅ All data in your Firebase account  
✅ Zero monthly hosting costs  

**Congratulations! Your expense manager is live.** 🎉
