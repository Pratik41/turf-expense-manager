# Setup & Deployment Guide

## Quick Start (5 minutes)

### Step 1: Create a Firebase Project

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click **"Get Started"**
3. Click **"Create a project"**
4. Enter project name: `turf-expense-manager` (or any name)
5. Accept terms and click **"Create project"**
6. Wait for the project to be created

### Step 2: Enable Services

In your Firebase Console:

1. **Enable Firestore Database**:
   - Left sidebar → **Build** → **Firestore Database**
   - Click **"Create database"**
   - Choose **"Start in production mode"**
   - Select location closest to you
   - Click **"Create"**

2. **Enable Authentication**:
   - Left sidebar → **Build** → **Authentication**
   - Click **"Get started"**
   - Click **Email/Password** provider
   - Toggle **"Enable"** and click **"Save"**

3. **Enable Hosting**:
   - Left sidebar → **Build** → **Hosting**
   - Click **"Get started"**

### Step 3: Get Firebase Credentials

1. Go to **Project Settings** (gear icon, top right)
2. Scroll down to **"Your apps"**
3. Click the **Web** icon (`</>`), or add a web app if not present
4. Copy the config object:

```javascript
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT_ID.appspot.com",
  "messagingSenderId": "YOUR_SENDER_ID",
  "appId": "YOUR_APP_ID"
}
```

### Step 4: Update Config

1. Open `js/config.js` in your project
2. Replace the placeholder values with your Firebase config
3. Save the file

### Step 5: Deploy

#### Option A: Using Firebase CLI (Recommended)

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org) (LTS version)
   - Install and verify: `node -v` and `npm -v`

2. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

3. **Login to Firebase**:
   ```bash
   firebase login
   ```
   - A browser window will open
   - Sign in with your Google account
   - Approve permissions

4. **Deploy**:
   ```bash
   firebase deploy
   ```
   - The CLI will auto-detect your project
   - Files will be uploaded to Firebase Hosting
   - You'll see a live URL like: `https://YOUR_PROJECT_ID.web.app`

#### Option B: Manual Deployment (if CLI doesn't work)

1. Go to Firebase Console → **Hosting**
2. Click **"Connect to Git"** (if available in your region)
3. Or manually upload files through the console

### Step 6: Share the Link

Your app is now live! Share the URL with your group:

```
https://YOUR_PROJECT_ID.web.app
```

Members can access it from **any device** by clicking the link, without any setup.

---

## First Time Setup

1. **Open the app** in your browser
2. **Create admin account**:
   - Click **"Create Account"**
   - Enter your name, email, and password
   - You'll automatically be set as **admin**
3. **Change admin password** (important!):
   - The default password is only the one you created
4. **Invite members**:
   - Go to **Members** tab
   - Click **"+ Add Member"**
   - Enter their name and email
   - They can sign up or you can share the link

---

## Setting Security Rules

Your Firestore rules are in `firestore.rules`. They:
- Allow users to read all members and sessions
- Only admins can create/modify members and sessions
- Each user can only see their own ledger entries (admins see all)

To deploy rules:

```bash
firebase deploy --only firestore:rules
```

Or in the Firebase Console:
1. Go to **Firestore** → **Rules**
2. Copy contents of `firestore.rules` into the editor
3. Click **"Publish"**

---

## Setting Firestore Indexes

Complex queries need indexes. In `firestore.indexes.json` we've defined:
- Member ledger by date
- Member ledger by month
- Session attendance lookup
- Session listing by date

To deploy indexes:

```bash
firebase deploy --only firestore:indexes
```

Or in the Firebase Console:
1. Go to **Firestore** → **Indexes**
2. Indexes will auto-create when you first run those queries (you'll get a link to click)

---

## Testing Checklist

### Setup Test
- [ ] App loads without errors
- [ ] Signup and login work
- [ ] First user is admin, second is member

### Member Test
- [ ] Members can view their balance
- [ ] Members can view transactions
- [ ] Members can export CSV

### Admin Test
- [ ] Admin can add members
- [ ] Admin can create sessions
- [ ] Admin can record attendance
- [ ] Admin can apply charges
- [ ] Admin can record adjustments
- [ ] Admin can view monthly reports

### Balance Test
- [ ] Subscription adds credit (+500)
- [ ] Session charge deducts from attended members (-210)
- [ ] Balance carries over to next month
- [ ] Negative balance (pending due) shows
- [ ] Low balance warning appears below 150

---

## Troubleshooting

### "Firebase is not defined"
- Make sure `js/config.js` is loaded before other scripts
- Check that Firebase SDK script tags are in `index.html`

### "PERMISSION_DENIED" errors
- Make sure you're logged in
- Check Firestore rules in Firebase Console
- Rules might not be deployed yet - run `firebase deploy --only firestore:rules`

### Slow loading
- First load might be slow (SDK downloads)
- Subsequent loads are cached
- Check browser's Network tab for large files

### Users can't sign up
- Make sure Email/Password auth is enabled in Firebase Console
- Check auth rules: should allow anyone to create accounts

### Charges don't apply
- Make sure session's "Apply Charges" button was clicked
- Check Firestore > LedgerEntries collection to see if entries were created
- Look at browser console (F12) for JavaScript errors

### Data not syncing
- Firestore takes a few seconds to sync
- Refresh the page to manually sync
- Check browser DevTools > Network > Firestore for errors

---

## Scaling & Limits

Firebase free tier includes:
- **1 GB** storage
- **50,000** reads/day
- **20,000** writes/day
- **Bandwidth**: generous daily quota

For a small group of 5-20 people:
- Monthly subscription: 50 writes (adds)
- Sessions (10/month): 50 writes + 100 reads/month
- Balance tracking: 10 reads per session × 10 = 100 reads
- **Total**: ~250 reads, ~150 writes per month

You're well within the free tier!

If you scale to 100+ members:
- Upgrade to **Blaze** plan (pay-as-you-go)
- Typically $2-5/month for small usage

---

## Backups

Firestore automatically backs up data:
- **Daily** export to Google Cloud Storage (30 days)
- **Manual** export: Firebase Console → **Data** → **Backups**

To manually export:

```bash
gcloud firestore export gs://YOUR_PROJECT_ID.appspot.com/export
```

Or use the console UI (no command needed).

---

## Monitoring

To check your usage:

1. Firebase Console → **Usage**
2. See reads/writes/storage
3. Get alerts if approaching limits (free tier)

---

## Custom Domain (Optional)

Instead of `YOUR_PROJECT_ID.web.app`, you can use your own domain:

1. Buy a domain (Google Domains, Namecheap, etc.)
2. Firebase Console → **Hosting** → **Domain**
3. Click **"Add custom domain"**
4. Follow the steps to verify ownership
5. Your app will be at `https://your-domain.com`

---

## Questions?

- Firebase docs: https://firebase.google.com/docs
- Firestore docs: https://firebase.google.com/docs/firestore
- This project's README: `README.md`
- Architecture decisions: `HANDOFF.md`
