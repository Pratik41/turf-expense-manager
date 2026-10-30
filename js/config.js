// Firebase Configuration
// Get these values from Firebase Console > Project Settings
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore and Auth references
const db = firebase.firestore();
const auth = firebase.auth();

// Set Firestore settings
db.settings({
    timestampsInSnapshots: true
});

// App Configuration
const APP_CONFIG = {
    MONTHLY_SUBSCRIPTION: 500,  // Default monthly fee in local currency
    MIN_BALANCE_WARNING: 150,   // Balance below this triggers warning
    CURRENCY: '₹',              // Change to your currency symbol
    CURRENCY_CODE: 'INR'        // Change to your currency code
};

console.log('Firebase initialized with project:', firebaseConfig.projectId);
