import { handleResponse } from './handleResponse.js';

/**
 * @description Fetches channel and server information
 * @param {string} channelId - Discord channel ID
 * @param {string} userToken - Discord auth token
 * @returns {Promise<Object>} Channel and server information
 */
export async function fetchChannelInfo(channelId, userToken) {
    try {
        const channelResponse = await fetch(`${this.API_BASE}/channels/${channelId}`, {
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            }
        });

        const channelInfo = await handleResponse(channelResponse);
        
        // Only fetch guild info if channel belongs to a server
        if (channelInfo.guild_id) {
            await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY));
            
            const guildResponse = await fetch(`${this.API_BASE}/guilds/${channelInfo.guild_id}`, {
                headers: {
                    'Authorization': userToken,
                    'Content-Type': 'application/json'
                }
            });

            const guildInfo = await handleResponse(guildResponse);

            return {
                channelName: channelInfo.name,
                serverName: guildInfo.name
            };
        }

        return {
            channelName: channelInfo.name || 'Direct Message',
            serverName: 'Private'
        };
    } catch (error) {
        console.warn('Error fetching channel info:', error);
        return {
            channelName: 'Unknown Channel',
            serverName: 'Unknown Server'
        };
    }
}
