// Authentication Service

async function getCurrentUser() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const userDoc = await db.collection('users').doc(user.uid).get();
                resolve({
                    uid: user.uid,
                    email: user.email,
                    ...userDoc.data()
                });
            } else {
                resolve(null);
            }
        });
    });
}

async function logout() {
    await firebase.auth().signOut();
    window.location.href = 'index.html';
}

function redirectIfNotLoggedIn() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'index.html';
        }
    });
}

async function isAdmin() {
    const user = await getCurrentUser();
    return user && user.role === 'admin';
}

async function ensureAdminAccess() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
        alert('Admin access required');
        window.location.href = 'app.html';
    }
}
