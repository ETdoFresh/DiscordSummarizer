/**
 * @description Hides the error message display
 */
export function hideError() {
    const errorElement = document.getElementById('error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}
