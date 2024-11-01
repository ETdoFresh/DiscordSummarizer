import { showError } from './showError.js';

/**
 * @description Populates the server dropdown with user's guilds
 */
export async function populateServerDropdown() {
    try {
        const userTokenInput = document.getElementById('userToken');
        const serverSelect = document.getElementById('serverSelect');

        if (userTokenInput && serverSelect) {
            const userToken = userTokenInput.value;
            const guilds = await this.discordApi.fetchUserGuilds(userToken);

            serverSelect.innerHTML = '<option value="">Select a server</option>';
            guilds.forEach(guild => {
                const option = document.createElement('option');
                option.value = guild.id;
                option.textContent = guild.name;
                serverSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error populating server dropdown:', error);
        showError('Failed to load servers');
    }
}
