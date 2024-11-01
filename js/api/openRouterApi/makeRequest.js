/**
 * @description Handles API request with retries
 * @param {Object} requestData - Request configuration
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<Object>} API response
 */
export async function makeRequest(requestData, retryCount = 0) {
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000; // 1 second

    try {
        const response = await fetch(requestData.url, requestData);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData?.error?.message || `HTTP error! status: ${response.status}`;
            
            if (response.status === 429 && retryCount < MAX_RETRIES) {
                // Rate limit hit - wait and retry
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
                return makeRequest(requestData, retryCount + 1);
            }
            
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            // Network error - retry
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
            return makeRequest(requestData, retryCount + 1);
        }
        throw error;
    }
}
