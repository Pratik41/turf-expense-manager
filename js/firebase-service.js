// Firestore Service Layer

class FirebaseService {
    // ==================== MEMBERS ====================

    static async addMember(name, email) {
        const docRef = await db.collection('members').add({
            name,
            email,
            currentBalance: 0,
            status: 'active',
            createdAt: new Date()
        });
        return docRef.id;
    }

    static async getMember(memberId) {
        const doc = await db.collection('members').doc(memberId).get();
        return { id: doc.id, ...doc.data() };
    }

    static async getAllMembers() {
        const snapshot = await db.collection('members').where('status', '==', 'active').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async getMemberByEmail(email) {
        const snapshot = await db.collection('members').where('email', '==', email).get();
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }

    static async deactivateMember(memberId) {
        await db.collection('members').doc(memberId).update({ status: 'inactive' });
    }

    // ==================== SESSIONS ====================

    static async createSession(date, splitAmount, totalCost, adminUid) {
        const docRef = await db.collection('sessions').add({
            date,
            splitAmount,
            totalCost: totalCost || null,
            createdAt: new Date(),
            createdBy: adminUid
        });
        return docRef.id;
    }

    static async getSession(sessionId) {
        const doc = await db.collection('sessions').doc(sessionId).get();
        return { id: doc.id, ...doc.data() };
    }

    static async getAllSessions() {
        const snapshot = await db.collection('sessions')
            .orderBy('date', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async getSessionsByMonth(year, month) {
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0);

        const snapshot = await db.collection('sessions')
            .where('date', '>=', startDate)
            .where('date', '<=', endDate.toISOString().split('T')[0])
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // ==================== ATTENDANCE ====================

    static async recordAttendance(sessionId, memberId, status) {
        // Check if already exists
        const existing = await db.collection('attendance')
            .where('sessionId', '==', sessionId)
            .where('memberId', '==', memberId)
            .get();

        if (!existing.empty) {
            // Update existing
            await existing.docs[0].ref.update({ status });
        } else {
            // Create new
            await db.collection('attendance').add({
                sessionId,
                memberId,
                status
            });
        }
    }

    static async getSessionAttendance(sessionId) {
        const snapshot = await db.collection('attendance')
            .where('sessionId', '==', sessionId)
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // ==================== LEDGER ====================

    static async addLedgerEntry(memberId, type, amount, reason, month, adminUid) {
        const docRef = await db.collection('ledgerEntries').add({
            memberId,
            type,  // 'subscription', 'charge', 'adjustment'
            amount,
            reason: reason || '',
            month,  // YYYY-MM
            createdAt: new Date(),
            createdBy: adminUid
        });

        // Update member's current balance
        const member = await this.getMember(memberId);
        const newBalance = (member.currentBalance || 0) + amount;
        await db.collection('members').doc(memberId).update({
            currentBalance: newBalance
        });

        return docRef.id;
    }

    static async getMemberLedger(memberId) {
        const snapshot = await db.collection('ledgerEntries')
            .where('memberId', '==', memberId)
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async getMemberLedgerByMonth(memberId, year, month) {
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        const snapshot = await db.collection('ledgerEntries')
            .where('memberId', '==', memberId)
            .where('month', '==', monthStr)
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async getAllLedgerEntries() {
        const snapshot = await db.collection('ledgerEntries')
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // ==================== BALANCE & REPORTS ====================

    static async getMemberBalance(memberId) {
        const member = await this.getMember(memberId);
        return member.currentBalance || 0;
    }

    static async calculateCurrentMonth() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    static async getMembersLowBalance() {
        const members = await this.getAllMembers();
        return members.filter(m => (m.currentBalance || 0) < APP_CONFIG.MIN_BALANCE_WARNING);
    }

    static async getMonthlyReport(month) {
        const snapshot = await db.collection('ledgerEntries')
            .where('month', '==', month)
            .orderBy('createdAt', 'desc')
            .get();

        const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Group by member
        const report = {};
        for (const entry of entries) {
            if (!report[entry.memberId]) {
                const member = await this.getMember(entry.memberId);
                report[entry.memberId] = {
                    member,
                    entries: [],
                    totalCredit: 0,
                    totalDebit: 0
                };
            }
            report[entry.memberId].entries.push(entry);
            if (entry.amount > 0) {
                report[entry.memberId].totalCredit += entry.amount;
            } else {
                report[entry.memberId].totalDebit += Math.abs(entry.amount);
            }
        }

        return report;
    }
}
