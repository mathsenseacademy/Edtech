// backend/functions/index.js

import functions from "firebase-functions";
import app from "./server.js";

export const api = functions.https.onRequest(app);