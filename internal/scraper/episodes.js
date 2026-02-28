import * as cheerio from 'cheerio';
import { acquire, release } from './limit.js';
import { visitWithRetry } from './retry.js';
import { extractEpisodeFromTitle, extractEpisodeSlug } from './util.js';

export async function scrapeAnimeEpisodes(scraper, animeSlug) {
    await acquire();
    try {
        const url = `/anime/${animeSlug}/`;
        const response = await visitWithRetry(() => scraper.client.get(url));
        const $ = cheerio.load(response.data);
        const episodes = [];

        $("div.episodelist ul > li").each((i, el) => {
            const e = $(el);
            const href = e.find("a").attr("href")?.trim() || "";
            const title = e.find("a").text().trim();

            if (!href || !title) {
                return;
            }

            // skip batch
            if (!href.includes("/episode/")) {
                return;
            }

            // extract episode number
            const epNum = extractEpisodeFromTitle(title);
            if (epNum < 1) {
                return;
            }

            const epSlug = extractEpisodeSlug(href);
            if (!epSlug) {
                return;
            }

            episodes.push({
                episode: epNum,
                slug: epSlug
            });
        });

        if (episodes.length === 0) {
            throw new Error("episode list not found");
        }

        // sort ascending
        episodes.sort((a, b) => a.episode - b.episode);

        return {
            anime_slug: animeSlug,
            episodes: episodes
        };
    } finally {
        release();
    }
}
