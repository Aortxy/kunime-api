package api

import (
	"net/http"
	"sync"

	"kunime-api/internal/anime"
	"kunime-api/internal/config"
	httpserver "kunime-api/internal/http"
	"kunime-api/internal/scraper"

	"github.com/gofiber/adaptor/v2"
)

var (
	handlerOnce sync.Once
	handler     http.Handler
)

// initialise Fiber app
func initFiberHandler() {
	cfg := config.Load()

	scr := scraper.NewCollyScraper(cfg.ScrapeBaseURL)
	animeSvc := anime.NewService(scr)

	app := httpserver.NewServer(cfg, animeSvc)

	// adaptor.FiberApp(*fiber.App) -> http.HandlerFunc
	handler = adaptor.FiberApp(app)
}

func Handler(w http.ResponseWriter, r *http.Request) {
	handlerOnce.Do(initFiberHandler)
	handler.ServeHTTP(w, r)
}
