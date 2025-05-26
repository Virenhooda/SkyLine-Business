import { db } from './firebaseConfig.js';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const transactionsCol = collection(db, 'transactions');

// Add new transaction
export async function addTransaction(userId, transaction) {
    return addDoc(transactionsCol, {...transaction, userId});
}

// Get transactions for user
export async function getUserTransactions(userId) {
    const q = query(transactionsCol, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    let transactions = [];
    querySnapshot.forEach(doc => {
        transactions.push({id: doc.id, ...doc.data()});
    });
    return transactions;
}

// Delete a transaction
export async function deleteTransaction(id) {
    return deleteDoc(doc(db, 'transactions', id));
}

// Update a transaction
export async function updateTransaction(id, data) {
    return updateDoc(doc(db, 'transactions', id), data);
}