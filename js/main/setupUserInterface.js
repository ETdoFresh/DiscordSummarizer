/**
 * @description Sets up the user interface and event handlers
 * @param {UiManager} uiManager - UI Manager instance
 */
import { setupEventListeners } from './setupEventListeners.js';

export async function setupUserInterface(uiManager) {
    try {
        console.log('Setting up user interface...');
        uiManager.initializeUI();
        
        setupEventListeners(uiManager);
    } catch (error) {
        console.error('Error initializing UI:', error);
        uiManager.showError('Failed to initialize the application');
    }
}
