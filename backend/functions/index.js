// backend/functions/index.js

import functions from "firebase-functions";
import { admin } from "./firebase/firebaseAdmin.js";
import app from "./server.js";

admin.initializeApp();

export const api = functions.https.onRequest(app);
