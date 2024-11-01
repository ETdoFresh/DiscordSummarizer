/**
 * @description Main application entry point
 */
import { DiscordSummarizer } from './discordSummarizer.js';
import { UiManager } from './ui/uiManager.js';

document.addEventListener('DOMContentLoaded', initializeApplication);

/**
 * @description Initializes the application
 */
async function initializeApplication() {
    try {
        console.log('Initializing application...');
        
        // Initialize core components
        const summarizer = new DiscordSummarizer();
        const uiManager = new UiManager(summarizer);

        await setupUserInterface(uiManager);
    } catch (error) {
        console.error('Fatal error:', error);
        displayFatalError(error);
    }
}

/**
 * @description Sets up the user interface and event handlers
 * @param {UiManager} uiManager - UI Manager instance
 */
async function setupUserInterface(uiManager) {
    try {
        console.log('Initializing UI...');
        uiManager.initializeUI();
        
        setupEventListeners(uiManager);
    } catch (error) {
        console.error('Error initializing UI:', error);
        uiManager.showError('Failed to initialize the application');
    }
}

/**
 * @description Sets up event listeners for user interactions
 * @param {UiManager} uiManager - UI Manager instance
 */
function setupEventListeners(uiManager) {
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

/**
 * @description Handles the fetch button click event
 * @param {UiManager} uiManager - UI Manager instance
 */
async function handleFetchClick(uiManager) {
    const fetchButton = document.getElementById('fetchButton');
    if (!fetchButton) return;

    try {
        // Get form inputs
        const inputs = {
            channelId: document.getElementById('channelId')?.value?.trim(),
            userToken: document.getElementById('userToken')?.value?.trim(),
            openrouterToken: document.getElementById('openrouterToken')?.value?.trim(),
            fromDate: document.getElementById('fromDate')?.value?.trim(),
            toPresent: document.getElementById('toPresent')?.checked,
            toDate: document.getElementById('toDate')?.value?.trim()
        };

        // Validate inputs
        if (!validateInputs(inputs, uiManager)) {
            return;
        }

        // Convert dates
        const fromDate = uiManager.summarizer.dateUtils.localStringToUTC(inputs.fromDate);
        const toDate = inputs.toPresent ? null : uiManager.summarizer.dateUtils.localStringToUTC(inputs.toDate);

        // Validate date range
        if (!inputs.toPresent && toDate < fromDate) {
            uiManager.showError('End date must be after start date');
            return;
        }

        // Prepare for fetch
        uiManager.hideError();
        fetchButton.disabled = true;
        uiManager.updateProgress('Starting fetch...');

        // Fetch and process messages
        const result = await uiManager.summarizer.fetchAndFormat(
            inputs.channelId,
            inputs.userToken,
            inputs.openrouterToken,
            fromDate,
            toDate,
            (message) => uiManager.updateProgress(message)
        );

        // Update UI with results
        uiManager.displayMessages(result);
        uiManager.updateHistoryList();
        
        // Hide progress indicator
        const progressElement = document.getElementById('progress');
        if (progressElement) {
            progressElement.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        uiManager.showError(error.message || 'An error occurred while fetching messages');
    } finally {
        if (fetchButton) {
            fetchButton.disabled = false;
        }
    }
}

/**
 * @description Validates form inputs
 * @param {Object} inputs - Form input values
 * @param {UiManager} uiManager - UI Manager instance
 * @returns {boolean} Whether inputs are valid
 */
function validateInputs(inputs, uiManager) {
    const requiredFields = ['channelId', 'userToken', 'openrouterToken', 'fromDate'];
    
    // Check required fields
    for (const field of requiredFields) {
        if (!inputs[field]) {
            uiManager.showError(`Please fill in all required fields (${field} is missing)`);
            return false;
        }
    }

    // Check to date if not using "to present"
    if (!inputs.toPresent && !inputs.toDate) {
        uiManager.showError('Please select an end date or check "To Present"');
        return false;
    }

    return true;
}

/**
 * @description Displays a fatal error message
 * @param {Error} error - Error object
 */
function displayFatalError(error) {
    const errorHtml = `
        <div class="error" style="display: block;">
            <h2>Fatal Error</h2>
            <p>${error.message}</p>
            <p>Please refresh the page or contact support if the problem persists.</p>
        </div>
    `;
    document.body.innerHTML = errorHtml;
}
