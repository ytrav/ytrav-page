import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

/* eslint-env node */
// Imports the Google Cloud client library

// Creates a client

export default async function handler(req, res) {
  const translate = new Translate({
    key: process.env.TRANSLATION_API_KEY
  });
  try {
    const { text } = req.body;
    const target = 'en';
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    // console.log('text:', text)
    // console.log('target:', target)
    // console.log('key:', process.env.TRANSLATION_API_KEY)

    res.status(200).json({ success: true, translations });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ success: false, error: 'Failed to translate text' });
  }
}
