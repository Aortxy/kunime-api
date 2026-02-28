import * as cheerio from 'cheerio';
import { acquire, release } from './limit.js';
import { visitWithRetry } from './retry.js';
import { absoluteURL, extractEpisodeNumber, extractScore } from './util.js';

export async function scrapeCompletedAnime(scraper, page) {
    await acquire();
    try {
        let url;
        if (page <= 1) {
            url = `/complete-anime/`;
        } else {
            url = `/complete-anime/page/${page}/`;
        }

        const response = await visitWithRetry(() => scraper.client.get(url));
        const $ = cheerio.load(response.data);
        const completed = [];

        $("div.rapi div.venz ul li").each((i, el) => {
            const e = $(el);
            const epText = e.find(".epz").text().trim();
            const episodes = extractEpisodeNumber(epText);

            const scoreText = e.find(".epztipe").text().trim();
            const score = extractScore(scoreText);

            const dateText = e.find(".newnime").text().trim();
            const href = e.find(".thumb a").attr("href")?.trim() || "";
            const img = e.find(".thumbz img").attr("src")?.trim() || "";
            const title = e.find(".thumbz h2.jdlflm").text().trim();

            completed.push({
                title,
                episodes,
                score,
                date: dateText,
                image: absoluteURL(scraper.baseURL, img),
                endpoint: href
            });
        });

        if (completed.length === 0) {
            throw new Error("no completed anime found");
        }

        return completed;
    } finally {
        release();
    }
}
