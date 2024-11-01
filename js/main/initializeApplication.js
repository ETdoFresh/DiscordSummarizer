/**
 * @description Initializes the application
 */
import { DiscordSummarizer } from '../discordSummarizer.js';
import { UiManager } from '../ui/uiManager.js';
import { setupUserInterface } from './setupUserInterface.js';
import { displayFatalError } from './displayFatalError.js';

export async function initializeApplication() {
    try {
        console.log('Initializing application...');
        
        // Initialize core components
        console.log('Creating DiscordSummarizer instance...');
        const summarizer = new DiscordSummarizer();
        console.log('Creating UiManager instance...');
        const uiManager = new UiManager(summarizer);

        await setupUserInterface(uiManager);
    } catch (error) {
        console.error('Fatal error:', error);
        displayFatalError(error);
    }
}
