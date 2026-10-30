# 🚀 Quick Start (3 steps)

## What You Have

A complete **free web app** for managing turf group expenses. No server to run, no database to manage. Everything works in the browser.

### Features Built:
✅ Member subscriptions (₹500/month)  
✅ Session tracking with attendance  
✅ Automatic balance deductions  
✅ Monthly audit history (append-only ledger)  
✅ Low balance warnings  
✅ Admin dashboard + member statements  
✅ CSV export  
✅ Mobile-responsive design  
✅ Role-based access control  

---

## Deploy in 5 Minutes

### 1️⃣ Create Firebase Project

Go to **[firebase.google.com](https://firebase.google.com)**

- Click **"Get Started"**
- Create new project: `turf-expense-manager`
- Enable Firestore Database (production mode)
- Enable Email/Password Authentication
- Enable Hosting

### 2️⃣ Get Your Config

In Firebase Console:
- **Project Settings** (⚙️ icon, top right)
- Scroll to **"Your apps"** → Web app
- Copy the config object

### 3️⃣ Update & Deploy

Edit `js/config.js`:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",           // from Firebase
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    // ... rest of config
};
```

Then:
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

**Done!** Your app is live at: `https://YOUR_PROJECT_ID.web.app`

---

## Share with Your Group

Send them this link via WhatsApp, email, etc:
```
https://YOUR_PROJECT_ID.web.app
```

They can:
- Click the link (no app install needed)
- Create an account
- View their balance and transactions
- Works on any device (phone, tablet, laptop)

---

## First User is Admin

1. Open the app
2. Create account → You're now **admin**
3. You can:
   - Add members
   - Create sessions
   - Record attendance
   - Track balances
   - View reports

Members can:
- View their balance
- See transaction history
- Export statements as CSV

---

## How It Works

| What | Where |
|------|-------|
| **Code** | All in this folder (HTML, CSS, JS) |
| **Database** | Firebase Firestore (free tier) |
| **Hosting** | Firebase Hosting (free tier) |
| **Auth** | Firebase Authentication |
| **Cost** | $0/month for small groups |
| **Setup** | No backend or server needed |

---

## Example Flow

**Admin workflow:**

1. Create session: "Nov 31, Split: ₹210, Total: ₹1050"
2. Mark attendance: "Pratik ✓, Avi ✓, Hari ✓, Rohit ✗, Sahil ✓"
3. Click "Apply Charges"
4. Balances automatically update:
   - Pratik: 500 - 210 = **290**
   - Avi: 500 - 210 = **290**
   - Hari: 500 - 210 = **290**
   - Rohit: 500 - 0 = **500** (absent)
   - Sahil: 500 - 210 = **290**

**Member workflow:**

1. Click link from WhatsApp
2. Log in
3. See "Balance: ₹290"
4. See recent transactions
5. Download statement as CSV

---

## Troubleshooting

**"Can't sign up"**  
→ Check Firestore is enabled in Firebase Console

**"Slow loading"**  
→ First load downloads Firebase SDK (~100KB), cached after

**"Error: App is not defined"**  
→ Make sure `js/config.js` is filled with your Firebase credentials

**"Can't apply charges"**  
→ Make sure admin is logged in, check browser console (F12)

---

## What's Included

```
📁 Turf Expense Management/
├── index.html              (Login page)
├── app.html                (Main dashboard)
├── js/
│   ├── config.js          (Firebase config - YOU FILL THIS)
│   ├── auth.js            (Login logic)
│   ├── firebase-service.js (Database operations)
│   └── app.js             (UI & business logic)
├── css/
│   └── styles.css         (Mobile-responsive design)
├── firebase.json          (Hosting config)
├── firestore.rules        (Security rules)
├── firestore.indexes.json (Database indexes)
├── SETUP.md               (Detailed setup guide)
├── README.md              (Full documentation)
└── HANDOFF.md             (Architecture decisions)
```

---

## Next Steps

1. **Deploy** (follow 3 steps above)
2. **Test** (create account, add member, create session)
3. **Share link** with your group
4. **Add members** one by one
5. **Start tracking sessions**

---

## Questions?

- See **SETUP.md** for detailed step-by-step
- See **README.md** for features & data model
- See **HANDOFF.md** for why we chose Firebase

---

## Free & Open Source

This app is MIT licensed. You own the code, your data sits in your Firebase account.

Deploy once, use forever. No monthly hosting bills.
