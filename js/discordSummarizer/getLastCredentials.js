/**
 * @description Retrieves stored credentials
 * @returns {Object} Object containing stored credentials
 */
export function getLastCredentials() {
    console.log('Getting last credentials...');
    console.log('Last token exists:', this.lastToken ? 'Yes' : 'No');
    return {
        channelId: this.lastChannelId,
        token: this.lastToken,
        openrouterToken: this.lastOpenRouterToken
    };
}
