import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' }) // Explicitly load .env.local
const { BskyAgent } = require('@atproto/api'); // Ensure you have the correct import

/* eslint-env node */
module.exports.handler = async (event) => {
    const agent = new BskyAgent({
        service: 'https://bsky.social'
    });

    try {
        await agent.login({
            identifier: process.env.BSKY_HANDLE,
            password: process.env.BSKY_PASSWORD
        });

        const accessToken = agent.accessJwt;
        const refreshToken = agent.refreshJwt;

        return {
            statusCode: 200,
            body: JSON.stringify({
                accessToken,
                refreshToken
            })
        };
    } catch (error) {
        console.error('Error logging in:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error logging in',
                error: error.message
            })
        };
    }
};