/**
 * @class DateUtils
 * @description Handles date conversions and formatting for Discord API interactions
 */
import { formatDate } from './dateUtils/formatDate.js';
import { dateToLocalString } from './dateUtils/dateToLocalString.js';
import { localStringToUTC } from './dateUtils/localStringToUTC.js';
import { dateToDiscordSnowflake, snowflakeToDate } from './dateUtils/dateToDiscordSnowflake.js';
import { isValidDate } from './dateUtils/isValidDate.js';

export class DateUtils {
    constructor() {
        this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.DISCORD_EPOCH = 1420070400000n; // Discord epoch (2015-01-01T00:00:00.000Z)
    }

    formatDate = (dateStr) => formatDate(dateStr, this.timezone);
    dateToLocalString = dateToLocalString;
    localStringToUTC = localStringToUTC;
    dateToDiscordSnowflake = (date) => dateToDiscordSnowflake(date, this.DISCORD_EPOCH);
    snowflakeToDate = (snowflake) => snowflakeToDate(snowflake, this.DISCORD_EPOCH);
    isValidDate = isValidDate;
}
