export async function visitWithRetry(fn) {
    // gotScraping already has built-in retry logic, so we can just call it.
    // However, for compatibility with the existing code, we'll keep this.
    try {
        return await fn();
    } catch (err) {
        throw err;
    }
}
