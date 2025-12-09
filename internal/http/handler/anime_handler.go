package handler

import (
	"kunime-api/internal/anime"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type AnimeHandler struct {
    svc *anime.Service
}

func NewAnimeHandler(svc *anime.Service) *AnimeHandler {
    return &AnimeHandler{svc: svc}
}

func (h *AnimeHandler) GetOngoingAnime(c *fiber.Ctx) error {
	pageStr := c.Params("page", "1")
	page, err := strconv.Atoi(pageStr)
    
	if err != nil || page < 1 {
		page = 1
	}

	items, err := h.svc.GetOngoingAnime(c.Context(), page)
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"currentPage":  page,
		"content": items,
	})
}
