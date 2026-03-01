import { gotScraping } from 'got-scraping';

export class AnimeScraper {
    constructor(baseURL, userAgent) {
        this.baseURL = baseURL;
        this.userAgent = userAgent;
        this.client = gotScraping.extend({
            prefixUrl: baseURL,
            headerGeneratorOptions: {
                browsers: [
                    { name: 'chrome', minVersion: 124 },
                    { name: 'edge', minVersion: 124 }
                ],
                devices: ['desktop'],
                locales: ['en-US', 'en', 'id-ID', 'id'],
                operatingSystems: ['windows', 'macos'],
            },
            timeout: {
                request: 30000
            },
            retry: {
                limit: 3,
                methods: ['GET', 'POST'],
                statusCodes: [403, 408, 413, 429, 500, 502, 503, 504],
                calculateDelay: ({attemptCount}) => attemptCount * 1000,
            },
            followRedirect: true,
            maxRedirects: 5,
            http2: true
        });
    }
}
