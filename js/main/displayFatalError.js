/**
 * @description Displays a fatal error message
 * @param {Error} error - Error object
 */
export function displayFatalError(error) {
    const errorHtml = `
        <div class="error" style="display: block;">
            <h2>Fatal Error</h2>
            <p>${error.message}</p>
            <p>Please refresh the page or contact support if the problem persists.</p>
        </div>
    `;
    document.body.innerHTML = errorHtml;
}
