/**
 * @description Formats a date string into a localized format
 * @param {string} dateStr - ISO date string
 * @param {string} timezone - Timezone for formatting
 * @returns {string} Formatted date string
 */
export function formatDate(dateStr, timezone) {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }

        return date.toLocaleString('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}
