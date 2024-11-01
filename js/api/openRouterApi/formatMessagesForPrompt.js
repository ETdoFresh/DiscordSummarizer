/**
 * @description Formats messages for the AI prompt
 * @param {Array} messages - Array of Discord messages
 * @returns {string} Formatted message text
 */
export function formatMessagesForPrompt(messages) {
    return messages
        .filter(msg => msg && msg.author && msg.content)
        .map(msg => `${msg.author.username}: ${msg.content.trim()}`)
        .join('\n');
}
