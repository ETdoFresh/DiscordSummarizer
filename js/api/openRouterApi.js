/**
 * @fileoverview This file contains the OpenRouterApi class, which handles interactions with the OpenRouter API for AI-powered message summarization.
 */

import { formatMessagesForPrompt } from './openRouterApi/formatMessagesForPrompt.js';
import { createPrompt } from './openRouterApi/createPrompt.js';
import { makeRequest } from './openRouterApi/makeRequest.js';
import { summarizeMessages } from './openRouterApi/summarizeMessages.js';

/**
 * @class OpenRouterApi
 * @description Handles interactions with the OpenRouter API for AI-powered message summarization
 */
export class OpenRouterApi {
    constructor() {
        this.API_URL = 'https://openrouter.ai/api/v1/chat/completions';
        this.MODEL = 'openai/gpt-4o-mini';
        this.MAX_RETRIES = 2;
        this.RETRY_DELAY = 1000; // 1 second
    }

    formatMessagesForPrompt = formatMessagesForPrompt;
    createPrompt = createPrompt;
    makeRequest = makeRequest;
    summarizeMessages = summarizeMessages;
}
