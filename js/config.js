// Firebase Configuration
// Get these values from Firebase Console > Project Settings
const firebaseConfig = {
    apiKey: "AIzaSyBODBYo-88SdtEgA6ArBh1AgIWITn7lnXI",
    authDomain: "turf-expense-manager.firebaseapp.com",
    projectId: "turf-expense-manager",
    storageBucket: "turf-expense-manager.firebasestorage.app",
    messagingSenderId: "435808297972",
    appId: "1:435808297972:web:d507a6bc40efebec658fa1"
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
