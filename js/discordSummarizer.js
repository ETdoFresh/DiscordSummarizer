/**
 * @class DiscordSummarizer
 * @description Main class responsible for managing Discord message summarization functionality
 */
import { DateUtils } from './utils/dateUtils.js';
import { DiscordApi } from './api/discordApi.js';
import { OpenRouterApi } from './api/openRouterApi.js';
import { loadSearches } from './discordSummarizer/loadSearches.js';
import { encodeStoredToken } from './discordSummarizer/encodeStoredToken.js';
import { decodeStoredToken } from './discordSummarizer/decodeStoredToken.js';
import { saveCredentials } from './discordSummarizer/saveCredentials.js';
import { getLastCredentials } from './discordSummarizer/getLastCredentials.js';
import { formatMessages } from './discordSummarizer/formatMessages.js';
import { fetchAndFormat } from './discordSummarizer/fetchAndFormat.js';
import { getSearches } from './discordSummarizer/getSearches.js';
import { getLastSearch } from './discordSummarizer/getLastSearch.js';
import { removeSearch } from './discordSummarizer/removeSearch.js';

export class DiscordSummarizer {
    /**
     * @constructor
     * @param {Object} uiManager - UI Manager instance
     */
    constructor(uiManager) {
        // Initialize with a maximum of 10 searches
        const MAX_SEARCHES = 10;
        this.searches = loadSearches();
        this.MAX_PAGES = 50;
        
        // Load credentials from secure storage
        this.lastChannelId = localStorage.getItem('lastChannelId') || '';
        const storedToken = localStorage.getItem('lastToken');
        console.log('Loading token from localStorage:', storedToken ? '[Token exists]' : '[No token found]');
        this.lastToken = decodeStoredToken(storedToken) || '';
        console.log('Decoded token:', this.lastToken ? '[Token decoded]' : '[No token or decode failed]');
        this.lastOpenRouterToken = decodeStoredToken(localStorage.getItem('lastOpenRouterToken')) || '';
        
        // Initialize utility classes
        this.dateUtils = new DateUtils();
        this.discordApi = new DiscordApi();
        this.openRouterApi = new OpenRouterApi();
        this.uiManager = uiManager;

        // Bind all methods to this instance
        this.loadSearches = loadSearches.bind(this);
        this.encodeStoredToken = encodeStoredToken.bind(this);
        this.decodeStoredToken = decodeStoredToken.bind(this);
        this.saveCredentials = saveCredentials.bind(this);
        this.getLastCredentials = getLastCredentials.bind(this);
        this.formatMessages = formatMessages.bind(this);
        this.fetchAndFormat = fetchAndFormat.bind(this);
        this.getSearches = getSearches.bind(this);
        this.getLastSearch = getLastSearch.bind(this);
        this.removeSearch = removeSearch.bind(this);
    }
}
