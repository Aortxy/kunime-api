import axios from 'axios';

export class AnimeScraper {
    constructor(baseURL, userAgent) {
        this.baseURL = baseURL;
        this.userAgent = userAgent;
        this.client = axios.create({
            baseURL: baseURL,
            timeout: 15000,
            headers: {
                'User-Agent': userAgent
            }
        });
    }
}
