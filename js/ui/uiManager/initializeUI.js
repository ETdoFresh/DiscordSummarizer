import { toggleToPresent } from './toggleToPresent.js';
import { showError } from './showError.js';
import { displayMessages } from './displayMessages.js';
import { updateHistoryList } from './updateHistoryList.js';

/**
 * @description Initializes the UI with default values and event handlers
 */
export async function initializeUI() {
    try {
        console.log('Initializing UI...');
        
        // Set default dates
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        
        const fromDateInput = document.getElementById('fromDate');
        const toDateInput = document.getElementById('toDate');
        
        if (fromDateInput) {
            fromDateInput.value = this.dateUtils.dateToLocalString(oneDayAgo);
        }
        
        if (toDateInput) {
            toDateInput.value = this.dateUtils.dateToLocalString(now);
        }

        // Initialize "to present" checkbox
        const toPresentCheckbox = document.getElementById('toPresent');
        if (toPresentCheckbox) {
            toPresentCheckbox.checked = true;
            toggleToPresent();
        }

        // Load saved credentials from the summarizer
        console.log('Loading saved credentials...');
        const lastCreds = this.summarizer.getLastCredentials();
        console.log('Last credentials loaded:', lastCreds ? 'Yes' : 'No');
        
        if (lastCreds) {
            console.log('Setting credentials in UI...');
            const userTokenInput = document.getElementById('userToken');
            const channelIdInput = document.getElementById('channelId');
            const openrouterTokenInput = document.getElementById('openrouterToken');

            // Set Discord token
            if (userTokenInput && lastCreds.token) {
                console.log('Setting Discord token:', lastCreds.token ? '[Token exists]' : '[No token]');
                userTokenInput.value = lastCreds.token;
            } else {
                console.log('Unable to set Discord token - input or value missing');
            }

            // Set Channel ID
            if (channelIdInput && lastCreds.channelId) {
                console.log('Setting Channel ID:', lastCreds.channelId ? '[ID exists]' : '[No ID]');
                channelIdInput.value = lastCreds.channelId;
            } else {
                console.log('Unable to set Channel ID - input or value missing');
            }

            // Set OpenRouter token
            if (openrouterTokenInput && lastCreds.openrouterToken) {
                console.log('Setting OpenRouter token:', lastCreds.openrouterToken ? '[Token exists]' : '[No token]');
                openrouterTokenInput.value = lastCreds.openrouterToken;
            } else {
                console.log('Unable to set OpenRouter token - input or value missing');
            }
        } else {
            console.log('No saved credentials found');
        }

        // Load and display last search
        const lastSearch = this.summarizer.getLastSearch();
        if (lastSearch) {
            displayMessages(lastSearch);
            updateHistoryList();
        }

        // Populate server dropdown
        await this.populateServerDropdown();

        // Add event listener for server selection change
        const serverSelect = document.getElementById('serverSelect');
        if (serverSelect) {
            serverSelect.addEventListener('change', async (event) => {
                const guildId = event.target.value;
                if (guildId) {
                    await this.populateChannelDropdown(guildId);
                }
            });
        }

        // Add event listener for channel selection change
        const channelSelect = document.getElementById('channelSelect');
        const channelIdInput = document.getElementById('channelId');
        if (channelSelect && channelIdInput) {
            channelSelect.addEventListener('change', (event) => {
                const channelId = event.target.value;
                channelIdInput.value = channelId;
            });
        }

        // Initialize AI prompt from local storage
        const aiPromptInput = document.getElementById('aiPrompt');
        if (aiPromptInput) {
            const savedPrompt = localStorage.getItem('aiPrompt');
            aiPromptInput.value = savedPrompt || '';
            aiPromptInput.addEventListener('input', () => {
                localStorage.setItem('aiPrompt', aiPromptInput.value);
            });
        }

        // Add event listener for reset button
        const resetPromptButton = document.getElementById('resetPromptButton');
        if (resetPromptButton) {
            resetPromptButton.addEventListener('click', () => {
                const defaultPrompt = 'Please summarize the following Discord chat messages in a blog post style with paragraphs and bullet points where appropriate. Focus on the key discussions, decisions, and new information shared. Organize the content logically and highlight important points:'; // Default prompt from openRouterApi
                if (aiPromptInput) {
                    aiPromptInput.value = defaultPrompt;
                    localStorage.setItem('aiPrompt', defaultPrompt);
                }
            });
        }
    } catch (error) {
        console.error('Error initializing UI:', error);
        showError('Failed to initialize the application');
    }
}
