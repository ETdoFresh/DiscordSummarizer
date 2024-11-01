/**
 * @description Updates the progress message display
 * @param {string} message - Progress message to display
 */
export function updateProgress(message) {
    const progressElement = document.getElementById('progress');
    if (progressElement) {
        progressElement.textContent = message;
        progressElement.style.display = 'block';
        console.log('Progress:', message);
    }
}
