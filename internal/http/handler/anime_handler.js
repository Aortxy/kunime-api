import { getPageParam } from './util.js';

export class AnimeHandler {
    constructor(svc) {
        this.svc = svc;
    }

    getOngoingAnime = async (req, res) => {
        const page = getPageParam(req);
        try {
            const data = await this.svc.getOngoingAnime(null, page);
            res.json({
                page: page,
                data: data
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getCompletedAnime = async (req, res) => {
        const page = getPageParam(req);
        try {
            const data = await this.svc.getCompletedAnime(null, page);
            res.json({
                page: page,
                data: data
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getGenres = async (req, res) => {
        try {
            const data = await this.svc.getGenres(null);
            res.json({ data: data });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getGenrePage = async (req, res) => {
        const slug = req.params.genreSlug;
        if (!slug) {
            return res.status(400).json({ error: "genre slug is required" });
        }

        const page = getPageParam(req);
        try {
            const data = await this.svc.getGenrePage(null, slug, page);
            res.json({
                genre: slug,
                page: page,
                data: data
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getAnimeBatch = async (req, res) => {
        const animeSlug = req.params.animeSlug;
        if (!animeSlug) {
            return res.status(400).json({ error: "anime slug is required" });
        }

        try {
            const data = await this.svc.getAnimeBatch(null, animeSlug);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getAnimeDetail = async (req, res) => {
        const animeSlug = req.params.animeSlug;
        if (!animeSlug) {
            return res.status(400).json({ error: "anime slug is required" });
        }

        try {
            const data = await this.svc.getAnimeDetail(null, animeSlug);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getAnimeEpisodes = async (req, res) => {
        const animeSlug = req.params.animeSlug;
        if (!animeSlug) {
            return res.status(400).json({ error: "anime slug is required" });
        }

        try {
            const data = await this.svc.getAnimeEpisodes(null, animeSlug);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    searchAnime = async (req, res) => {
        const query = req.params.query;
        if (!query) {
            return res.status(400).json({ error: "search query is required" });
        }

        try {
            const data = await this.svc.searchAnime(null, query);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}
