/**
 * @class UiManager
 * @description Manages the user interface and interactions for the Discord summarizer
 */
import { DateUtils } from '../utils/dateUtils.js';
import { DiscordApi } from '../api/discordApi.js';
import { toggleToPresent } from './uiManager/toggleToPresent.js';
import { updateProgress } from './uiManager/updateProgress.js';
import { displayMessages } from './uiManager/displayMessages.js';
import { updateHistoryList } from './uiManager/updateHistoryList.js';
import { showError } from './uiManager/showError.js';
import { hideError } from './uiManager/hideError.js';
import { initializeUI } from './uiManager/initializeUI.js';
import { populateServerDropdown } from './uiManager/populateServerDropdown.js';
import { populateChannelDropdown } from './uiManager/populateChannelDropdown.js';

export class UiManager {
    constructor(summarizer) {
        console.log('Initializing UiManager');
        this.summarizer = summarizer;
        this.dateUtils = new DateUtils();
        this.discordApi = new DiscordApi();
        
        // Configure marked options for security and rendering
        marked.setOptions({
            headerIds: false,
            breaks: true,
            gfm: true,
            sanitize: false, // Disabled because we're using DOMPurify
            smartLists: true,
            smartypants: true
        });

        // Bind all methods to this instance
        this.toggleToPresent = toggleToPresent.bind(this);
        this.updateProgress = updateProgress.bind(this);
        this.displayMessages = displayMessages.bind(this);
        this.updateHistoryList = updateHistoryList.bind(this);
        this.showError = showError.bind(this);
        this.hideError = hideError.bind(this);
        this.initializeUI = initializeUI.bind(this);
        this.populateServerDropdown = populateServerDropdown.bind(this);
        this.populateChannelDropdown = populateChannelDropdown.bind(this);

        // Initialize UI after binding methods
        this.initializeUI();
    }
}
