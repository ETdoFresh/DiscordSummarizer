/**
 * @description Updates the search history display
 */
export function updateHistoryList() {
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
                <button class="history-delete" aria-label="Delete search" title="Delete search">×</button>
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

            // Add click handler for delete button
            const deleteButton = historyItem.querySelector('.history-delete');
            if (deleteButton) {
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent triggering the historyItem click
                    this.summarizer.removeSearch(index);
                    this.updateHistoryList(); // Refresh the list
                });

                // Add keyboard support for delete button
                deleteButton.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        this.summarizer.removeSearch(index);
                        this.updateHistoryList();
                    }
                });
            }

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
