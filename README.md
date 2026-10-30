# Turf Expense Management

A free, open-source app for managing group expenses and subscriptions. Members access via a simple web link—no code setup needed.

## Features

- 💰 **Monthly Subscriptions**: Each member pays a monthly fee (default 500)
- 📊 **Session Tracking**: Record attendance and split amounts per session
- 📉 **Balance Management**: Automatic deductions for attendance, pending dues carry forward
- ⚠️ **Low Balance Warning**: Alert when balance drops below 150
- 📋 **Audit History**: Append-only ledger with monthly reports
- 📱 **Mobile Ready**: Works on any device via browser link
- 🔐 **Role-Based Access**: Admin and member roles

## Stack

- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript (no build tools)
- **Backend**: Firebase (Firestore + Authentication + Hosting)
- **Database**: Firestore (free tier)
- **Hosting**: Firebase Hosting (free tier)

## Setup for Developers

### Prerequisites
- Node.js 18+ (for Firebase CLI only)
- A Firebase project (create at [firebase.google.com](https://firebase.google.com))

### Local Development

1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd turf-expense-management
   ```

2. Install Firebase CLI (one-time):
   ```bash
   npm install -g firebase-tools
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase login
   firebase init
   ```
   - Choose: Firestore, Authentication, Hosting
   - Set public directory to `.` (root)

4. Update `js/config.js` with your Firebase credentials (from Firebase Console > Project Settings)

5. Start local dev server:
   ```bash
   firebase serve
   ```
   - Open http://localhost:5000

### Deployment

```bash
firebase deploy
```

Your app will be live at `https://<project-id>.web.app`

## Usage

1. **First Admin Setup**:
   - Sign up with email/password
   - Admin account is created automatically for the first user
   - Change admin password immediately

2. **Add Members**:
   - Go to Members > Add New
   - Members can sign up or be invited

3. **Create Sessions**:
   - Go to Sessions > New Session
   - Record attendees and split amount
   - Balance updates automatically

4. **Monthly Audit**:
   - Go to Reports > Monthly Statement
   - View audit history, download CSV

## Data Model

### Users
- `uid`: Firebase Auth UID
- `email`: Email address
- `role`: "admin" or "member"
- `name`: Display name

### Members
- `id`: Auto-generated
- `email`: Email address
- `name`: Name
- `balance`: Running balance (credit - debit)
- `createdAt`: Timestamp

### Sessions
- `id`: Auto-generated
- `date`: Session date
- `splitAmount`: Per-person charge
- `totalCost`: Optional, for reference
- `createdAt`: Timestamp

### Attendance
- `id`: Auto-generated
- `sessionId`: Reference to session
- `memberId`: Reference to member
- `status`: "attended" or "absent"

### LedgerEntries (Append-only)
- `id`: Auto-generated
- `memberId`: Reference to member
- `type`: "subscription", "charge", "adjustment"
- `amount`: Debit (negative) or credit (positive)
- `reason`: Description
- `month`: YYYY-MM for grouping
- `createdAt`: Timestamp
- `createdBy`: Admin user email

## Open Source

This project is MIT licensed. Contribute via pull requests!

## Questions?

See [HANDOFF.md](HANDOFF.md) for technical decisions and architecture.
