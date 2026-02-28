import express from 'express';
import cors from 'cors';
import { AnimeHandler } from './handler/anime_handler.js';
import { StreamHandler } from './handler/stream_handler.js';
import { Logging } from '../middleware/logging.js';
import { APIKeyMiddleware } from '../middleware/api_key.js';

export function NewServer(cfg, animeSvc) {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(Logging());

    // Health check - before API Key middleware as per documentation
    app.get("/healthz", (req, res) => {
        res.json({ status: "ok" });
    });

    app.use(APIKeyMiddleware(cfg.apiKey));

    const h = new AnimeHandler(animeSvc);
    const streamH = new StreamHandler(animeSvc);

    app.get("/", (req, res) => {
        res.json({
            github: "https://github.com/kudanilll/kunime-api",
            support: "https://buymeacoffee.com/kudanil",
            documentation: "https://github.com/kudanilll/kunime-api/blob/master/docs/API.md",
            endpoint: {
                "Get Ongoing Anime": "/api/v1/ongoing-anime/:page",
                "Get Completed Anime": "/api/v1/completed-anime/:page",
                "Get Genres": "/api/v1/genres",
                "Get Anime by Genre & Page": "/api/v1/genre/:genreSlug/:page",
                "Get Anime Batch": "/api/v1/anime/:animeSlug/batch",
                "Get Anime Detail": "/api/v1/anime/:animeSlug",
                "Get Anime Episodes": "/api/v1/anime/:animeSlug/episodes",
                "Search Anime": "/api/v1/search/:query",
                "Get Anime Streams": "/api/v1/anime/:episodeSlug/streams",
                "Resolve Stream": "/api/v1/streams/resolve - POST"
            }
        });
    });

    const api = express.Router();

    // ongoing anime
    api.get("/ongoing-anime", h.getOngoingAnime);
    api.get("/ongoing-anime/:page", h.getOngoingAnime);

    // completed anime
    api.get("/completed-anime", h.getCompletedAnime);
    api.get("/completed-anime/:page", h.getCompletedAnime);

    // genres
    api.get("/genres", h.getGenres);

    // genre page
    api.get("/genre/:genreSlug/:page", h.getGenrePage);

    // anime batch, detail, episode list
    api.get("/anime/:animeSlug/batch", h.getAnimeBatch);
    api.get("/anime/:animeSlug", h.getAnimeDetail);
    api.get("/anime/:animeSlug/episodes", h.getAnimeEpisodes);

    // search
    api.get("/search/:query", h.searchAnime);

    // stream endpoints
    api.get("/anime/:episodeSlug/streams", streamH.getEpisodeStreams);
    api.post("/streams/resolve", streamH.resolveStream);

    app.use("/api/v1", api);

    return app;
}
