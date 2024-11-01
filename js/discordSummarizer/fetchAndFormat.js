/**
 * @description Fetches and formats Discord messages
 * @param {string} channelId - Discord channel ID
 * @param {string} userToken - Discord auth token
 * @param {string} openrouterToken - OpenRouter API token
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @param {Function} progressCallback - Progress update callback
 * @returns {Promise<Object>} Processed message data
 */
export async function fetchAndFormat(channelId, userToken, openrouterToken, fromDate, toDate = null, progressCallback) {
    try {
        // Validate inputs
        if (!channelId || !userToken || !openrouterToken || !fromDate) {
            throw new Error('Missing required parameters');
        }

        console.log('Saving credentials before fetch...');
        this.saveCredentials(channelId, userToken, openrouterToken);

        progressCallback('Fetching channel information...');
        const channelInfo = await this.discordApi.fetchChannelInfo(channelId, userToken);

        const messages = await this.discordApi.getAllMessagesBetweenDates(
            channelId, 
            userToken, 
            fromDate, 
            toDate,
            progressCallback,
            this.MAX_PAGES
        );
        
        const result = await this.formatMessages(messages, channelId, channelInfo, openrouterToken, progressCallback);

        // Update search history
        this.searches.unshift(result);
        if (this.searches.length > 10) this.searches.pop();
        
        try {
            localStorage.setItem('searches', JSON.stringify(this.searches));
        } catch (error) {
            console.error('Error saving searches:', error);
            // Continue execution even if storage fails
        }

        return result;
    } catch (error) {
        console.error('Error in fetchAndFormat:', error);
        throw new Error(`Failed to process messages: ${error.message}`);
    }
}
