import { encodeStoredToken } from './encodeStoredToken.js';

/**
 * @description Saves user credentials securely
 * @param {string} channelId - Discord channel ID
 * @param {string} token - Discord auth token
 * @param {string} openrouterToken - OpenRouter API token
 */
export function saveCredentials(channelId, token, openrouterToken) {
    console.log('Saving credentials...');
    console.log('Channel ID:', channelId ? '[ID provided]' : '[No ID]');
    console.log('Discord token:', token ? '[Token provided]' : '[No token]');
    
    this.lastChannelId = channelId;
    this.lastToken = token;
    this.lastOpenRouterToken = openrouterToken;
    
    localStorage.setItem('lastChannelId', channelId);
    const encodedToken = encodeStoredToken(token);
    console.log('Saving encoded token to localStorage:', encodedToken ? '[Token encoded]' : '[No token to encode]');
    localStorage.setItem('lastToken', encodedToken);
    localStorage.setItem('lastOpenRouterToken', encodeStoredToken(openrouterToken));
    
    console.log('Credentials saved to localStorage');
}
