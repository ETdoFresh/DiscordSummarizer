/**
 * @private
 * @description Handles rate limiting and common error scenarios
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} Parsed JSON response
 * @throws {Error} API error details
 */
export async function handleResponse(response) {
    if (response.ok) {
        return await response.json();
    }

    let errorMessage = `HTTP error! status: ${response.status}`;
    
    switch (response.status) {
        case 401:
            errorMessage = 'Invalid Discord token. Please check your credentials.';
            break;
        case 403:
            errorMessage = 'Access denied. Please ensure you have permission to view this channel.';
            break;
        case 429:
            const retryAfter = response.headers.get('Retry-After');
            throw { 
                status: 429, 
                retryAfter: parseInt(retryAfter) || 5,
                message: 'Rate limited by Discord API'
            };
        case 404:
            errorMessage = 'Channel not found. Please check the channel ID.';
            break;
    }

    throw new Error(errorMessage);
}
