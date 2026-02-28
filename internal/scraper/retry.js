export async function visitWithRetry(fn) {
    try {
        return await fn();
    } catch (err) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return await fn();
    }
}
