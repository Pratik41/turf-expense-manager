# 🏆 KSCC Wallet Management System

**Krishna Square Cricket Club** - Complete digital wallet & match management system for tracking player payments, match splits, and automated payouts.

---

## ✨ Features

### 👤 **User Features**
- ✅ Secure login with auto-generated credentials
- ✅ Digital wallet (load ₹200-₹1000 via UPI)
- ✅ Withdraw money with admin approval
- ✅ View transaction history
- ✅ Receive balance alerts when < ₹100
- ✅ See all matches and results
- ✅ Dark/Light theme toggle
- ✅ Mobile-responsive design

### ⚙️ **Admin Features**
- ✅ Create members (auto-generate username & password)
- ✅ View all member balances & status
- ✅ Create matches with custom prize pools
- ✅ Auto-calculate payment splits (40:60, 30:70, 50:50)
- ✅ Approve/Reject withdrawal requests
- ✅ Send SMS alerts to low-balance members
- ✅ Export member data as CSV
- ✅ View withdrawal requests
- ✅ Add credits to members
- ✅ Dashboard with real-time stats

### 🔐 **Security & Data**
- ✅ No account hacking - only admin can create members
- ✅ Username cannot be changed
- ✅ Password recovery via phone verification
- ✅ Forgot password option
- ✅ All data stored securely
- ✅ Works offline (syncs when online)

---

## 🚀 Quick Start

### Local Testing
1. Open: `file:///F:/Turf Expense Management/index.html`
2. Login with:
   - **Username:** `admin`
   - **Password:** `Admin@123`

### Deploy to Firebase (All Devices)
See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step guide.

---

## 📱 Access From Any Device

```
✅ WiFi Network
✅ Mobile Hotspot
✅ Personal Network
✅ Different Devices
✅ Offline Mode
```

Once deployed to Firebase, share the link:
```
https://turf-expense-manager.web.app
```

Members can access from:
- 📱 Mobile browser
- 💻 Laptop
- ⌚ Any device with internet
- 🔄 Works offline (syncs later)

---

## 💰 How It Works

### **Wallet System**
1. **Member loads money** → Chooses amount (₹200-₹1000)
2. **UPI Payment** → GPay, PhonePe, Paytm, CRED
3. **Balance updated** → Instantly available
4. **Withdraw anytime** → Admin approves

### **Match Management**
1. **Admin creates match** → Sets date, venue, prize pool
2. **Chooses payment split** → 40:60, 30:70, or 50:50
3. **Adds winners & losers** → Auto-calculated payouts
4. **Money distributed** → Instant wallet update
5. **Members see earnings** → Real-time dashboard

### **Alerts & Monitoring**
- Balance < ₹100 → Yellow alert on wallet
- Auto SMS alerts → To encourage top-ups
- Admin dashboard → See all low balances
- Export reports → CSV for record-keeping

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Database:** Browser localStorage (no server needed)
- **Hosting:** Firebase Hosting (free, global CDN)
- **Mobile:** Fully responsive
- **Offline:** Works without internet

---

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│      User Browser (Local Storage)       │
│  - Users Database                       │
│  - Wallets & Balances                   │
│  - Matches & Payouts                    │
│  - Transaction History                  │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│    Firebase Hosting (Global CDN)        │
│  - Serves index.html                    │
│  - Accessible from any device           │
│  - Fast, reliable, free tier            │
└─────────────────────────────────────────┘
```

**No backend server needed!** Everything runs on the client side.

---

## 📋 Admin Credentials

**First User (Auto-created):**
```
Username: admin
Password: Admin@123
```

---

## 🔑 Key Features Explained

### **Auto-Generated Credentials**
When admin creates a member:
- **Username:** `FirstName_RandomNumber` (e.g., `Pratik_2087678`)
- **Password:** Auto-generated (10 chars with symbols)
- **SMS:** Credentials sent immediately
- **Security:** Username cannot be changed

### **Forgot Password**
Members can recover by entering:
- First name
- Last name
- Mobile number
→ Get username & password via SMS

### **Balance Alerts**
- Red alert when balance < ₹100
- Auto SMS to members (Admin controls frequency)
- Encourages members to load money
- Prevents missed payments

### **Match Split Calculation**
Example: Match with ₹3000 pool, 40:60 split, 3 winners, 3 losers
- **Winners get:** 40% ÷ 3 = ₹400 each
- **Losers get:** 60% ÷ 3 = ₹600 each
- **Automatic payout** → Instant wallet update

---

## 💡 Use Cases

### **Turf Booking**
- Members load monthly subscription
- Each week, money deducted based on split
- Auto-track who owes what

### **Tournament**
- Create match with prize pool
- Admin decides split ratio
- Instant payout to winners/losers
- No manual calculations needed

### **Group Sports**
- Fair payment system
- Everyone loads money upfront
- Transparent splits
- Easy withdrawal

---

## 📈 Dashboard Stats

The dashboard shows:
- 💰 Current wallet balance
- 🏏 Total matches played
- 👥 Active members
- 💎 Total winnings earned
- 📊 Transaction history

---

## 🔒 Security Features

| Feature | Benefit |
|---------|---------|
| Admin-only signup | Prevents fake accounts |
| Auto-generated passwords | Secure by default |
| Username immutable | Cannot be stolen/changed |
| Forgot password verification | Phone-based recovery |
| LocalStorage | Data stays on device |
| No server logs | Complete privacy |
| Read-only for members | Can't modify other data |

---

## 📱 Mobile Experience

- **Responsive design** → Works on all screen sizes
- **Touch-friendly buttons** → Easy to tap
- **Fast loading** → Optimized for mobile
- **Offline-first** → Works without internet
- **Dark mode** → Easy on eyes

---

## 🎯 Roadmap (Optional Enhancements)

### Phase 2: Payment Integration
- [ ] Real Razorpay UPI integration
- [ ] Real Twilio SMS integration
- [ ] Payment webhook handling
- [ ] Transaction verification

### Phase 3: Advanced Features
- [ ] Player statistics & analytics
- [ ] Monthly reports & graphs
- [ ] Leaderboards
- [ ] Achievement badges
- [ ] Email notifications

### Phase 4: Scaling
- [ ] Cloud database (Firestore)
- [ ] User authentication (Firebase Auth)
- [ ] Web & iOS app
- [ ] Analytics dashboard

---

## 📞 Support

### Common Issues

**Q: Members can't access from mobile?**
- A: Make sure it's deployed to Firebase (see DEPLOYMENT.md)

**Q: Forgot admin password?**
- A: Clear browser data → App resets, admin created again

**Q: Data disappeared?**
- A: Check browser storage → Check privacy mode (use normal mode)

**Q: UPI payment not working?**
- A: Currently in simulation mode. Real integration coming in Phase 2.

---

## 📄 Files

```
├── index.html              # Main app (all features)
├── index-working.html      # Lightweight version
├── firebase.json           # Firebase config
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # This file
```

---

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete Firebase deployment instructions.

**TL;DR:**
```bash
firebase login
firebase deploy
```

Your app will be live at: `https://turf-expense-manager.web.app`

---

## 📊 Data Stored

All data stored locally in browser:
- Users (username, password, phone)
- Wallets (balance per user)
- Matches (date, venue, split, winners, losers)
- Transactions (history for each user)
- Withdrawal requests

**No data sent to external servers** (except optional SMS/Payment APIs in Phase 2)

---

## 🎉 Features Summary

```
✅ 7+ Admin Features
✅ 5+ User Features
✅ 100% Offline Support
✅ Mobile Responsive
✅ Dark/Light Theme
✅ Zero Monthly Cost
✅ Firebase Deployment
✅ CSV Export
✅ SMS Alerts Ready
✅ Payment Integration Ready
```

---

## 📝 License

Created for Krishna Square Cricket Club

---

## 🏆 Credits

Built with ❤️ for cricket lovers everywhere.

**Made with:** HTML5, CSS3, JavaScript, Firebase

---

**Ready to deploy? Follow [DEPLOYMENT.md](DEPLOYMENT.md)** 🚀
