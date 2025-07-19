import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCJSspJErC2Dy9RzxUBfCCQejQlUPSFKz4",
  authDomain: "cold-emailer-14b72.firebaseapp.com",
  projectId: "cold-emailer-14b72",
  storageBucket: "cold-emailer-14b72.firebasestorage.app",
  messagingSenderId: "877911214355",
  appId: "1:877911214355:web:7484d9b08ab6e2bab5b2e6",
  measurementId: "G-LNWHQMMQ18"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);