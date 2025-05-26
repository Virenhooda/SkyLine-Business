import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAziLOw5DEFxUaNSEyOic0_FUf4ScLO5Ks",
  authDomain: "skyline-business.firebaseapp.com",
  projectId: "skyline-business",
  storageBucket: "skyline-business.firebasestorage.app",
  messagingSenderId: "915397554137",
  appId: "1:915397554137:web:76316587fd556b72e0f3c8"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM
const authSection = document.getElementById('auth-section');
const userSection = document.getElementById('user-section');
const userEmailSpan = document.getElementById('user-email');
const transactionsUl = document.getElementById('transactions');

window.signup = async function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert(e.message);
  }
};

window.login = async function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert(e.message);
  }
};

window.logout = async function() {
  await signOut(auth);
};

window.addTransaction = async function() {
  const amount = parseFloat(document.getElementById('amount').value);
  const note = document.getElementById('note').value;
  const date = document.getElementById('date').value;
  const type = document.getElementById('type').value;
  const user = auth.currentUser;
  if (!user) return;
  try {
    await addDoc(collection(db, "transactions"), {
      uid: user.uid,
      amount,
      note,
      date,
      type
    });
    loadTransactions(user.uid);
  } catch (e) {
    alert(e.message);
  }
};

async function loadTransactions(uid) {
  const q = query(collection(db, "transactions"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  transactionsUl.innerHTML = "";
  snapshot.forEach(doc => {
    const t = doc.data();
    const li = document.createElement('li');
    li.textContent = `${t.date} - ${t.type} - ₹${t.amount} (${t.note})`;
    transactionsUl.appendChild(li);
  });
}

onAuthStateChanged(auth, user => {
  if (user) {
    authSection.style.display = 'none';
    userSection.style.display = 'block';
    userEmailSpan.textContent = user.email;
    loadTransactions(user.uid);
  } else {
    authSection.style.display = 'block';
    userSection.style.display = 'none';
  }
});