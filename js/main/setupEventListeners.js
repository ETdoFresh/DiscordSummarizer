/**
 * @description Sets up event listeners for user interactions
 * @param {UiManager} uiManager - UI Manager instance
 */
import { handleFetchClick } from './handleFetchClick.js';

export function setupEventListeners(uiManager) {
    console.log('Setting up event listeners...');
    
    // Set up "to present" checkbox handler
    const toPresentCheckbox = document.getElementById('toPresent');
    if (toPresentCheckbox) {
        toPresentCheckbox.addEventListener('change', () => {
            uiManager.toggleToPresent();
        });
    }

    // Set up fetch button handler
    const fetchButton = document.getElementById('fetchButton');
    if (fetchButton) {
        fetchButton.addEventListener('click', () => handleFetchClick(uiManager));
    }

    // Set up form submission handler
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFetchClick(uiManager);
        });
    }
}
