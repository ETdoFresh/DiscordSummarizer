/**
 * @description Converts a Date object to a local datetime string
 * @param {Date} date - Date object to convert
 * @returns {string} Formatted datetime string (YYYY-MM-DDTHH:mm)
 */
export function dateToLocalString(date) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        console.warn('Invalid date provided to dateToLocalString:', date);
        return '';
    }
    
    try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
        console.error('Error converting date to local string:', error);
        return '';
    }
}
