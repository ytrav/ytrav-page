import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' }) // Explicitly load .env.local
import axios from 'axios'

let tokenCache = null
let tokenExpiry = null

/* eslint-env node */
const fetchBskyToken = async (handle, password) => {
  const response = await axios.post('https://bsky.social/xrpc/com.atproto.server.createSession', {
    identifier: handle,
    password: password
  })

  const { accessJwt, expiresIn } = response.data

  tokenCache = accessJwt
  tokenExpiry = Date.now() + expiresIn * 1000 // Calculate expiry time (expiresIn is usually in seconds)

  return accessJwt
}

export default async function handler(req, res) {
  try {
    let handle = process.env.BSKY_HANDLE
    let password = process.env.BSKY_PASSWORD

    // Check if cached token exists and is still valid
    if (tokenCache && tokenExpiry && Date.now() < tokenExpiry) {
      // console.log('Using cached token...')
    } else {
      // console.log('Fetching new Bsky token...')
      tokenCache = await fetchBskyToken(handle, password)
    }

    // Fetch the recent posts using the cached token
    const postsResponse = await axios.get('https://bsky.social/xrpc/some-post-endpoint', {
      headers: { Authorization: `Bearer ${tokenCache}` }
    })

    // Return the posts to the frontend
    return res.status(200).json(postsResponse.data)
  } catch (error) {
    console.error('Error fetching Bsky token or posts:', error)
    return res.status(500).json({ success: false, error: 'Failed to fetch posts or token' })
  }
}
