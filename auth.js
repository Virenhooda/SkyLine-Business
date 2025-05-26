import { auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Signup user
export async function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

// Login user
export async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

// Logout user
export async function logout() {
    return signOut(auth);
}