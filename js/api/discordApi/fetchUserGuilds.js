import { handleResponse } from './handleResponse.js';

/**
 * @description Fetches all servers (guilds) for the user
 * @param {string} userToken - Discord auth token
 * @returns {Promise<Array>} Array of guilds
 */
export async function fetchUserGuilds(userToken) {
    try {
        const response = await fetch(`${this.API_BASE}/users/@me/guilds`, {
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            }
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching user guilds:', error);
        throw new Error(`Failed to fetch user guilds: ${error.message}`);
    }
}
