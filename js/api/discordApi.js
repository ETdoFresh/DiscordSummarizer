/**
 * @class DiscordApi
 * @description Handles interactions with the Discord API for fetching messages and channel information
 */
import { DateUtils } from '../utils/dateUtils.js';

export class DiscordApi {
    constructor() {
        this.API_BASE = 'https://discord.com/api/v9';
        this.dateUtils = new DateUtils();
        this.RATE_LIMIT_DELAY = 500; // 500ms between requests
    }

    /**
     * @private
     * @description Handles rate limiting and common error scenarios
     * @param {Response} response - Fetch response object
     * @returns {Promise<Object>} Parsed JSON response
     * @throws {Error} API error details
     */
    async handleResponse(response) {
        if (response.ok) {
            return await response.json();
        }

        let errorMessage = `HTTP error! status: ${response.status}`;
        
        switch (response.status) {
            case 401:
                errorMessage = 'Invalid Discord token. Please check your credentials.';
                break;
            case 403:
                errorMessage = 'Access denied. Please ensure you have permission to view this channel.';
                break;
            case 429:
                const retryAfter = response.headers.get('Retry-After');
                throw { 
                    status: 429, 
                    retryAfter: parseInt(retryAfter) || 5,
                    message: 'Rate limited by Discord API'
                };
            case 404:
                errorMessage = 'Channel not found. Please check the channel ID.';
                break;
        }

        throw new Error(errorMessage);
    }

    /**
     * @description Fetches channel and server information
     * @param {string} channelId - Discord channel ID
     * @param {string} userToken - Discord auth token
     * @returns {Promise<Object>} Channel and server information
     */
    async fetchChannelInfo(channelId, userToken) {
        try {
            const channelResponse = await fetch(`${this.API_BASE}/channels/${channelId}`, {
                headers: {
                    'Authorization': userToken,
                    'Content-Type': 'application/json'
                }
            });

            const channelInfo = await this.handleResponse(channelResponse);
            
            // Only fetch guild info if channel belongs to a server
            if (channelInfo.guild_id) {
                await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY));
                
                const guildResponse = await fetch(`${this.API_BASE}/guilds/${channelInfo.guild_id}`, {
                    headers: {
                        'Authorization': userToken,
                        'Content-Type': 'application/json'
                    }
                });

                const guildInfo = await this.handleResponse(guildResponse);

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

    /**
     * @description Fetches a page of messages from Discord
     * @param {string} channelId - Discord channel ID
     * @param {string} userToken - Discord auth token
     * @param {string} before - Message ID to fetch before
     * @param {string} after - Message ID to fetch after
     * @returns {Promise<Array>} Array of messages
     */
    async fetchMessagesPage(channelId, userToken, before = null, after = null) {
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

            return await this.handleResponse(response);
        } catch (error) {
            if (error.status === 429) {
                // Handle rate limiting
                await new Promise(resolve => setTimeout(resolve, error.retryAfter * 1000));
                return this.fetchMessagesPage(channelId, userToken, before, after);
            }
            throw error;
        }
    }

    /**
     * @description Fetches all messages between two dates
     * @param {string} channelId - Discord channel ID
     * @param {string} userToken - Discord auth token
     * @param {Date} fromDate - Start date
     * @param {Date} toDate - End date
     * @param {Function} progressCallback - Progress update callback
     * @param {number} maxPages - Maximum number of pages to fetch
     * @returns {Promise<Array>} Array of messages
     */
    async getAllMessagesBetweenDates(channelId, userToken, fromDate, toDate = null, progressCallback, maxPages = 50) {
        try {
            const effectiveToDate = toDate || new Date();
            
            console.log('Fetching messages:', {
                fromDate: fromDate.toISOString(),
                toDate: effectiveToDate.toISOString()
            });

            const beforeSnowflake = this.dateUtils.dateToDiscordSnowflake(effectiveToDate);
            const allMessages = new Map();
            let currentBefore = beforeSnowflake;
            let pageCount = 0;
            let hasMore = true;
            let hitOldMessage = false;

            while (hasMore && pageCount < maxPages && !hitOldMessage) {
                progressCallback?.(`Fetching page ${pageCount + 1}...`);
                
                // Add delay between requests to respect rate limits
                if (pageCount > 0) {
                    await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY));
                }

                const messages = await this.fetchMessagesPage(channelId, userToken, currentBefore);
                
                if (!messages.length) {
                    hasMore = false;
                    continue;
                }

                for (const msg of messages) {
                    const msgTime = new Date(msg.timestamp).getTime();
                    
                    if (msgTime < fromDate.getTime()) {
                        hitOldMessage = true;
                        break;
                    }

                    if (msgTime >= fromDate.getTime() && msgTime <= effectiveToDate.getTime()) {
                        allMessages.set(msg.id, msg);
                    }
                }
                
                if (!hitOldMessage && messages.length === 100) {
                    currentBefore = messages[messages.length - 1].id;
                    pageCount++;
                } else {
                    hasMore = false;
                }
            }

            const uniqueMessages = Array.from(allMessages.values())
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            console.log('Fetch complete:', {
                totalMessages: uniqueMessages.length,
                pagesSearched: pageCount + 1,
                stoppedEarly: hitOldMessage
            });

            progressCallback?.(`Found ${uniqueMessages.length} unique messages`);
            return uniqueMessages;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw new Error(`Failed to fetch messages: ${error.message}`);
        }
    }
}
