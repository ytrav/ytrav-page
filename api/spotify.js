/* eslint-env node */
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`
        }
      }
    )

    return response.data.access_token
  } catch (error) {
    console.error(
      'Error getting access token:',
      error.response ? error.response.data : error.message
    )
    throw new Error('Failed to get access token')
  }
}

export default async function handler(req, res) {
  try {
    const market = 'from_token'
    const accessToken = await getAccessToken()

    // Use the access token to fetch currently playing track
    const currentlyPlayingResponse = await axios.get(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          market
        }
      }
    )

    if (currentlyPlayingResponse.status === 200 && currentlyPlayingResponse.data) {
      res.status(200).json(currentlyPlayingResponse.data)
    } else {
      res.status(200).json({ isPlaying: false, message: 'No track is currently playing' })
    }
  } catch (error) {
    console.error(
      'Error fetching Spotify data:',
      error.response ? error.response.data : error.message
    )
    res.status(500).json({ error: 'Failed to fetch currently playing track' })
  }
}
