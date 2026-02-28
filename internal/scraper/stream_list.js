import * as cheerio from 'cheerio';
import { acquire, release } from './limit.js';
import { visitWithRetry } from './retry.js';

export async function scrapeEpisodeStreams(scraper, episodeSlug) {
    await acquire();
    try {
        const url = `/episode/${episodeSlug}/`;
        const response = await visitWithRetry(() => scraper.client.get(url));
        const $ = cheerio.load(response.data);
        const results = [];

        $(".mirrorstream ul").each((i, el) => {
            const e = $(el);
            const className = e.attr("class"); // m360p / m480p / m720p
            if (!className || !className.startsWith("m")) {
                return;
            }
            const quality = className.substring(1);

            e.find("li a[data-content]").each((j, aEl) => {
                const a = $(aEl);
                const server = a.text().trim();
                const token = a.attr("data-content")?.trim() || "";

                if (token && server) {
                    results.push({
                        quality,
                        server,
                        token
                    });
                }
            });
        });

        if (results.length === 0) {
            throw new Error("no stream mirrors found");
        }

        return {
            episode_slug: episodeSlug,
            streams: results
        };
    } finally {
        release();
    }
}
