/**
 * @private
 * @description Encodes sensitive tokens for storage
 * @param {string} token - Token to encode
 * @returns {string} Encoded token
 */
export function encodeStoredToken(token) {
    if (!token) {
        console.log('No token provided for encoding');
        return '';
    }
    console.log('Encoding token for storage');
    return btoa(token);
}
