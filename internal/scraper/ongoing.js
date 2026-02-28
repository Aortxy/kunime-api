import * as cheerio from 'cheerio';
import { acquire, release } from './limit.js';
import { visitWithRetry } from './retry.js';
import { absoluteURL, extractEpisodeNumber } from './util.js';

export async function scrapeOngoingAnime(scraper, page) {
    await acquire();
    try {
        let url;
        if (page <= 1) {
            url = `/ongoing-anime/`;
        } else {
            url = `/ongoing-anime/page/${page}/`;
        }

        const response = await visitWithRetry(() => scraper.client.get(url));
        const $ = cheerio.load(response.data);
        const ongoings = [];

        $("div.venser div.venz ul li").each((i, el) => {
            const e = $(el);
            const epText = e.find(".epz").text().trim();
            const dayText = e.find(".epztipe").text().trim();
            const dateText = e.find(".newnime").text().trim();

            const dayParts = dayText.split(/\s+/);
            const day = dayParts.length > 0 ? dayParts[dayParts.length - 1] : "";

            const href = e.find(".thumb a").attr("href")?.trim() || "";
            const img = e.find(".thumbz img").attr("src")?.trim() || "";
            const title = e.find(".thumbz h2.jdlflm").text().trim();

            ongoings.push({
                title,
                episode: extractEpisodeNumber(epText),
                day,
                date: dateText,
                image: absoluteURL(scraper.baseURL, img),
                endpoint: href
            });
        });

        if (ongoings.length === 0) {
            throw new Error("no ongoing anime found");
        }

        return ongoings;
    } finally {
        release();
    }
}
