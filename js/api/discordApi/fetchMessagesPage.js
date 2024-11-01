import { handleResponse } from './handleResponse.js';

/**
 * @description Fetches a page of messages from Discord
 * @param {string} channelId - Discord channel ID
 * @param {string} userToken - Discord auth token
 * @param {string} before - Message ID to fetch before
 * @param {string} after - Message ID to fetch after
 * @returns {Promise<Array>} Array of messages
 */
export async function fetchMessagesPage(channelId, userToken, before = null, after = null) {
    try {
        let url = `${this.API_BASE}/channels/${channelId}/messages?limit=100`;
        if (before) url += `&before=${before}`;
        if (after) url += `&after=${after}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            }
        });

        return await handleResponse(response);
    } catch (error) {
        if (error.status === 429) {
            // Handle rate limiting
            await new Promise(resolve => setTimeout(resolve, error.retryAfter * 1000));
            return fetchMessagesPage(channelId, userToken, before, after);
        }
        throw error;
    }
}
