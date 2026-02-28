// JavaScript doesn't typically need a channel-based limiter for this,
// but we can implement a simple one if parity is strictly required.

let activeRequests = 0;
const limit = 5;
const queue = [];

function processQueue() {
    if (queue.length > 0 && activeRequests < limit) {
        const resolve = queue.shift();
        activeRequests++;
        resolve();
    }
}

export async function acquire() {
    if (activeRequests < limit) {
        activeRequests++;
        return;
    }
    return new Promise(resolve => {
        queue.push(resolve);
    });
}

export function release() {
    activeRequests--;
    processQueue();
}
