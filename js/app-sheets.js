// Turf Expense Manager - Google Sheets Backend
// Interactive, Responsive, Beautiful UI

const CONFIG = {
    MONTHLY_SUBSCRIPTION: 500,
    MIN_BALANCE_WARNING: 150,
    CURRENCY: '₹',
    // Google Sheets API setup
    SHEET_ID: 'YOUR_GOOGLE_SHEET_ID', // Replace with your actual Sheet ID
    API_KEY: 'YOUR_GOOGLE_API_KEY' // Replace with your actual API key
};

class SheetsApp {
    constructor() {
        this.members = [];
        this.sessions = [];
        this.ledger = [];
        this.init();
    }

    async init() {
        // Check if Google Sheets credentials are configured
        if (CONFIG.SHEET_ID === 'YOUR_GOOGLE_SHEET_ID') {
            this.showSetupInstructions();
            return;
        }

        await this.loadData();
        this.setupEventListeners();
        this.updateDashboard();
    }

    showSetupInstructions() {
        document.getElementById('statusText').innerHTML = '⚠️ Setup Required';
        const alert = `
            <div class="alert alert-warning">
                <h3 style="margin-bottom: 10px;">Google Sheets Setup Required</h3>
                <p><strong>Step 1:</strong> Create a Google Sheet with these sheets:</p>
                <ul style="margin: 10px 0 10px 20px;">
                    <li><strong>Members</strong>: Columns: Name, Balance</li>
                    <li><strong>Sessions</strong>: Columns: Date, SplitAmount, AttendedMembers</li>
                    <li><strong>Ledger</strong>: Columns: Date, MemberName, Type, Amount, Reason</li>
                </ul>
                <p><strong>Step 2:</strong> Enable Google Sheets API</p>
                <p><strong>Step 3:</strong> Get your Sheet ID and API Key</p>
                <p><strong>Step 4:</strong> Update CONFIG in app-sheets.js with your credentials</p>
                <p style="margin-top: 10px; color: var(--primary);">📖 <a href="https://developers.google.com/sheets/api" target="_blank" style="color: var(--primary);">Google Sheets API Docs</a></p>
            </div>
        `;
        document.body.innerHTML = document.body.innerHTML.replace('</main>', alert + '</main>');
    }

    async loadData() {
        try {
            document.getElementById('statusText').innerHTML = '🔄 Loading...';

            // Load Members
            this.members = await this.getSheetData('Members');
            // Load Sessions
            this.sessions = await this.getSheetData('Sessions');
            // Load Ledger
            this.ledger = await this.getSheetData('Ledger');

            document.getElementById('statusText').innerHTML = '✅ Connected';
        } catch (error) {
            console.error('Error loading data:', error);
            document.getElementById('statusText').innerHTML = '❌ Connection Error';
        }
    }

    async getSheetData(sheetName) {
        try {
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${sheetName}?key=${CONFIG.API_KEY}`
            );
            const data = await response.json();

            if (!data.values) return [];

            const headers = data.values[0];
            return data.values.slice(1).map(row => {
                const obj = {};
                headers.forEach((header, i) => {
                    obj[header] = row[i] || '';
                });
                return obj;
            });
        } catch (error) {
            console.error(`Error getting sheet data for ${sheetName}:`, error);
            return [];
        }
    }

    async addMember(name) {
        try {
            const newMember = {
                Name: name,
                Balance: '0'
            };
            this.members.push(newMember);
            await this.updateSheet('Members', [newMember]);
            this.updateDashboard();
            return true;
        } catch (error) {
            console.error('Error adding member:', error);
            return false;
        }
    }

    async addSession(date, splitAmount, attendedMembers) {
        try {
            const newSession = {
                Date: date,
                SplitAmount: splitAmount,
                AttendedMembers: attendedMembers.join(',')
            };
            this.sessions.push(newSession);
            await this.updateSheet('Sessions', [newSession]);

            // Add charges to ledger for attended members
            for (const memberName of attendedMembers) {
                await this.addLedgerEntry(memberName, 'charge', -splitAmount, `Session on ${date}`);
            }

            this.updateDashboard();
            return true;
        } catch (error) {
            console.error('Error adding session:', error);
            return false;
        }
    }

    async addSubscription(memberName, amount) {
        try {
            await this.addLedgerEntry(memberName, 'subscription', amount, 'Monthly subscription');
            this.updateDashboard();
            return true;
        } catch (error) {
            console.error('Error adding subscription:', error);
            return false;
        }
    }

    async addLedgerEntry(memberName, type, amount, reason) {
        try {
            const newEntry = {
                Date: new Date().toISOString().split('T')[0],
                MemberName: memberName,
                Type: type,
                Amount: amount,
                Reason: reason
            };
            this.ledger.push(newEntry);
            await this.updateSheet('Ledger', [newEntry]);
            return true;
        } catch (error) {
            console.error('Error adding ledger entry:', error);
            return false;
        }
    }

    async updateSheet(sheetName, data) {
        try {
            const headers = sheetName === 'Members'
                ? ['Name', 'Balance']
                : sheetName === 'Sessions'
                ? ['Date', 'SplitAmount', 'AttendedMembers']
                : ['Date', 'MemberName', 'Type', 'Amount', 'Reason'];

            const values = [headers, ...data.map(item =>
                headers.map(h => item[h] || '')
            )];

            // In a real implementation, you would use Google Sheets API to append/update
            // For now, this is a placeholder
            console.log(`Updated ${sheetName}:`, values);
        } catch (error) {
            console.error('Error updating sheet:', error);
        }
    }

    getMemberBalance(memberName) {
        const entries = this.ledger.filter(l => l.MemberName === memberName);
        return entries.reduce((sum, entry) => sum + parseInt(entry.Amount || 0), 0);
    }

    updateDashboard() {
        // Update stats
        document.getElementById('totalMembers').textContent = this.members.length;
        document.getElementById('totalSessions').textContent = this.sessions.length;

        // Update members overview
        let overviewHTML = '';
        this.members.forEach(member => {
            const balance = this.getMemberBalance(member.Name);
            const status = balance < -CONFIG.MIN_BALANCE_WARNING ? '⚠️ Low' : '✅ Good';
            const balanceClass = balance < 0 ? 'balance-negative' : 'balance-positive';

            overviewHTML += `
                <tr>
                    <td>${member.Name}</td>
                    <td class="${balanceClass}">${CONFIG.CURRENCY}${balance}</td>
                    <td>${status}</td>
                </tr>
            `;
        });

        document.getElementById('overviewBody').innerHTML = overviewHTML || '<tr><td colspan="3" style="text-align: center; color: var(--text-secondary);">No members yet</td></tr>';

        // Update members table
        this.updateMembersTable();
        // Update sessions list
        this.updateSessionsList();
        // Update reports
        this.updateReports();
    }

    updateMembersTable() {
        let html = '';
        this.members.forEach(member => {
            const balance = this.getMemberBalance(member.Name);
            const balanceClass = balance < 0 ? 'balance-negative' : 'balance-positive';

            html += `
                <tr>
                    <td>${member.Name}</td>
                    <td class="${balanceClass}">${CONFIG.CURRENCY}${balance}</td>
                    <td>
                        <button class="btn btn-small btn-primary" onclick="app.showAddSubscription('${member.Name}')">
                            +₹500
                        </button>
                    </td>
                </tr>
            `;
        });

        document.getElementById('membersBody').innerHTML = html || '<tr><td colspan="3" style="text-align: center; color: var(--text-secondary);">No members yet</td></tr>';
    }

    updateSessionsList() {
        let html = '';
        [...this.sessions].reverse().forEach(session => {
            const attendees = session.AttendedMembers.split(',').length;
            html += `
                <div class="card" style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <h3 style="color: var(--primary); margin-bottom: 8px;">${session.Date}</h3>
                            <p style="color: var(--text-secondary);">
                                Split: ${CONFIG.CURRENCY}${session.SplitAmount} |
                                Members: ${attendees}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        });

        document.getElementById('sessionsList').innerHTML = html || '<div class="empty-state"><div class="empty-state-icon">⚽</div><p>No sessions yet</p></div>';
    }

    updateReports() {
        let html = '<table><thead><tr><th>Member</th><th>Total Subscriptions</th><th>Total Charges</th><th>Balance</th></tr></thead><tbody>';

        this.members.forEach(member => {
            const entries = this.ledger.filter(l => l.MemberName === member.Name);
            const subscriptions = entries.filter(e => e.Type === 'subscription').reduce((sum, e) => sum + parseInt(e.Amount || 0), 0);
            const charges = entries.filter(e => e.Type === 'charge').reduce((sum, e) => sum + Math.abs(parseInt(e.Amount || 0)), 0);
            const balance = subscriptions - charges;
            const balanceClass = balance < 0 ? 'balance-negative' : 'balance-positive';

            html += `
                <tr>
                    <td>${member.Name}</td>
                    <td>${CONFIG.CURRENCY}${subscriptions}</td>
                    <td>${CONFIG.CURRENCY}${charges}</td>
                    <td class="${balanceClass}">${CONFIG.CURRENCY}${balance}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        document.getElementById('reportsContent').innerHTML = html;
    }

    showAddSubscription(memberName) {
        document.getElementById('subscriptionMemberId').value = memberName;
        document.getElementById('subscriptionMemberName').value = memberName;
        document.getElementById('addSubscriptionModal').style.display = 'block';
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Modal handlers
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Add Member
        document.getElementById('addMemberBtn').addEventListener('click', () => {
            document.getElementById('addMemberModal').style.display = 'block';
        });

        document.getElementById('addMemberForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('memberName').value;
            await this.addMember(name);
            document.getElementById('addMemberForm').reset();
            document.getElementById('addMemberModal').style.display = 'none';
        });

        // Add Session
        document.getElementById('addSessionBtn').addEventListener('click', () => {
            const checkboxes = this.members.map(m =>
                `<label style="display: block; margin-bottom: 8px;">
                    <input type="checkbox" value="${m.Name}" class="member-checkbox">
                    ${m.Name}
                </label>`
            ).join('');
            document.getElementById('memberCheckboxes').innerHTML = checkboxes;
            document.getElementById('addSessionModal').style.display = 'block';
        });

        document.getElementById('addSessionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const date = document.getElementById('sessionDate').value;
            const splitAmount = parseInt(document.getElementById('splitAmount').value);
            const attended = Array.from(document.querySelectorAll('.member-checkbox:checked')).map(cb => cb.value);

            if (attended.length === 0) {
                alert('Please select at least one member');
                return;
            }

            await this.addSession(date, splitAmount, attended);
            document.getElementById('addSessionForm').reset();
            document.getElementById('addSessionModal').style.display = 'none';
        });

        // Add Subscription
        document.getElementById('addSubscriptionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const memberName = document.getElementById('subscriptionMemberId').value;
            const amount = parseInt(document.getElementById('subscriptionAmount').value);

            await this.addSubscription(memberName, amount);
            document.getElementById('addSubscriptionForm').reset();
            document.getElementById('addSubscriptionModal').style.display = 'none';
        });

        // Export CSV
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportCSV();
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });

        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        document.getElementById(tabName).style.display = 'block';
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    exportCSV() {
        let csv = 'Member,Subscriptions,Charges,Balance\n';

        this.members.forEach(member => {
            const entries = this.ledger.filter(l => l.MemberName === member.Name);
            const subscriptions = entries.filter(e => e.Type === 'subscription').reduce((sum, e) => sum + parseInt(e.Amount || 0), 0);
            const charges = entries.filter(e => e.Type === 'charge').reduce((sum, e) => sum + Math.abs(parseInt(e.Amount || 0)), 0);
            const balance = subscriptions - charges;

            csv += `${member.Name},${subscriptions},${charges},${balance}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `turf-expense-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }
}

// Initialize app
let app = new SheetsApp();
