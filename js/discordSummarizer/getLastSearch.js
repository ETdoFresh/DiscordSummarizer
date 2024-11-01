/**
 * @description Retrieves most recent search
 * @returns {Object|null} Most recent search or null
 */
export function getLastSearch() {
    return this.searches[0] || null;
}
