package handler

import (
	"net/http"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	
	"kunime-api/internal/config"
	"kunime-api/internal/anime"
	"kunime-api/internal/scraper"
	"kunime-api/internal/http" // package router kamu namanya http di screenshot
)

func Handler(w http.ResponseWriter, r *http.Request) {
	// 1. Load Config (Pastikan Env sudah diisi di Dashboard Vercel)
	cfg := config.LoadConfig() 
	
	// 2. Init Service & Scraper (sesuaikan dengan logic di main.go kamu)
	s := scraper.NewScraper()
	animeSvc := anime.NewService(s)

	// 3. Panggil NewServer kamu yang di screenshot tadi
	// Karena di screenshot package-nya 'http', kita panggil http.NewServer
	app := http.NewServer(cfg, animeSvc)

	// 4. Adaptor Fiber ke Vercel
	adaptor.FiberApp(app)(w, r)
}
