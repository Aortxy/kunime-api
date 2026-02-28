export async function visitWithRetry(fn) {
    let lastErr;
    for (let i = 0; i < 2; i++) {
        try {
            return await fn();
        } catch (err) {
            lastErr = err;
            if (err.response && err.response.status === 403) {
                // If 403, maybe wait longer or just fail if it's Cloudflare
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
    throw lastErr;
}
