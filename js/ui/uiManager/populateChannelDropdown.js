import { showError } from './showError.js';

/**
 * @description Populates the channel dropdown with channels from the selected guild
 * @param {string} guildId - The ID of the selected guild
 */
export async function populateChannelDropdown(guildId) {
    try {
        const userTokenInput = document.getElementById('userToken');
        const channelSelect = document.getElementById('channelSelect');

        if (userTokenInput && channelSelect) {
            const userToken = userTokenInput.value;
            const channels = await this.discordApi.fetchGuildChannels(guildId, userToken);

            channelSelect.innerHTML = '<option value="">Select a channel</option>';
            channels.forEach(channel => {
                const option = document.createElement('option');
                option.value = channel.id;
                option.textContent = channel.name;
                channelSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error populating channel dropdown:', error);
        showError('Failed to load channels');
    }
}
