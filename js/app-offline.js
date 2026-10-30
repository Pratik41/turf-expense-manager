// Offline Turf Expense Manager - Using LocalStorage
// No Firebase needed, works on any network!

const CONFIG = {
    MONTHLY_SUBSCRIPTION: 500,
    MIN_BALANCE_WARNING: 150,
    CURRENCY: '₹'
};

// ==================== DATA MANAGEMENT ====================

class DataStore {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        if (!localStorage.getItem('members')) {
            localStorage.setItem('members', JSON.stringify([]));
        }
        if (!localStorage.getItem('sessions', JSON.stringify([]))) {
            localStorage.setItem('sessions', JSON.stringify([]));
        }
        if (!localStorage.getItem('ledger')) {
            localStorage.setItem('ledger', JSON.stringify([]));
        }
    }

    // Members
    getMembers() {
        return JSON.parse(localStorage.getItem('members') || '[]');
    }

    addMember(name) {
        const members = this.getMembers();
        const member = {
            id: Date.now().toString(),
            name,
            balance: 0,
            createdAt: new Date().toISOString()
        };
        members.push(member);
        localStorage.setItem('members', JSON.stringify(members));
        return member;
    }

    getMember(id) {
        return this.getMembers().find(m => m.id === id);
    }

    deleteMember(id) {
        const members = this.getMembers().filter(m => m.id !== id);
        localStorage.setItem('members', JSON.stringify(members));
    }

    // Sessions
    getSessions() {
        return JSON.parse(localStorage.getItem('sessions') || '[]');
    }

    addSession(date, splitAmount, attendedMembers) {
        const sessions = this.getSessions();
        const session = {
            id: Date.now().toString(),
            date,
            splitAmount,
            attendedMembers,
            createdAt: new Date().toISOString()
        };
        sessions.push(session);
        localStorage.setItem('sessions', JSON.stringify(sessions));

        // Add charges to ledger
        for (const memberId of attendedMembers) {
            this.addLedgerEntry(memberId, 'charge', -splitAmount, `Session on ${date}`);
        }

        return session;
    }

    // Ledger
    getLedger() {
        return JSON.parse(localStorage.getItem('ledger') || '[]');
    }

    addLedgerEntry(memberId, type, amount, reason) {
        const ledger = this.getLedger();
        ledger.push({
            id: Date.now().toString(),
            memberId,
            type,
            amount,
            reason,
            date: new Date().toISOString()
        });
        localStorage.setItem('ledger', JSON.stringify(ledger));

        // Update member balance
        const members = this.getMembers();
        const member = members.find(m => m.id === memberId);
        if (member) {
            member.balance = (member.balance || 0) + amount;
            localStorage.setItem('members', JSON.stringify(members));
        }
    }

    addSubscription(memberId) {
        this.addLedgerEntry(memberId, 'subscription', CONFIG.MONTHLY_SUBSCRIPTION, 'Monthly subscription');
    }

    getMemberBalance(memberId) {
        const member = this.getMember(memberId);
        return member ? member.balance : 0;
    }

    getMemberLedger(memberId) {
        return this.getLedger().filter(l => l.memberId === memberId);
    }

    deleteAllData() {
        localStorage.clear();
        this.initializeData();
    }
}

const db = new DataStore();

// ==================== UI MANAGEMENT ====================

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    if (tabName === 'dashboard') loadDashboard();
    else if (tabName === 'members') loadMembers();
    else if (tabName === 'sessions') loadSessions();
    else if (tabName === 'reports') loadReports();
}

function loadDashboard() {
    const members = db.getMembers();
    const sessions = db.getSessions();

    document.getElementById('totalMembers').textContent = members.length;
    document.getElementById('totalSessions').textContent = sessions.length;

    let html = '';
    members.forEach(member => {
        const balanceClass = member.balance < 0 ? 'negative' : 'positive';
        html += `
            <div class="transaction ${balanceClass}">
                <div class="transaction-info">
                    <p class="type">${member.name}</p>
                </div>
                <div class="transaction-amount">
                    <p class="amount">${CONFIG.CURRENCY}${member.balance}</p>
                </div>
            </div>
        `;
    });

    document.getElementById('membersOverview').innerHTML = html || '<p class="empty-state">No members yet</p>';
}

function loadMembers() {
    const members = db.getMembers();
    let html = '';

    members.forEach(member => {
        const balanceClass = member.balance < 0 ? 'negative' : 'positive';
        html += `
            <tr>
                <td>${member.name}</td>
                <td class="${balanceClass}">${CONFIG.CURRENCY}${member.balance}</td>
                <td>Active</td>
                <td>
                    <button class="btn btn-small" onclick="addSubscription('${member.id}')">+₹500</button>
                    <button class="btn btn-small" onclick="deleteMember('${member.id}')" style="background:#ef4444;">Delete</button>
                </td>
            </tr>
        `;
    });

    document.getElementById('membersBody').innerHTML = html || '<tr><td colspan="4" class="empty-state">No members yet</td></tr>';
}

function loadSessions() {
    const sessions = db.getSessions();
    let html = '';

    sessions.slice().reverse().forEach(session => {
        html += `
            <div class="session-card">
                <div class="session-header">
                    <div>
                        <h3>${session.date}</h3>
                        <p>Split: ${CONFIG.CURRENCY}${session.splitAmount} | Members: ${session.attendedMembers.length}</p>
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById('sessionsList').innerHTML = html || '<p class="empty-state">No sessions yet</p>';
}

function loadReports() {
    const members = db.getMembers();
    let html = '<table><thead><tr><th>Member</th><th>Total Subscriptions</th><th>Total Charges</th><th>Balance</th></tr></thead><tbody>';

    members.forEach(member => {
        const ledger = db.getMemberLedger(member.id);
        const subscriptions = ledger.filter(l => l.type === 'subscription').reduce((sum, l) => sum + l.amount, 0);
        const charges = ledger.filter(l => l.type === 'charge').reduce((sum, l) => sum + Math.abs(l.amount), 0);

        html += `
            <tr>
                <td>${member.name}</td>
                <td>${CONFIG.CURRENCY}${subscriptions}</td>
                <td>${CONFIG.CURRENCY}${charges}</td>
                <td class="${member.balance < 0 ? 'negative' : 'positive'}">${CONFIG.CURRENCY}${member.balance}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    document.getElementById('reportContent').innerHTML = html;
}

function addSubscription(memberId) {
    db.addSubscription(memberId);
    loadMembers();
    loadDashboard();
}

function deleteMember(memberId) {
    if (confirm('Are you sure? This cannot be undone.')) {
        db.deleteMember(memberId);
        loadMembers();
        loadDashboard();
    }
}

function exportCSV() {
    const members = db.getMembers();
    let csv = 'Name,Balance,Status\n';

    members.forEach(member => {
        csv += `${member.name},${member.balance},Active\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `turf-expense-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });

    // Modal handlers
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Add Member
    document.getElementById('addMemberBtn').addEventListener('click', () => {
        document.getElementById('addMemberModal').style.display = 'block';
    });

    document.getElementById('addMemberForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('memberName').value;
        db.addMember(name);
        document.getElementById('addMemberForm').reset();
        document.getElementById('addMemberModal').style.display = 'none';
        loadMembers();
        loadDashboard();
    });

    // Add Session
    document.getElementById('addSessionBtn').addEventListener('click', () => {
        const members = db.getMembers();
        let html = '';
        members.forEach(member => {
            html += `<label><input type="checkbox" value="${member.id}" class="member-checkbox"> ${member.name}</label><br>`;
        });
        document.getElementById('memberCheckboxes').innerHTML = html;
        document.getElementById('addSessionModal').style.display = 'block';
    });

    document.getElementById('addSessionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('sessionDate').value;
        const splitAmount = parseInt(document.getElementById('splitAmount').value);
        const attended = Array.from(document.querySelectorAll('.member-checkbox:checked')).map(cb => cb.value);

        if (attended.length === 0) {
            alert('Please select at least one member');
            return;
        }

        db.addSession(date, splitAmount, attended);
        document.getElementById('addSessionForm').reset();
        document.getElementById('addSessionModal').style.display = 'none';
        loadSessions();
        loadDashboard();
    });

    // Export
    document.getElementById('exportBtn').addEventListener('click', exportCSV);

    // Reset
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Delete ALL data? This cannot be undone!')) {
            db.deleteAllData();
            loadDashboard();
            loadMembers();
            loadSessions();
        }
    });

    // Initial load
    loadDashboard();
});
