// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- Itha import panrathu mukkiyam

// Namma .env.local file-la irunthu antha ragasiyamaana keys-a inga kondu varom
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, // NOTE: Oru chinna typo-va sari pannirukken
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase-a namma app-oda "pesa" vekkurom
const app = initializeApp(firebaseConfig);

// Ippo namma intha services-a un-comment panni, export panrom
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- Itha export panrathu romba mukkiyam!

export default app;