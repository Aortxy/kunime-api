import axios from 'axios';

export class AnimeScraper {
    constructor(baseURL, userAgent) {
        this.baseURL = baseURL;
        this.userAgent = userAgent;
        this.client = axios.create({
            baseURL: baseURL,
            timeout: 15000,
            headers: {
                'User-Agent': userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
                'Referer': baseURL,
                'Cache-Control': 'max-age=0',
                'Sec-Ch-Ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Upgrade-Insecure-Requests': '1'
            }
        });
    }
}
