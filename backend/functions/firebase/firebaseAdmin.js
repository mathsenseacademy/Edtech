// functions/firebase/firebaseAdmin.js
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config(); // Load .env for local dev only

// Detect Cloud Functions environment
const isCloudFunctions = typeof process.env.FIREBASE_CONFIG !== "undefined";

// ★ Set your bucket name ONCE here
const DEFAULT_BUCKET = "mathsenseacademy-55f13.appspot.com";

/**
 * Initialize firebase-admin safely in:
 * - Cloud Functions (production)
 * - Local development (.env)
 */
function initAdmin() {
  if (admin.apps.length > 0) return;

  if (isCloudFunctions) {
    // 🔥 Cloud Functions production: uses Google service account automatically
    admin.initializeApp({
      storageBucket: DEFAULT_BUCKET,   // VERY IMPORTANT
    });
    return;
  }

  // Local development
  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
  } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error(
      "Missing Firebase credentials in .env for local dev. You must define FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY."
    );
  }

  const fixedPrivateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: fixedPrivateKey,
    }),
    storageBucket: DEFAULT_BUCKET,   // VERY IMPORTANT
  });
}

initAdmin();

export const db = admin.firestore();
export { admin };

/**
 * Helper for storage bucket (optional)
 */
export function getStorageBucket() {
  return admin.storage().bucket(DEFAULT_BUCKET);
}
