// backend/functions/index.js

import { onRequest } from "firebase-functions/v2/https";
import app from "./server.js";

// ✅ Firebase Functions v2 - Properly handle multipart requests
export const api = onRequest(
  {
    memory: "1GiB",
    timeoutSeconds: 540,
    maxInstances: 10,
    // Don't automatically parse body - let Express handle it
    consumeAppCheckToken: false,
  },
  (req, res) => {
    // For multipart requests, collect the raw body buffer
    if (req.method === 'POST' && req.headers['content-type']?.includes('multipart/form-data')) {
      const chunks = [];
      
      req.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      req.on('end', () => {
        // Attach rawBody for Busboy
        req.rawBody = Buffer.concat(chunks);
        console.log('rawBody attached, size:', req.rawBody.length, 'bytes');
        
        // Now pass to Express
        app(req, res);
      });
      
      req.on('error', (err) => {
        console.error('Request stream error:', err);
        res.status(400).json({ error: 'Failed to process request' });
      });
    } else {
      // Non-multipart requests go directly to Express
      app(req, res);
    }
  }
);