import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB8UWHNuFCV-fv6mMJMRv8NKJPesOYivLA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "treinamentovisual1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "treinamentovisual1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "treinamentovisual1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "727368034062",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:727368034062:web:cb719f4c620f9cca41595f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);