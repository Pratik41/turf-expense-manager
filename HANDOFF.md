# Handoff: Turf Expense Management

## Requirements

- Internal app for a small group
- Each member pays a monthly subscription
- Each session has a split amount charged to attendees only
- Monthly audit history with pending amount carry-forward
- Minimum balance of 150 shows LOW warning (deductions continue)
- Two roles: admin (manages everything) and member (views own statement)
- Must be reachable from mobile at any time

## Constraints

- No Docker, Kubernetes, or AWS
- Must be free or very cheap
- No server setup required for end users
- Open source (code on GitHub)
- Members access via WhatsApp link

## Architecture Decision: Firebase

**Chosen: Firebase (Firestore + Auth + Hosting)**

### Why Firebase?

1. **Zero Server Management**: No VPS, Docker, or Kubernetes
2. **Free Tier**: Sufficient for small groups (1GB storage, 50k reads/writes/day)
3. **Built-in Auth**: No need for custom login infrastructure
4. **Real-time Database**: Firestore syncs instantly across users
5. **Hosting**: Deploy with one command, live at HTTPS
6. **Scalable**: Grows with the group without code changes
7. **Open Source Friendly**: Code on GitHub, app on Firebase Hosting

### Why NOT Java/Spring Boot?

- Requires server management (VPS/Render/Railway)
- Overkill for a small group
- Adds ongoing costs and maintenance
- Node.js not installed on dev machine

## Data Model

### Collections in Firestore

#### `users`
- `uid` (doc ID): Firebase Auth UID
- `email`: Email address
- `role`: "admin" or "member"
- `name`: Display name
- `createdAt`: Timestamp

#### `members`
- `id` (doc ID): Auto-generated
- `email`: Email address
- `name`: Name
- `currentBalance`: Running balance (credit - debit)
- `createdAt`: Timestamp
- `status`: "active" or "inactive"

#### `sessions`
- `id` (doc ID): Auto-generated
- `date`: Session date (YYYY-MM-DD)
- `splitAmount`: Per-person charge (e.g., 210)
- `totalCost`: Optional (e.g., 1050 for 5 attendees)
- `createdAt`: Timestamp
- `createdBy`: Admin UID

#### `attendance`
- `id` (doc ID): Auto-generated
- `sessionId`: Reference to session
- `memberId`: Reference to member
- `status`: "attended" or "absent"

#### `ledgerEntries` (Append-only)
- `id` (doc ID): Auto-generated
- `memberId`: Reference to member
- `type`: "subscription" (credit) or "charge" (debit) or "adjustment"
- `amount`: Signed number (positive = credit, negative = debit)
- `reason`: Description (required for adjustments)
- `month`: YYYY-MM for grouping
- `createdAt`: Timestamp
- `createdBy`: Admin UID

### Balance Calculation

```
currentBalance = SUM of all ledgerEntries[memberId].amount
```

Example:
- New member: 0
- Subscription added: +500 → balance = 500
- Session attended (split=210): -210 → balance = 290
- Adjustment (owed member refund): +50 → balance = 340

### Carry-Forward

Negative balance (pending due) automatically carries to next month in ledger. No separate "month" logic—the ledger is a running history.

### Low Balance Warning

Shown when `currentBalance < 150`. Deductions still apply.

## Features

### Member View
- ✅ Login (email/password)
- ✅ Dashboard: current balance, low-balance warning
- ✅ Statement: monthly breakdown of transactions
- ✅ CSV export of monthly history

### Admin View
- ✅ Members: add, edit, deactivate
- ✅ Sessions: create, record attendance, edit
- ✅ Adjustments: record refunds or corrections with reason
- ✅ Reports: monthly audit, CSV export
- ✅ User Management: view all users, change roles

## Deployment

1. Create Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore, Authentication (Email/Password), and Hosting
3. Configure Firestore security rules (see `firebase.json`)
4. Update `js/config.js` with Firebase credentials
5. Run `firebase deploy`
6. Share the URL via WhatsApp: `https://<project-id>.web.app`

## Testing Checklist

- [ ] Create admin account (first user)
- [ ] Change admin password
- [ ] Add 2–3 test members
- [ ] Create a session, record attendance
- [ ] Verify balances update correctly
- [ ] Test low-balance warning
- [ ] Record an adjustment
- [ ] Generate monthly report and export CSV
- [ ] Test on mobile browser

## Known Gaps (v1)

- No offline mode (requires internet)
- No email notifications (can add later with Cloud Functions)
- No payment processing (integration needed)
- No automatic backup (Firebase handles this)
- Session cost optional (could be calculated from split)

## Future Enhancements

1. **Cloud Functions**: Email reminders for low balance, monthly digest
2. **Stripe Integration**: Process actual payments
3. **Mobile App**: React Native or Flutter wrapper
4. **Analytics**: Charts for spending trends
5. **WhatsApp Bot**: Direct queries via WhatsApp

## Next Steps

1. Set up Firebase project
2. Build and deploy frontend
3. Run test scenarios (see Testing Checklist)
4. Gather feedback from group members
5. Deploy to production
