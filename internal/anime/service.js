import { scrapeOngoingAnime } from '../scraper/ongoing.js';
import { scrapeCompletedAnime } from '../scraper/completed.js';
import { scrapeGenres } from '../scraper/genres.js';
import { scrapeGenrePage } from '../scraper/genre_page.js';
import { scrapeAnimeBatch } from '../scraper/batch.js';
import { scrapeAnimeDetail } from '../scraper/detail.js';
import { scrapeAnimeEpisodes } from '../scraper/episodes.js';
import { searchAnime } from '../scraper/search.js';

export class Service {
    constructor(scraper) {
        this.scraper = scraper;
    }

    async getOngoingAnime(ctx, page) {
        if (page < 1) page = 1;
        return await scrapeOngoingAnime(this.scraper, page);
    }

    async getCompletedAnime(ctx, page) {
        if (page < 1) page = 1;
        return await scrapeCompletedAnime(this.scraper, page);
    }

    async getGenres(ctx) {
        return await scrapeGenres(this.scraper);
    }

    async getGenrePage(ctx, slug, page) {
        if (page < 1) page = 1;
        return await scrapeGenrePage(this.scraper, slug, page);
    }

    async getAnimeBatch(ctx, animeSlug) {
        return await scrapeAnimeBatch(this.scraper, animeSlug);
    }

    async getAnimeDetail(ctx, animeSlug) {
        return await scrapeAnimeDetail(this.scraper, animeSlug);
    }

    async getAnimeEpisodes(ctx, animeSlug) {
        return await scrapeAnimeEpisodes(this.scraper, animeSlug);
    }

    async searchAnime(ctx, query) {
        return await searchAnime(this.scraper, query);
    }
}
