/**
 * @class DateUtils
 * @description Handles date conversions and formatting for Discord API interactions
 */
export class DateUtils {
    constructor() {
        this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.DISCORD_EPOCH = 1420070400000n; // Discord epoch (2015-01-01T00:00:00.000Z)
    }

    /**
     * @description Formats a date string into a localized format
     * @param {string} dateStr - ISO date string
     * @returns {string} Formatted date string
     */
    formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }

            return date.toLocaleString('en-US', {
                timeZone: this.timezone,
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

    /**
     * @description Converts a Date object to a local datetime string
     * @param {Date} date - Date object to convert
     * @returns {string} Formatted datetime string (YYYY-MM-DDTHH:mm)
     */
    dateToLocalString(date) {
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

    /**
     * @description Converts a local datetime string to UTC Date object
     * @param {string} dateString - Local datetime string
     * @returns {Date|null} UTC Date object or null if invalid
     */
    localStringToUTC(dateString) {
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

    /**
     * @description Converts a Date object to a Discord snowflake
     * @param {Date|string} date - Date to convert
     * @returns {string|null} Discord snowflake or null if invalid
     */
    dateToDiscordSnowflake(date) {
        if (!date) {
            console.warn('No date provided to dateToDiscordSnowflake');
            return null;
        }
        
        try {
            const timestamp = BigInt(date instanceof Date ? date.getTime() : new Date(date).getTime());
            
            console.log('Generating snowflake:', {
                inputDate: date instanceof Date ? date.toISOString() : new Date(date).toISOString(),
                timestamp: timestamp.toString()
            });
            
            // Discord Snowflake Format:
            // First 42 bits: timestamp (ms since Discord epoch)
            // Next 5 bits: worker ID
            // Next 5 bits: process ID
            // Last 12 bits: increment
            const snowflake = ((timestamp - this.DISCORD_EPOCH) << 22n).toString();
            
            // Verify the snowflake by converting back to a date
            const verificationDate = this.snowflakeToDate(snowflake);
            console.log('Snowflake verification:', {
                snowflake,
                decodedDate: verificationDate?.toISOString()
            });
            
            return snowflake;
        } catch (error) {
            console.error('Error generating Discord snowflake:', error);
            return null;
        }
    }

    /**
     * @description Converts a Discord snowflake to a Date object
     * @param {string} snowflake - Discord snowflake
     * @returns {Date|null} Date object or null if invalid
     */
    snowflakeToDate(snowflake) {
        if (!snowflake) {
            console.warn('No snowflake provided to snowflakeToDate');
            return null;
        }
        
        try {
            // Extract timestamp bits and convert back to milliseconds
            const timestamp = (BigInt(snowflake) >> 22n) + this.DISCORD_EPOCH;
            const date = new Date(Number(timestamp));
            
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date from snowflake');
            }
            
            return date;
        } catch (error) {
            console.error('Error converting snowflake to date:', error);
            return null;
        }
    }

    /**
     * @description Validates a date string or object
     * @param {Date|string} date - Date to validate
     * @returns {boolean} Whether the date is valid
     */
    isValidDate(date) {
        if (!date) return false;
        
        try {
            const dateObj = date instanceof Date ? date : new Date(date);
            return !isNaN(dateObj.getTime());
        } catch {
            return false;
        }
    }
}
