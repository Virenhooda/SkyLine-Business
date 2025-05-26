// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAziLOw5DEFxUaNSEyOic0_FUf4ScLO5Ks",
  authDomain: "skyline-business.firebaseapp.com",
  projectId: "skyline-business",
  storageBucket: "skyline-business.firebasestorage.app",
  messagingSenderId: "915397554137",
  appId: "1:915397554137:web:76316587fd556b72e0f3c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };