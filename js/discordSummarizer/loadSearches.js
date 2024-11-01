/**
 * @private
 * @description Loads and validates stored searches
 * @returns {Array} Array of valid searches
 */
export function loadSearches() {
    try {
        const stored = JSON.parse(localStorage.getItem('searches') || '[]');
        return Array.isArray(stored) ? stored.slice(0, 10) : [];
    } catch (error) {
        console.error('Error loading searches:', error);
        return [];
    }
}
