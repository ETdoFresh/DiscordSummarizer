/**
 * @description Toggles visibility of the "to date" input based on "to present" checkbox
 */
export function toggleToPresent() {
    const toPresentInput = document.getElementById('toPresent');
    const toDateContainer = document.getElementById('toDateContainer');
    const toDateInput = document.getElementById('toDate');
    
    if (toDateContainer && toDateInput) {
        const isToPresent = toPresentInput?.checked ?? false;
        toDateContainer.style.display = isToPresent ? 'none' : 'block';
        toDateContainer.setAttribute('aria-hidden', isToPresent.toString());
        toDateInput.required = !isToPresent;
        toDateInput.setAttribute('aria-required', (!isToPresent).toString());
    }
}
