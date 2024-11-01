/**
 * @description Validates a date string or object
 * @param {Date|string} date - Date to validate
 * @returns {boolean} Whether the date is valid
 */
export function isValidDate(date) {
    if (!date) return false;
    
    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        return !isNaN(dateObj.getTime());
    } catch {
        return false;
    }
}
