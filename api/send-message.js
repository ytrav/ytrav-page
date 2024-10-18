import db from '../firebase/firebase.js'
import { ref, push } from 'firebase/database'
import dotenv from 'dotenv'

/* eslint-env node */
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Received a POST request') // Debug log

    const { message } = req.body
    console.log('Message received:', message) // Debug log for message

    try {
      if (!message) {
        console.log('Message is empty or undefined')
        return res.status(400).json({ success: false, error: 'Message is required' })
      }

      console.log('Attempting to push message to Firebase')
      const messagesRef = ref(db, 'messages')
      await push(messagesRef, { message, timestamp: Date.now() })

      console.log('Message stored successfully')
      res.status(200).json({ success: true, message: 'Message stored successfully' })
    } catch (error) {
      console.error('Error storing message:', error) // Log the error for better debugging
      res.status(500).json({ success: false, error: 'Failed to store message' })
    }
  } else {
    console.log('Request method not allowed')
    res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}
