package handler

import (
    "log"
    "net/http"

    "github.com/joho/godotenv"

    "github.com/Aortxy/kunime-api/internal/anime"
    "github.com/Aortxy/kunime-api/internal/config"
    "github.com/Aortxy/kunime-api/internal/http"
    "github.com/Aortxy/kunime-api/internal/scraper"
)

// Exported handler for Vercel
func Handler(w http.ResponseWriter, r *http.Request) {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Println("no .env file found (or failed to load), using system env")
    }

    cfg := config.Load()
    scr := scraper.NewCollyScraper(cfg.ScrapeBaseURL, cfg.UserAgent)
    animeService := anime.NewService(scr)
    app := http.NewServer(cfg, animeService)

    // Serve the request
    app.ServeHTTP(w, r)
}
