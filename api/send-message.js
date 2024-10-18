import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Explicitly load .env.local
/* eslint-env node */
// Ensure Firebase Admin SDK is initialized only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.database();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      const messagesRef = db.ref('messages');
      await messagesRef.push({
        message: message,
        timestamp: Date.now(),
      });

      res.status(200).json({ success: true, message: 'Message stored successfully' });
    } catch (error) {
      console.error('Error writing message:', error);
      res.status(500).json({ success: false, error: 'Failed to store message' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
