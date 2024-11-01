/**
 * @description Converts a local datetime string to UTC Date object
 * @param {string} dateString - Local datetime string
 * @returns {Date|null} UTC Date object or null if invalid
 */
export function localStringToUTC(dateString) {
    if (!dateString) {
        console.warn('Empty date string provided to localStringToUTC');
        return null;
    }
    
    try {
        const localDate = new Date(dateString);
        
        if (isNaN(localDate.getTime())) {
            throw new Error('Invalid date string');
        }
        
        console.log('Date conversion:', {
            input: dateString,
            localDate: localDate.toISOString(),
            localTimestamp: localDate.getTime(),
            offset: localDate.getTimezoneOffset()
        });
        
        return localDate;
    } catch (error) {
        console.error('Error converting local string to UTC:', error);
        return null;
    }
}
