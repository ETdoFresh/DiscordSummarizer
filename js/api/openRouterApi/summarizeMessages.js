import { formatMessagesForPrompt } from './formatMessagesForPrompt.js';
import { createPrompt } from './createPrompt.js';
import { makeRequest } from './makeRequest.js';

/**
 * @description Summarizes Discord messages using AI
 * @param {Array} messages - Array of Discord messages
 * @param {string} openrouterToken - OpenRouter API token
 * @param {Function} progressCallback - Progress update callback
 * @returns {Promise<Object>} Summary and usage statistics
 * @throws {Error} If summarization fails
 */
export async function summarizeMessages(messages, openrouterToken, progressCallback) {
    if (!messages?.length) {
        throw new Error('No messages to summarize');
    }

    if (!openrouterToken) {
        throw new Error('OpenRouter API token is required');
    }

    try {
        progressCallback?.(`Preparing ${messages.length} messages for summarization...`);

        const messageText = formatMessagesForPrompt(messages);
        const prompt = createPrompt(messageText);

        progressCallback?.('Requesting summary from AI model...');

        const requestData = {
            url: 'https://openrouter.ai/api/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openrouterToken}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'Discord Message Summarizer'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-2',
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        };

        const data = await makeRequest(requestData);

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
                cost_usd: usage.cost || 0,
                model: data.model || '---'
            }
        };
    } catch (error) {
        console.error('OpenRouter API error:', error);
        throw new Error(`Summarization failed: ${error.message}`);
    }
}
