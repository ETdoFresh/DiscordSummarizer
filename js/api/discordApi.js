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
    constructor() {
        this.API_BASE = 'https://discord.com/api/v9';
        this.dateUtils = new DateUtils();
        this.RATE_LIMIT_DELAY = 500; // 500ms between requests
    }

    handleResponse = handleResponse;
    fetchChannelInfo = fetchChannelInfo;
    fetchMessagesPage = fetchMessagesPage;
    getAllMessagesBetweenDates = getAllMessagesBetweenDates;
    fetchUserGuilds = fetchUserGuilds;
    fetchGuildChannels = fetchGuildChannels;
}
