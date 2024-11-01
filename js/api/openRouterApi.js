/**
 * @class OpenRouterApi
 * @description Handles interactions with the OpenRouter API for AI-powered message summarization
 */
export class OpenRouterApi {
    constructor() {
        this.API_URL = 'https://openrouter.ai/api/v1/chat/completions';
        this.MODEL = 'anthropic/claude-2';
        this.MAX_RETRIES = 2;
        this.RETRY_DELAY = 1000; // 1 second
    }

    /**
     * @private
     * @description Formats messages for the AI prompt
     * @param {Array} messages - Array of Discord messages
     * @returns {string} Formatted message text
     */
    formatMessagesForPrompt(messages) {
        return messages
            .filter(msg => msg && msg.author && msg.content)
            .map(msg => `${msg.author.username}: ${msg.content.trim()}`)
            .join('\n');
    }

    /**
     * @private
     * @description Creates the summarization prompt
     * @param {string} messageText - Formatted message text
     * @returns {string} Complete prompt for the AI
     */
    createPrompt(messageText) {
        return `Please summarize the following Discord chat messages in a blog post style with paragraphs and bullet points where appropriate. Focus on the key discussions, decisions, and new information shared. Organize the content logically and highlight important points:\n\n${messageText}`;
    }

    /**
     * @private
     * @description Handles API request with retries
     * @param {Object} requestData - Request configuration
     * @param {number} retryCount - Current retry attempt
     * @returns {Promise<Object>} API response
     */
    async makeRequest(requestData, retryCount = 0) {
        try {
            const response = await fetch(this.API_URL, requestData);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData?.error?.message || `HTTP error! status: ${response.status}`;
                
                if (response.status === 429 && retryCount < this.MAX_RETRIES) {
                    // Rate limit hit - wait and retry
                    await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
                    return this.makeRequest(requestData, retryCount + 1);
                }
                
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            if (retryCount < this.MAX_RETRIES) {
                // Network error - retry
                await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
                return this.makeRequest(requestData, retryCount + 1);
            }
            throw error;
        }
    }

    /**
     * @description Summarizes Discord messages using AI
     * @param {Array} messages - Array of Discord messages
     * @param {string} openrouterToken - OpenRouter API token
     * @param {Function} progressCallback - Progress update callback
     * @returns {Promise<Object>} Summary and usage statistics
     * @throws {Error} If summarization fails
     */
    async summarizeMessages(messages, openrouterToken, progressCallback) {
        if (!messages?.length) {
            throw new Error('No messages to summarize');
        }

        if (!openrouterToken) {
            throw new Error('OpenRouter API token is required');
        }

        try {
            progressCallback?.(`Preparing ${messages.length} messages for summarization...`);

            const messageText = this.formatMessagesForPrompt(messages);
            const prompt = this.createPrompt(messageText);

            progressCallback?.('Requesting summary from AI model...');

            const requestData = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openrouterToken}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'Discord Message Summarizer'
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                })
            };

            const data = await this.makeRequest(requestData);

            if (!data?.choices?.[0]?.message?.content) {
                throw new Error('Invalid response format from OpenRouter');
            }

            progressCallback?.('Processing AI response...');

            const usage = data.usage || {};
            return {
                summary: data.choices[0].message.content,
                usage: {
                    prompt_tokens: usage.prompt_tokens || 0,
                    completion_tokens: usage.completion_tokens || 0,
                    total_tokens: usage.total_tokens || 0,
                    cost_usd: usage.cost || 0
                }
            };
        } catch (error) {
            console.error('OpenRouter API error:', error);
            throw new Error(`Summarization failed: ${error.message}`);
        }
    }
}
