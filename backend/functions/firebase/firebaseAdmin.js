// backend/firebase/firebaseAdmin.js
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

function initAdmin() {
  if (admin.apps.length > 0) return;

  // detect GCP environment (Cloud Run, Cloud Functions): K_SERVICE exists on Cloud Run
  const isGoogleEnv = !!(process.env.K_SERVICE || process.env.FIREBASE_CONFIG);

  if (isGoogleEnv) {
    
    admin.initializeApp();
    return;
  }

  // Local dev: require env vars for service account
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error("Missing Firebase credentials in .env for local development.");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

initAdmin();

export const db = admin.firestore();
export const auth = admin.auth(); 
export { admin };
