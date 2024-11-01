/**
 * @description Converts a Date object to a Discord snowflake
 * @param {Date|string} date - Date to convert
 * @param {bigint} DISCORD_EPOCH - Discord epoch constant
 * @returns {string|null} Discord snowflake or null if invalid
 */
export function dateToDiscordSnowflake(date, DISCORD_EPOCH) {
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
        const snowflake = ((timestamp - DISCORD_EPOCH) << 22n).toString();
        
        // Verify the snowflake by converting back to a date
        const verificationDate = snowflakeToDate(snowflake, DISCORD_EPOCH);
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
 * @param {bigint} DISCORD_EPOCH - Discord epoch constant
 * @returns {Date|null} Date object or null if invalid
 */
export function snowflakeToDate(snowflake, DISCORD_EPOCH) {
    if (!snowflake) {
        console.warn('No snowflake provided to snowflakeToDate');
        return null;
    }
    
    try {
        // Extract timestamp bits and convert back to milliseconds
        const timestamp = (BigInt(snowflake) >> 22n) + DISCORD_EPOCH;
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
