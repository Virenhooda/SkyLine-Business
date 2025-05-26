import { auth } from './firebaseConfig.js';
import { signup, login, logout } from './auth.js';
import { addTransaction, getUserTransactions, deleteTransaction, updateTransaction } from './db.js';

let currentUser = null;

// Helper to render login/signup form
function renderAuthForm() {
    document.getElementById('app').innerHTML = `
    <h2>SkyLine Business Login</h2>
    <div>
        <input type="email" id="email" placeholder="Email" required />
        <input type="password" id="password" placeholder="Password" required />
    </div>
    <button id="login-btn">Login</button>
    <button id="signup-btn">Signup</button>
    <div id="auth-msg" style="color:red;margin-top:10px;"></div>
    `;

    document.getElementById('login-btn').onclick = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            await login(email, password);
        } catch (e) {
            document.getElementById('auth-msg').innerText = e.message;
        }
    };

    document.getElementById('signup-btn').onclick = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            await signup(email, password);
        } catch (e) {
            document.getElementById('auth-msg').innerText = e.message;
        }
    };
}

// Helper to render transaction dashboard
async function renderDashboard() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
    <h2>Welcome to SkyLine Business</h2>
    <button id="logout-btn">Logout</button>
    <h3>Add Transaction</h3>
    <div>
        <input type="number" id="amount" placeholder="Amount" required />
        <select id="type">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
        </select>
        <input type="text" id="note" placeholder="Note" />
        <input type="date" id="date" />
        <button id="add-transaction-btn">Add</button>
    </div>
    <h3>Transactions</h3>
    <ul id="transactions-list"></ul>
    `;

    document.getElementById('logout-btn').onclick = async () => {
        await logout();
    };

    document.getElementById('add-transaction-btn').onclick = async () => {
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const note = document.getElementById('note').value;
        const date = document.getElementById('date').value;
        if (!amount || !date) {
            alert('Amount and Date are required');
            return;
        }
        try {
            await addTransaction(currentUser.uid, { amount, type, note, date });
            await loadTransactions();
        } catch (e) {
            alert('Error adding transaction: ' + e.message);
        }
    };

    async function loadTransactions() {
        const list = document.getElementById('transactions-list');
        list.innerHTML = 'Loading...';
        const transactions = await getUserTransactions(currentUser.uid);
        if (transactions.length === 0) {
            list.innerHTML = '<li>No transactions found</li>';
            return;
        }
        list.innerHTML = '';
        transactions.forEach(t => {
            const li = document.createElement('li');
            li.textContent = `${t.date} - ${t.type.toUpperCase()} - ₹${t.amount} - ${t.note || ''}`;
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.style.marginLeft = '10px';
            delBtn.onclick = async () => {
                await deleteTransaction(t.id);
                await loadTransactions();
            };
            li.appendChild(delBtn);
            list.appendChild(li);
        });
    }
    await loadTransactions();
}

// Listen to auth state changes
import { onAuthStateChanged } from 'firebase/auth';

export function initApp() {
    renderAuthForm();

    onAuthStateChanged(auth, user => {
        currentUser = user;
        if (user) {
            renderDashboard();
        } else {
            renderAuthForm();
        }
    });
}