import morgan from 'morgan';

// Mimic the Go logging format: [%s] %s %s %d %s %s UA=%q ERR=%v
// morgan doesn't exactly match this without custom tokens, but let's try our best.
export function Logging() {
    return morgan((tokens, req, res) => {
        const start = new Date().toISOString();
        const method = tokens.method(req, res);
        const url = tokens.url(req, res);
        const status = tokens.status(req, res);
        const latency = tokens['response-time'](req, res) + 'ms';
        const ip = req.ip;
        const ua = req.get('User-Agent') || "";

        return `[${start}] ${method} ${url} ${status} ${latency} ${ip} UA="${ua}" ERR=null`;
    });
}
