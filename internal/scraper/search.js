import * as cheerio from 'cheerio';
import { acquire, release } from './limit.js';
import { visitWithRetry } from './retry.js';
import { absoluteURL, cleanAnimeTitle } from './util.js';

export async function searchAnime(scraper, query) {
    await acquire();
    try {
        const searchURL = `/?s=${encodeURIComponent(query)}&post_type=anime`;
        const response = await visitWithRetry(() => scraper.client.get(searchURL));
        const $ = cheerio.load(response.data);
        const results = [];

        $(".page ul.chivsrc > li").each((i, el) => {
            const e = $(el);
            const rawTitle = e.find("h2 > a").text().trim();
            const title = cleanAnimeTitle(rawTitle);

            const href = e.find("h2 > a").attr("href")?.trim() || "";
            const image = e.find("img").attr("src")?.trim() || "";

            if (!title || !href) {
                return;
            }

            let genres = [];
            let status = "Unknown";
            let rating = "N/A";

            e.find(".set").each((j, setEl) => {
                const s = $(setEl);
                const label = s.find("b").text().toLowerCase().trim();
                const value = s.text().replace(s.find("b").text(), "").trim();

                if (label.includes("genres")) {
                    s.find("a").each((k, aEl) => {
                        const g = $(aEl).text().trim();
                        if (g) genres.push(g);
                    });
                } else if (label.includes("status")) {
                    status = value.replace(/^:/, '').trim();
                } else if (label.includes("rating")) {
                    rating = value.replace(/^:/, '').trim();
                }
            });

            results.push({
                title,
                image: absoluteURL(scraper.baseURL, image),
                genres,
                status,
                rating,
                endpoint: href
            });
        });

        if (results.length === 0) {
            throw new Error("no search results found");
        }

        return {
            query,
            data: results
        };
    } finally {
        release();
    }
}
