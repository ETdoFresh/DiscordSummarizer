/**
 * @description Displays the message summary and related information
 * @param {Object} result - Summary result object
 */
export function displayMessages(result) {
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
