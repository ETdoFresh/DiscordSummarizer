/**
 * @class DiscordApi
 * @description Handles interactions with the Discord API for fetching messages and channel information
 */
import { DateUtils } from '../utils/dateUtils.js';
import { handleResponse } from './discordApi/handleResponse.js';
import { fetchChannelInfo } from './discordApi/fetchChannelInfo.js';
import { fetchMessagesPage } from './discordApi/fetchMessagesPage.js';
import { getAllMessagesBetweenDates } from './discordApi/getAllMessagesBetweenDates.js';
import { fetchUserGuilds } from './discordApi/fetchUserGuilds.js';
import { fetchGuildChannels } from './discordApi/fetchGuildChannels.js';

export class DiscordApi {
    API_BASE = 'https://discord.com/api/v9';
    RATE_LIMIT_DELAY = 500; // 500ms between requests

    constructor() {
        this.dateUtils = new DateUtils();
    }

    // Use arrow functions to maintain context
    handleResponse = async (response) => {
        return handleResponse.call(this, response);
    };

    fetchChannelInfo = async (channelId, userToken) => {
        return fetchChannelInfo.call(this, channelId, userToken);
    };

    fetchMessagesPage = async (channelId, userToken, before = null, after = null) => {
        return fetchMessagesPage.call(this, channelId, userToken, before, after);
    };

    getAllMessagesBetweenDates = async (channelId, userToken, fromDate, toDate = null, progressCallback, maxPages = 50) => {
        return getAllMessagesBetweenDates.call(this, channelId, userToken, fromDate, toDate, progressCallback, maxPages);
    };

    fetchUserGuilds = async (userToken) => {
        return fetchUserGuilds.call(this, userToken);
    };

    fetchGuildChannels = async (guildId, userToken) => {
        return fetchGuildChannels.call(this, guildId, userToken);
    };
}
