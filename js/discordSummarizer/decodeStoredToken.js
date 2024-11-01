/**
 * @private
 * @description Decodes stored tokens
 * @param {string} encoded - Encoded token
 * @returns {string} Decoded token
 */
export function decodeStoredToken(encoded) {
    try {
        if (!encoded) {
            console.log('No encoded token provided for decoding');
            return '';
        }
        console.log('Attempting to decode token');
        const decoded = atob(encoded);
        console.log('Token decoded successfully');
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return '';
    }
}
