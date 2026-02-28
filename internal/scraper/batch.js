import * as cheerio from 'cheerio';
import { acquire, release } from './limit.js';
import { visitWithRetry } from './retry.js';

export async function scrapeAnimeBatch(scraper, animeSlug) {
    await acquire();
    try {
        const url = `/batch/${animeSlug}/`;
        const response = await visitWithRetry(() => scraper.client.get(url));
        const $ = cheerio.load(response.data);
        const result = {
            title: "",
            qualities: []
        };

        $("div.batchlink").each((i, el) => {
            const e = $(el);
            result.title = e.find("h4").text().trim();

            e.find("ul > li").each((j, liEl) => {
                const li = $(liEl);
                const quality = li.find("strong").text().trim();
                const size = li.find("i").text().trim();

                if (!quality) {
                    return;
                }

                const links = [];
                li.find("a").each((k, aEl) => {
                    const a = $(aEl);
                    const server = a.text().trim();
                    const url = a.attr("href")?.trim() || "";

                    if (server && url) {
                        links.push({
                            server,
                            url
                        });
                    }
                });

                if (links.length > 0) {
                    result.qualities.push({
                        quality,
                        size,
                        links
                    });
                }
            });
        });

        if (!result.title || result.qualities.length === 0) {
            throw new Error("batch not found or empty");
        }

        return result;
    } finally {
        release();
    }
}
