import * as cheerio from 'cheerio';
import { acquire, release } from './limit.js';
import { visitWithRetry } from './retry.js';
import { absoluteURL, extractGenreSlug } from './util.js';

export async function scrapeGenres(scraper) {
    await acquire();
    try {
        const url = `/genre-list/`;
        const response = await visitWithRetry(() => scraper.client.get(url));
        const $ = cheerio.load(response.data);
        const genres = [];

        $("ul.genres li a").each((i, el) => {
            const e = $(el);
            const name = e.text().trim();
            const href = e.attr("href")?.trim() || "";

            if (!name || !href) {
                return;
            }

            const slug = extractGenreSlug(href);

            genres.push({
                name,
                slug,
                endpoint: absoluteURL(scraper.baseURL, href)
            });
        });

        if (genres.length === 0) {
            throw new Error("no genres found");
        }

        return genres;
    } finally {
        release();
    }
}
