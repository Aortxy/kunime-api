package handler

import (
	"net/http" // Ini standard library
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	
	"kunime-api/internal/config"
	"kunime-api/internal/anime"
	"kunime-api/internal/scraper"
	myhttp "kunime-api/internal/http" // Kasih alias 'myhttp' supaya nggak bentrok
)

func Handler(w http.ResponseWriter, r *http.Request) {
	cfg := config.LoadConfig() 
	s := scraper.NewScraper()
	animeSvc := anime.NewService(s)

	// Panggil pakai alias tadi
	app := myhttp.NewServer(cfg, animeSvc)

	adaptor.FiberApp(app)(w, r)
}
