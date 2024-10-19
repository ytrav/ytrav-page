import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Explicitly load .env.local
import * as cookie from 'cookie';

/* eslint-env node */

// Ensure Firebase Admin SDK is initialized only once
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Firebase private key is missing from environment variables');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey.replace(/\\n/g, '\n'), // Replace escaped newlines with actual newlines
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
  }
}

const db = admin.database();

export default async function handler(req, res) {
  // Basic Auth Credentials
  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;

  // Check if credentials are provided in the request or cookie
  const authHeader = req.headers['authorization'];
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  let credentials;

  if (authHeader) {
    // Parse the Basic Auth credentials
    const base64Credentials = authHeader.split(' ')[1];
    credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  } else if (cookies.credentials) {
    // Use credentials from cookie if available
    credentials = Buffer.from(cookies.credentials, 'base64').toString('ascii');
  } else {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing credentials' });
  }

  const [username, password] = credentials.split(':');

  // Validate credentials
  if (username !== validUsername || password !== validPassword) {
    return res.status(403).json({ success: false, error: 'Forbidden: Invalid credentials' });
  }

  // Set a cookie to keep the user signed in
  res.setHeader('Set-Cookie', cookie.serialize('credentials', Buffer.from(credentials).toString('base64'), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  }));

  // Fetch messages from Firebase if authorized
  try {
    const messagesRef = db.ref('messages');
    const snapshot = await messagesRef.once('value');
    const messages = snapshot.val();

    res.status(200).json({ success: true, messages: messages || [] });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
}