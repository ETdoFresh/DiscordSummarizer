/**
 * @description Handles the fetch button click event
 * @param {UiManager} uiManager - UI Manager instance
 */
import { validateInputs } from './validateInputs.js';

export async function handleFetchClick(uiManager) {
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

        // Log input values (safely)
        console.log('Form inputs:', {
            channelId: inputs.channelId ? '[ID exists]' : '[No ID]',
            userToken: inputs.userToken ? '[Token exists]' : '[No token]',
            openrouterToken: inputs.openrouterToken ? '[Token exists]' : '[No token]',
            fromDate: inputs.fromDate,
            toPresent: inputs.toPresent,
            toDate: inputs.toDate
        });

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
