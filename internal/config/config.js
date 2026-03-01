import process from 'process';

export function load() {
    return {
        port: process.env.PORT || "8080",
        apiKey: process.env.API_KEY,
        scrapeBaseURL: process.env.SCRAPE_BASE_URL,
        userAgent: process.env.USER_AGENT
    };
}

export function mustEnv(key) {
    const v = process.env[key];
    if (!v) {
        throw new Error("missing env: " + key);
    }
    return v;
}
