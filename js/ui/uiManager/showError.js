/**
 * @description Displays an error message
 * @param {string} message - Error message to display
 */
export function showError(message) {
    const errorElement = document.getElementById('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        console.error('Error:', message);
    }
}
