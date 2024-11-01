/**
 * @description Validates form inputs
 * @param {Object} inputs - Form input values
 * @param {UiManager} uiManager - UI Manager instance
 * @returns {boolean} Whether inputs are valid
 */
export function validateInputs(inputs, uiManager) {
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
