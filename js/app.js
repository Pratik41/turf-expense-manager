// Main Application Logic

let currentUser = null;
let currentMemberId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    redirectIfNotLoggedIn();

    await initializeApp();
    setupEventListeners();
    setupModalHandlers();
    loadDashboard();
});

async function initializeApp() {
    currentUser = await getCurrentUser();

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('userName').textContent = currentUser.name || currentUser.email;

    // Get current member
    const member = await FirebaseService.getMemberByEmail(currentUser.email);
    if (member) {
        currentMemberId = member.id;
    }

    // Hide admin tabs for non-admins
    if (currentUser.role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Set monthly fee display
    document.getElementById('monthlyFee').textContent = `${APP_CONFIG.CURRENCY}${APP_CONFIG.MONTHLY_SUBSCRIPTION}`;

    // Load months for dropdowns
    await populateMonthSelectors();
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchTab(tabName);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Admin actions
    if (currentUser.role === 'admin') {
        document.getElementById('addMemberBtn').addEventListener('click', () => {
            document.getElementById('addMemberModal').style.display = 'block';
        });

        document.getElementById('addSessionBtn').addEventListener('click', () => {
            document.getElementById('addSessionModal').style.display = 'block';
        });

        // Forms
        document.getElementById('addMemberForm').addEventListener('submit', handleAddMember);
        document.getElementById('addSessionForm').addEventListener('submit', handleAddSession);
    }

    // Statement month selector
    document.getElementById('statementMonth').addEventListener('change', loadStatement);

    // Report month selector
    document.getElementById('reportMonth').addEventListener('change', loadMonthlyReport);

    // Export CSV
    document.getElementById('exportBtn').addEventListener('click', exportStatementToCSV);
}

function setupModalHandlers() {
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function(e) {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// ==================== TAB MANAGEMENT ====================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Load tab content
    switch(tabName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'statement':
            // Month selector already set
            break;
        case 'members':
            loadMembers();
            break;
        case 'sessions':
            loadSessions();
            break;
    }
}

// ==================== DASHBOARD ====================

async function loadDashboard() {
    if (!currentMemberId) {
        document.getElementById('balanceAmount').textContent = `${APP_CONFIG.CURRENCY}0`;
        return;
    }

    const balance = await FirebaseService.getMemberBalance(currentMemberId);
    const balanceEl = document.getElementById('balanceAmount');
    balanceEl.textContent = `${APP_CONFIG.CURRENCY}${balance}`;

    // Show warning if low balance
    const warningEl = document.getElementById('balanceWarning');
    if (balance < APP_CONFIG.MIN_BALANCE_WARNING) {
        warningEl.classList.remove('hidden');
    } else {
        warningEl.classList.add('hidden');
    }

    // Load recent transactions
    const ledger = await FirebaseService.getMemberLedger(currentMemberId);
    const recentList = document.getElementById('recentList');
    recentList.innerHTML = '';

    if (ledger.length === 0) {
        recentList.innerHTML = '<p class="empty-state">No transactions yet</p>';
    } else {
        ledger.slice(0, 5).forEach(entry => {
            const date = entry.createdAt.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt);
            const sign = entry.amount > 0 ? '+' : '';
            const className = entry.amount > 0 ? 'credit' : 'debit';

            recentList.innerHTML += `
                <div class="transaction ${className}">
                    <div class="transaction-info">
                        <p class="type">${entry.type.toUpperCase()}</p>
                        ${entry.reason ? `<p class="reason">${entry.reason}</p>` : ''}
                    </div>
                    <div class="transaction-amount">
                        <p class="amount">${sign}${APP_CONFIG.CURRENCY}${Math.abs(entry.amount)}</p>
                        <p class="date">${date.toLocaleDateString()}</p>
                    </div>
                </div>
            `;
        });
    }
}

// ==================== MEMBERS ====================

async function loadMembers() {
    const members = await FirebaseService.getAllMembers();
    const tbody = document.getElementById('membersBody');
    tbody.innerHTML = '';

    members.forEach(member => {
        const balanceClass = member.currentBalance < 0 ? 'negative' : 'positive';
        tbody.innerHTML += `
            <tr>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td class="${balanceClass}">${APP_CONFIG.CURRENCY}${member.currentBalance || 0}</td>
                <td>${member.status || 'active'}</td>
                <td>
                    <button class="btn btn-small" onclick="openAdjustmentForm('${member.id}')">Adjust</button>
                </td>
            </tr>
        `;
    });
}

async function handleAddMember(e) {
    e.preventDefault();
    const name = document.getElementById('memberName').value;
    const email = document.getElementById('memberEmail').value;

    try {
        await FirebaseService.addMember(name, email);
        alert('Member added successfully!');
        document.getElementById('addMemberForm').reset();
        document.getElementById('addMemberModal').style.display = 'none';
        loadMembers();
    } catch (error) {
        document.getElementById('memberError').textContent = error.message;
    }
}

async function openAdjustmentForm(memberId) {
    const member = await FirebaseService.getMember(memberId);
    const reason = prompt(`Adjust balance for ${member.name}:\nEnter reason (e.g., "Refund" or "Extra charge"):`);

    if (!reason) return;

    const amount = prompt('Enter amount (negative for debit, positive for credit):');
    if (!amount) return;

    try {
        const month = await FirebaseService.calculateCurrentMonth();
        await FirebaseService.addLedgerEntry(
            memberId,
            'adjustment',
            parseInt(amount),
            reason,
            month,
            currentUser.uid
        );
        alert('Adjustment recorded!');
        loadMembers();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ==================== SESSIONS ====================

async function loadSessions() {
    const sessions = await FirebaseService.getAllSessions();
    const sessionsList = document.getElementById('sessionsList');
    sessionsList.innerHTML = '';

    if (sessions.length === 0) {
        sessionsList.innerHTML = '<p class="empty-state">No sessions yet</p>';
        return;
    }

    for (const session of sessions) {
        const attendance = await FirebaseService.getSessionAttendance(session.id);
        const attendeeCount = attendance.filter(a => a.status === 'attended').length;

        sessionsList.innerHTML += `
            <div class="session-card">
                <div class="session-header">
                    <div>
                        <h3>${session.date}</h3>
                        <p>Split: ${APP_CONFIG.CURRENCY}${session.splitAmount}</p>
                    </div>
                    <button class="btn btn-primary" onclick="openSessionDetails('${session.id}')">
                        Manage (${attendeeCount} attended)
                    </button>
                </div>
            </div>
        `;
    }
}

async function handleAddSession(e) {
    e.preventDefault();
    const date = document.getElementById('sessionDate').value;
    const splitAmount = parseInt(document.getElementById('splitAmount').value);
    const totalCost = document.getElementById('totalCost').value;

    try {
        const sessionId = await FirebaseService.createSession(
            date,
            splitAmount,
            totalCost || null,
            currentUser.uid
        );
        alert('Session created!');
        document.getElementById('addSessionForm').reset();
        document.getElementById('addSessionModal').style.display = 'none';
        loadSessions();
    } catch (error) {
        document.getElementById('sessionError').textContent = error.message;
    }
}

async function openSessionDetails(sessionId) {
    const session = await FirebaseService.getSession(sessionId);
    const members = await FirebaseService.getAllMembers();
    const attendance = await FirebaseService.getSessionAttendance(sessionId);

    const modal = document.getElementById('sessionDetailsModal');
    const content = document.getElementById('sessionDetailsContent');

    document.getElementById('sessionDetailsTitle').textContent = `Session ${session.date}`;

    let html = `
        <div class="session-details">
            <p><strong>Split Amount:</strong> ${APP_CONFIG.CURRENCY}${session.splitAmount}</p>
            ${session.totalCost ? `<p><strong>Total Cost:</strong> ${APP_CONFIG.CURRENCY}${session.totalCost}</p>` : ''}
            <h4>Attendance</h4>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
    `;

    for (const member of members) {
        const att = attendance.find(a => a.memberId === member.id);
        const status = att ? att.status : 'absent';

        html += `
            <tr>
                <td>${member.name}</td>
                <td>${status}</td>
                <td>
                    <button class="btn btn-small" onclick="toggleAttendance('${sessionId}', '${member.id}', this)">
                        Mark ${status === 'attended' ? 'Absent' : 'Attended'}
                    </button>
                </td>
            </tr>
        `;
    }

    html += `
                </tbody>
            </table>
            <button class="btn btn-success" style="margin-top: 20px;" onclick="applySessionCharges('${sessionId}')">
                Apply Charges
            </button>
        </div>
    `;

    content.innerHTML = html;
    modal.style.display = 'block';
}

async function toggleAttendance(sessionId, memberId, button) {
    const current = button.textContent.includes('Absent') ? 'attended' : 'absent';
    const newStatus = current === 'attended' ? 'absent' : 'attended';

    await FirebaseService.recordAttendance(sessionId, memberId, newStatus);
    button.textContent = `Mark ${newStatus === 'attended' ? 'Absent' : 'Attended'}`;
}

async function applySessionCharges(sessionId) {
    const session = await FirebaseService.getSession(sessionId);
    const attendance = await FirebaseService.getSessionAttendance(sessionId);
    const month = await FirebaseService.calculateCurrentMonth();

    for (const att of attendance) {
        if (att.status === 'attended') {
            await FirebaseService.addLedgerEntry(
                att.memberId,
                'charge',
                -session.splitAmount,
                `Session charge (${session.date})`,
                month,
                currentUser.uid
            );
        }
    }

    alert('Charges applied!');
    document.getElementById('sessionDetailsModal').style.display = 'none';
    loadSessions();
}

// ==================== STATEMENT ====================

async function loadStatement() {
    const monthValue = document.getElementById('statementMonth').value;
    if (!monthValue) {
        document.getElementById('statementContent').innerHTML = '<p>Select a month to view details</p>';
        document.getElementById('exportBtn').style.display = 'none';
        return;
    }

    const [year, month] = monthValue.split('-');
    const ledger = await FirebaseService.getMemberLedgerByMonth(currentMemberId, parseInt(year), parseInt(month));

    const content = document.getElementById('statementContent');
    if (ledger.length === 0) {
        content.innerHTML = '<p class="empty-state">No transactions in this month</p>';
        document.getElementById('exportBtn').style.display = 'none';
        return;
    }

    let html = '<table><thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Reason</th></tr></thead><tbody>';
    let totalCredit = 0, totalDebit = 0;

    for (const entry of ledger) {
        const date = entry.createdAt.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt);
        const sign = entry.amount > 0 ? '+' : '';

        if (entry.amount > 0) {
            totalCredit += entry.amount;
        } else {
            totalDebit += Math.abs(entry.amount);
        }

        html += `
            <tr>
                <td>${date.toLocaleDateString()}</td>
                <td>${entry.type}</td>
                <td>${sign}${APP_CONFIG.CURRENCY}${Math.abs(entry.amount)}</td>
                <td>${entry.reason || '-'}</td>
            </tr>
        `;
    }

    html += `</tbody></table>
        <div class="statement-summary">
            <p><strong>Total Credit:</strong> ${APP_CONFIG.CURRENCY}${totalCredit}</p>
            <p><strong>Total Debit:</strong> ${APP_CONFIG.CURRENCY}${totalDebit}</p>
            <p><strong>Net Balance:</strong> ${APP_CONFIG.CURRENCY}${totalCredit - totalDebit}</p>
        </div>
    `;

    content.innerHTML = html;
    document.getElementById('exportBtn').style.display = 'inline-block';
}

async function exportStatementToCSV() {
    const monthValue = document.getElementById('statementMonth').value;
    if (!monthValue) return;

    const [year, month] = monthValue.split('-');
    const ledger = await FirebaseService.getMemberLedgerByMonth(currentMemberId, parseInt(year), parseInt(month));

    let csv = 'Date,Type,Amount,Reason\n';
    for (const entry of ledger) {
        const date = entry.createdAt.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt);
        csv += `${date.toLocaleDateString()},${entry.type},${entry.amount},"${entry.reason || ''}"\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statement-${monthValue}.csv`;
    a.click();
}

// ==================== REPORTS ====================

async function loadMonthlyReport() {
    const monthValue = document.getElementById('reportMonth').value;
    if (!monthValue) {
        document.getElementById('reportContent').innerHTML = '<p>Select a month to view report</p>';
        return;
    }

    const [year, month] = monthValue.split('-');
    const report = await FirebaseService.getMonthlyReport(monthValue);

    let html = '<div class="report-table">';
    html += '<table><thead><tr><th>Member</th><th>Total Credit</th><th>Total Debit</th><th>Net</th></tr></thead><tbody>';

    for (const memberId in report) {
        const { member, totalCredit, totalDebit } = report[memberId];
        const net = totalCredit - totalDebit;

        html += `
            <tr>
                <td>${member.name}</td>
                <td>${APP_CONFIG.CURRENCY}${totalCredit}</td>
                <td>${APP_CONFIG.CURRENCY}${totalDebit}</td>
                <td class="${net > 0 ? 'positive' : 'negative'}">${APP_CONFIG.CURRENCY}${net}</td>
            </tr>
        `;
    }

    html += '</tbody></table></div>';
    document.getElementById('reportContent').innerHTML = html;
}

// ==================== UTILITIES ====================

async function populateMonthSelectors() {
    const now = new Date();
    const months = document.querySelectorAll('#statementMonth, #reportMonth');

    // Generate last 12 months
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

        months.forEach(select => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            select.appendChild(option);
        });
    }
}
