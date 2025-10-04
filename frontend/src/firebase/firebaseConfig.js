// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgxavViNHgPeDJbBpQhK5gqEpWg0qx6WU",
  authDomain: "mathsenseacademy.com",
  projectId: "mathsenseacademy-55f13",
  storageBucket: "mathsenseacademy-55f13.firebasestorage.app",
  messagingSenderId: "381785601078",
  appId: "1:381785601078:web:40f9078f8b377af19f5497",
  measurementId: "G-XG6BB5D4VV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
