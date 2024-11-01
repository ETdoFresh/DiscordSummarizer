/**
 * @class UiManager
 * @description Manages the user interface and interactions for the Discord summarizer
 */
import { DateUtils } from '../utils/dateUtils.js';
import { DiscordApi } from '../api/discordApi.js';

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

        this.initializeUI();
    }

    /**
     * @description Toggles visibility of the "to date" input based on "to present" checkbox
     */
    toggleToPresent() {
        const toPresentInput = document.getElementById('toPresent');
        const toDateContainer = document.getElementById('toDateContainer');
        const toDateInput = document.getElementById('toDate');
        
        if (toDateContainer && toDateInput) {
            const isToPresent = toPresentInput?.checked ?? false;
            toDateContainer.style.display = isToPresent ? 'none' : 'block';
            toDateContainer.setAttribute('aria-hidden', isToPresent.toString());
            toDateInput.required = !isToPresent;
            toDateInput.setAttribute('aria-required', (!isToPresent).toString());
        }
    }

    /**
     * @description Updates the progress message display
     * @param {string} message - Progress message to display
     */
    updateProgress(message) {
        const progressElement = document.getElementById('progress');
        if (progressElement) {
            progressElement.textContent = message;
            progressElement.style.display = 'block';
            console.log('Progress:', message);
        }
    }

    /**
     * @description Displays the message summary and related information
     * @param {Object} result - Summary result object
     */
    displayMessages(result) {
        if (!result) return;

        try {
            const elements = {
                container: document.getElementById('messagesContainer'),
                messagesText: document.getElementById('messagesText'),
                dateRange: document.getElementById('dateRange'),
                usageInfo: document.getElementById('usageInfo')
            };

            if (elements.messagesText) {
                const content = result.summary || result.text || 'No content available';
                const markedContent = marked.parse(content);
                elements.messagesText.innerHTML = DOMPurify.sanitize(markedContent, {
                    USE_PROFILES: { html: true },
                    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a'],
                    ALLOWED_ATTR: ['href', 'target', 'rel']
                });
            }
            
            if (elements.dateRange && result.fromDate) {
                const fromDate = this.dateUtils.formatDate(result.fromDate);
                const toDate = result.toDate ? this.dateUtils.formatDate(result.toDate) : 'present';
                elements.dateRange.textContent = `Messages from ${fromDate} to ${toDate}`;
            }
            
            if (elements.usageInfo && result.usage) {
                const usageHtml = `
                    <h3>Usage Statistics</h3>
                    <ul>
                        <li>Total Tokens: ${result.usage.total_tokens}</li>
                        <li>Prompt Tokens: ${result.usage.prompt_tokens}</li>
                        <li>Completion Tokens: ${result.usage.completion_tokens}</li>
                        <li>Cost: $${result.usage.cost_usd.toFixed(4)}</li>
                    </ul>
                `;
                elements.usageInfo.innerHTML = DOMPurify.sanitize(usageHtml);
                elements.usageInfo.style.display = 'block';
            }
            
            if (elements.container) {
                elements.container.style.display = 'block';
            }
        } catch (error) {
            console.error('Error displaying messages:', error);
            this.showError('Failed to display messages');
        }
    }

    /**
     * @description Updates the search history display
     */
    updateHistoryList() {
        const historyList = document.getElementById('historyList');
        if (!historyList) {
            console.error('History list element not found');
            return;
        }

        try {
            const searches = this.summarizer.getSearches();
            
            // Clear existing history
            historyList.innerHTML = '';
            
            if (!searches?.length) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'history-empty';
                emptyMessage.textContent = 'No previous searches';
                historyList.appendChild(emptyMessage);
                return;
            }

            searches.forEach((result, index) => {
                if (!result) return;

                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.setAttribute('role', 'listitem');
                historyItem.setAttribute('tabindex', '0');
                
                const fromDate = this.dateUtils.formatDate(result.fromDate);
                const toDate = result.toDate ? this.dateUtils.formatDate(result.toDate) : 'present';
                
                const itemHtml = `
                    <strong>${DOMPurify.sanitize(result.serverName)} / #${DOMPurify.sanitize(result.channelName)}</strong><br>
                    <span class="history-date">From: ${fromDate}</span><br>
                    <span class="history-date">To: ${toDate}</span><br>
                    <span class="history-count">${result.messageCount} messages</span><br>
                    <span class="history-timestamp">Searched: ${this.dateUtils.formatDate(result.timestamp)}</span>
                `;

                historyItem.innerHTML = DOMPurify.sanitize(itemHtml, { USE_PROFILES: { html: true } });

                // Add event listeners for both click and keyboard interaction
                const handleSelect = () => {
                    // Update aria-selected state
                    historyList.querySelectorAll('.history-item').forEach(item => {
                        item.setAttribute('aria-selected', 'false');
                    });
                    historyItem.setAttribute('aria-selected', 'true');
                    
                    this.displayMessages(result);
                };

                historyItem.addEventListener('click', handleSelect);
                historyItem.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelect();
                    }
                });

                historyList.appendChild(historyItem);
            });
        } catch (error) {
            console.error('Error updating history:', error);
            this.showError('Failed to update search history');
        }
    }

    /**
     * @description Displays an error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        const errorElement = document.getElementById('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            console.error('Error:', message);
        }
    }

    /**
     * @description Hides the error message display
     */
    hideError() {
        const errorElement = document.getElementById('error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    /**
     * @description Initializes the UI with default values and event handlers
     */
    async initializeUI() {
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
                this.toggleToPresent();
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
                this.displayMessages(lastSearch);
                this.updateHistoryList();
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
                    const defaultPrompt = 'Enter your default prompt here'; // Define your default prompt
                    if (aiPromptInput) {
                        aiPromptInput.value = defaultPrompt;
                        localStorage.setItem('aiPrompt', defaultPrompt);
                    }
                });
            }
        } catch (error) {
            console.error('Error initializing UI:', error);
            this.showError('Failed to initialize the application');
        }
    }

    /**
     * @description Populates the server dropdown with user's guilds
     */
    async populateServerDropdown() {
        try {
            const userTokenInput = document.getElementById('userToken');
            const serverSelect = document.getElementById('serverSelect');

            if (userTokenInput && serverSelect) {
                const userToken = userTokenInput.value;
                const guilds = await this.discordApi.fetchUserGuilds(userToken);

                serverSelect.innerHTML = '<option value="">Select a server</option>';
                guilds.forEach(guild => {
                    const option = document.createElement('option');
                    option.value = guild.id;
                    option.textContent = guild.name;
                    serverSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error populating server dropdown:', error);
            this.showError('Failed to load servers');
        }
    }

    /**
     * @description Populates the channel dropdown with channels from the selected guild
     * @param {string} guildId - The ID of the selected guild
     */
    async populateChannelDropdown(guildId) {
        try {
            const userTokenInput = document.getElementById('userToken');
            const channelSelect = document.getElementById('channelSelect');

            if (userTokenInput && channelSelect) {
                const userToken = userTokenInput.value;
                const channels = await this.discordApi.fetchGuildChannels(guildId, userToken);

                channelSelect.innerHTML = '<option value="">Select a channel</option>';
                channels.forEach(channel => {
                    const option = document.createElement('option');
                    option.value = channel.id;
                    option.textContent = channel.name;
                    channelSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error populating channel dropdown:', error);
            this.showError('Failed to load channels');
        }
    }
}
