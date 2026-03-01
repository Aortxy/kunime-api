import * as cheerio from 'cheerio';
import { acquire, release } from './limit.js';
import { visitWithRetry } from './retry.js';
import { absoluteURL } from './util.js';

export async function scrapeGenrePage(scraper, slug, page) {
    await acquire();
    try {
        const url = `genres/${slug}/page/${page}/`;
        const response = await visitWithRetry(() => scraper.client.get(url));
        const $ = cheerio.load(response.body);
        const items = [];

        $("div.venser div.col-anime-con").each((i, el) => {
            const e = $(el);
            const title = e.find(".col-anime-title a").text().trim();
            const endpoint = e.find(".col-anime-title a").attr("href")?.trim() || "";
            const studio = e.find(".col-anime-studio").text().trim();
            const eps = e.find(".col-anime-eps").text().trim();
            let rating = e.find(".col-anime-rating").text().trim();
            const image = e.find(".col-anime-cover img").attr("src")?.trim() || "";
            const season = e.find(".col-anime-date").text().trim();
            const synopsis = e.find(".col-synopsis").text().trim();

            const genres = [];
            e.find(".col-anime-genre a").each((j, gEl) => {
                const name = $(gEl).text().trim();
                if (name) genres.push(name);
            });

            if (!rating) {
                rating = "N/A";
            }

            if (title && endpoint) {
                items.push({
                    title,
                    endpoint,
                    studio,
                    episodes: eps,
                    rating,
                    genres,
                    image: absoluteURL(scraper.baseURL, image),
                    synopsis,
                    season
                });
            }
        });

        if (items.length === 0) {
            throw new Error("no genre page anime found");
        }

        return items;
    } finally {
        release();
    }
}
