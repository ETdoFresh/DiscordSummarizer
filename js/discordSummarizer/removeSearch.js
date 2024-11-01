/**
 * @description Removes a search from history by index
 * @param {number} index - The index of the search to remove
 */
export function removeSearch(index) {
    if (index >= 0 && index < this.searches.length) {
        this.searches.splice(index, 1);
        // Save updated searches to localStorage
        localStorage.setItem('searches', JSON.stringify(this.searches));
    }
}
