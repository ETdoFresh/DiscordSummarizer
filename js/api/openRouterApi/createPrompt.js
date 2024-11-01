/**
 * @description Creates the summarization prompt
 * @param {string} messageText - Formatted message text
 * @returns {string} Complete prompt for the AI
 */
export function createPrompt(messageText) {
    return `Please summarize the following Discord chat messages in a blog post style with paragraphs and bullet points where appropriate. Focus on the key discussions, decisions, and new information shared. Organize the content logically and highlight important points:\n\n${messageText}`;
}
