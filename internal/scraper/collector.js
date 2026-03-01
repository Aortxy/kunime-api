// Node.js doesn't need colly.Collector, we'll use axios + cheerio directly.
// This file can just be a placeholder or helper if needed.

import axios from 'axios';

export function newCollector(userAgent) {
    return axios.create({
        headers: {
            'User-Agent': userAgent
        }
    });
}
