import { handleResponse } from './handleResponse.js';

/**
 * @description Fetches all channels for a given server (guild)
 * @param {string} guildId - Discord guild ID
 * @param {string} userToken - Discord auth token
 * @returns {Promise<Array>} Array of channels
 */
export async function fetchGuildChannels(guildId, userToken) {
    try {
        const response = await fetch(`${this.API_BASE}/guilds/${guildId}/channels`, {
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            }
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching guild channels:', error);
        throw new Error(`Failed to fetch guild channels: ${error.message}`);
    }
}
