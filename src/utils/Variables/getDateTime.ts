/**
 * Returns the current system date and time in MySQL DATETIME format: 'YYYY-MM-DD HH:mm:ss'.
 *
 * @returns {string} The current date-time in MySQL-compatible format.
 */
export function getCurrentDateTime(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Returns a future date-time string in MySQL DATETIME format by adding the specified minutes to the current time.
 *
 * @param {number} minutes - The number of minutes to add to the current time.
 * @returns {string} The calculated expiry date-time in MySQL-compatible format.
 */
export function getExpiryDateTime(minutes: number): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return getCurrentDateTimeFromDate(now);
}

function getCurrentDateTimeFromDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}