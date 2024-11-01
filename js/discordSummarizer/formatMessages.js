/**
 * @description Formats and summarizes Discord messages
 * @param {Array} messages - Array of Discord messages
 * @param {string} channelId - Discord channel ID
 * @param {Object} channelInfo - Channel information
 * @param {string} openrouterToken - OpenRouter API token
 * @param {Function} progressCallback - Progress update callback
 * @returns {Promise<Object>} Formatted and summarized messages
 */
export async function formatMessages(messages, channelId, channelInfo, openrouterToken, progressCallback) {
    if (!messages || !Array.isArray(messages)) {
        throw new Error('Invalid messages array provided');
    }

    progressCallback(`Found ${messages.length} unique messages. Starting summarization...`);
    const summaryResult = await this.openRouterApi.summarizeMessages(messages, openrouterToken, progressCallback);

    return {
        channelId,
        channelName: channelInfo.channelName,
        serverName: channelInfo.serverName,
        messages,
        fromDate: messages.length > 0 ? messages[0].timestamp : null,
        toDate: messages.length > 0 ? messages[messages.length - 1].timestamp : null,
        timestamp: new Date().toISOString(),
        messageCount: messages.length,
        timezone: this.dateUtils.timezone,
        summary: summaryResult.summary,
        usage: summaryResult.usage
    };
}
