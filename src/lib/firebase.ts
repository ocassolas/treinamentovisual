import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable offline persistence (IndexedDB)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Múltiplas abas abertas - persistência desabilitada em algumas');
  } else if (err.code === 'unimplemented') {
    console.warn('Navegador não suporta persistência offline');
  }
});

// Diagnostics: log init status (do not expose full config in production)
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn('Firebase API key missing: check .env.local');
} else {
  try {
    // app.name exists when initialized
    // eslint-disable-next-line no-console
    console.info('Firebase initialized:', app.name || '<default>');
  } catch (e) {
    // ignore
  }
}