package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func getPageParam(c *fiber.Ctx) int {
	pageStr := c.Params("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		return 1
	}
	return page
}
