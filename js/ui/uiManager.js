/**
 * @class UiManager
 * @description Manages the user interface and interactions for the Discord summarizer
 */
import { DateUtils } from '../utils/dateUtils.js';

export class UiManager {
    constructor(summarizer) {
        this.summarizer = summarizer;
        this.dateUtils = new DateUtils();
        
        // Configure marked options for security and rendering
        marked.setOptions({
            headerIds: false,
            breaks: true,
            gfm: true,
            sanitize: false, // Disabled because we're using DOMPurify
            smartLists: true,
            smartypants: true
        });
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
    initializeUI() {
        try {
            // Set default dates
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
            
            const fromDateInput = document.getElementById('fromDate');
            const toDateInput = document.getElementById('toDate');
            
            if (fromDateInput) {
                fromDateInput.value = this.dateUtils.dateToLocalString(oneHourAgo);
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

            // Load saved credentials
            const lastCreds = this.summarizer.getLastCredentials();
            if (lastCreds) {
                const inputs = {
                    channelId: document.getElementById('channelId'),
                    userToken: document.getElementById('userToken'),
                    openrouterToken: document.getElementById('openrouterToken')
                };

                Object.entries(inputs).forEach(([key, input]) => {
                    if (input && lastCreds[key]) {
                        input.value = lastCreds[key];
                    }
                });
            }

            // Load and display last search
            const lastSearch = this.summarizer.getLastSearch();
            if (lastSearch) {
                this.displayMessages(lastSearch);
                this.updateHistoryList();
            }
        } catch (error) {
            console.error('Error initializing UI:', error);
            this.showError('Failed to initialize the application');
        }
    }
}
