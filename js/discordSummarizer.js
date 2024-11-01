/**
 * @class DiscordSummarizer
 * @description Main class responsible for managing Discord message summarization functionality
 */
import { DateUtils } from './utils/dateUtils.js';
import { DiscordApi } from './api/discordApi.js';
import { OpenRouterApi } from './api/openRouterApi.js';

export class DiscordSummarizer {
    /**
     * @constructor
     * @param {Object} uiManager - UI Manager instance
     */
    constructor(uiManager) {
        // Initialize with a maximum of 10 searches
        const MAX_SEARCHES = 10;
        this.searches = this.loadSearches();
        this.MAX_PAGES = 50;
        
        // Load credentials from secure storage
        this.lastChannelId = localStorage.getItem('lastChannelId') || '';
        const storedToken = localStorage.getItem('lastToken');
        console.log('Loading token from localStorage:', storedToken ? '[Token exists]' : '[No token found]');
        this.lastToken = this.decodeStoredToken(storedToken) || '';
        console.log('Decoded token:', this.lastToken ? '[Token decoded]' : '[No token or decode failed]');
        this.lastOpenRouterToken = this.decodeStoredToken(localStorage.getItem('lastOpenRouterToken')) || '';
        
        // Initialize utility classes
        this.dateUtils = new DateUtils();
        this.discordApi = new DiscordApi();
        this.openRouterApi = new OpenRouterApi();
        this.uiManager = uiManager;
    }

    /**
     * @private
     * @description Loads and validates stored searches
     * @returns {Array} Array of valid searches
     */
    loadSearches() {
        try {
            const stored = JSON.parse(localStorage.getItem('searches') || '[]');
            return Array.isArray(stored) ? stored.slice(0, 10) : [];
        } catch (error) {
            console.error('Error loading searches:', error);
            return [];
        }
    }

    /**
     * @private
     * @description Encodes sensitive tokens for storage
     * @param {string} token - Token to encode
     * @returns {string} Encoded token
     */
    encodeStoredToken(token) {
        if (!token) {
            console.log('No token provided for encoding');
            return '';
        }
        console.log('Encoding token for storage');
        return btoa(token);
    }

    /**
     * @private
     * @description Decodes stored tokens
     * @param {string} encoded - Encoded token
     * @returns {string} Decoded token
     */
    decodeStoredToken(encoded) {
        try {
            if (!encoded) {
                console.log('No encoded token provided for decoding');
                return '';
            }
            console.log('Attempting to decode token');
            const decoded = atob(encoded);
            console.log('Token decoded successfully');
            return decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
            return '';
        }
    }

    /**
     * @description Saves user credentials securely
     * @param {string} channelId - Discord channel ID
     * @param {string} token - Discord auth token
     * @param {string} openrouterToken - OpenRouter API token
     */
    saveCredentials(channelId, token, openrouterToken) {
        console.log('Saving credentials...');
        console.log('Channel ID:', channelId ? '[ID provided]' : '[No ID]');
        console.log('Discord token:', token ? '[Token provided]' : '[No token]');
        
        this.lastChannelId = channelId;
        this.lastToken = token;
        this.lastOpenRouterToken = openrouterToken;
        
        localStorage.setItem('lastChannelId', channelId);
        const encodedToken = this.encodeStoredToken(token);
        console.log('Saving encoded token to localStorage:', encodedToken ? '[Token encoded]' : '[No token to encode]');
        localStorage.setItem('lastToken', encodedToken);
        localStorage.setItem('lastOpenRouterToken', this.encodeStoredToken(openrouterToken));
        
        console.log('Credentials saved to localStorage');
    }

    /**
     * @description Retrieves stored credentials
     * @returns {Object} Object containing stored credentials
     */
    getLastCredentials() {
        console.log('Getting last credentials...');
        console.log('Last token exists:', this.lastToken ? 'Yes' : 'No');
        return {
            channelId: this.lastChannelId,
            token: this.lastToken,
            openrouterToken: this.lastOpenRouterToken
        };
    }

    /**
     * @description Formats and summarizes Discord messages
     * @param {Array} messages - Array of Discord messages
     * @param {string} channelId - Discord channel ID
     * @param {Object} channelInfo - Channel information
     * @param {string} openrouterToken - OpenRouter API token
     * @param {Function} progressCallback - Progress update callback
     * @returns {Promise<Object>} Formatted and summarized messages
     */
    async formatMessages(messages, channelId, channelInfo, openrouterToken, progressCallback) {
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
    async fetchAndFormat(channelId, userToken, openrouterToken, fromDate, toDate = null, progressCallback) {
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

    /**
     * @description Retrieves search history
     * @returns {Array} Array of previous searches
     */
    getSearches() {
        return this.searches;
    }

    /**
     * @description Retrieves most recent search
     * @returns {Object|null} Most recent search or null
     */
    getLastSearch() {
        return this.searches[0] || null;
    }
}
