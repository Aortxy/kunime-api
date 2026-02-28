import * as cheerio from 'cheerio';
import { acquire, release } from './limit.js';
import { visitWithRetry } from './retry.js';
import { absoluteURL, extractValue } from './util.js';

export async function scrapeAnimeDetail(scraper, animeSlug) {
    await acquire();
    try {
        const url = `/anime/${animeSlug}/`;
        const response = await visitWithRetry(() => scraper.client.get(url));
        const $ = cheerio.load(response.data);
        const result = {
            title: "",
            japanese_title: "",
            score: "",
            type: "",
            status: "",
            total_episode: "",
            duration: "",
            release_date: "",
            studio: "",
            producers: [],
            genres: [],
            image: "",
            synopsis: ""
        };

        $("div.fotoanime").each((i, el) => {
            const e = $(el);
            result.image = absoluteURL(
                scraper.baseURL,
                e.find("img").attr("src")?.trim() || ""
            );

            e.find("div.infozingle p span").each((j, spanEl) => {
                const text = $(spanEl).text().trim();

                if (text.startsWith("Judul")) {
                    result.title = extractValue(text);
                } else if (text.startsWith("Japanese")) {
                    result.japanese_title = extractValue(text);
                } else if (text.startsWith("Skor")) {
                    result.score = extractValue(text);
                } else if (text.startsWith("Tipe")) {
                    result.type = extractValue(text);
                } else if (text.startsWith("Status")) {
                    result.status = extractValue(text);
                } else if (text.startsWith("Total Episode")) {
                    result.total_episode = extractValue(text);
                } else if (text.startsWith("Durasi")) {
                    result.duration = extractValue(text);
                } else if (text.startsWith("Tanggal Rilis")) {
                    result.release_date = extractValue(text);
                } else if (text.startsWith("Studio")) {
                    result.studio = extractValue(text);
                } else if (text.startsWith("Produser")) {
                    const raw = extractValue(text);
                    result.producers = raw.split(',').map(p => p.trim()).filter(Boolean);
                }
            });

            e.find("div.infozingle a[rel='tag']").each((j, aEl) => {
                const genre = $(aEl).text().trim();
                if (genre) result.genres.push(genre);
            });
        });

        $("div.sinopc").each((i, el) => {
            result.synopsis = $(el).text().trim();
        });

        if (!result.title) {
            throw new Error("anime detail not found");
        }

        return result;
    } finally {
        release();
    }
}
