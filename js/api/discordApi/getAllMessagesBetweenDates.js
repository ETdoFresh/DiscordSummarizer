import { fetchMessagesPage } from './fetchMessagesPage.js';

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
export async function getAllMessagesBetweenDates(channelId, userToken, fromDate, toDate = null, progressCallback, maxPages = 50) {
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

            const messages = await fetchMessagesPage(channelId, userToken, currentBefore);
            
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
