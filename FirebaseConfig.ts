import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHelY5gxId0L41MwwQ-5rr7hAELZCmkm0",
  authDomain: "ugram-test-81daa.firebaseapp.com",
  projectId: "ugram-test-81daa",
  storageBucket: "ugram-test-81daa.appspot.com",
  messagingSenderId: "20840995979",
  appId: "1:20840995979:web:f2a4703ec074ea4de7c88e",
  measurementId: "G-CJ0H8LQ6JZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const FIREBASE_AUTH = getAuth(app);
export const storage = getStorage(app);
