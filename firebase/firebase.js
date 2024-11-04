import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Explicitly load .env.local

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';

/* eslint-env node */

// Initialize Firebase after dotenv is loaded
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// console.log('Environment Variables After dotenv.config():');
// console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY);
// console.log('FIREBASE_DATABASE_URL:', process.env.FIREBASE_DATABASE_URL);
// console.log('Firebase Config:', firebaseConfig); // Check values before initializing Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);

const db = getDatabase(app)

export default db
