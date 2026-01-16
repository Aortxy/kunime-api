package scraper

import (
	"context"
	"time"

	"github.com/gocolly/colly/v2"
)

func newCollector(ctx context.Context, userAgent string) *colly.Collector {
	c := colly.NewCollector(
		colly.Async(false),
		colly.UserAgent(userAgent),
	)

	_ = c.Limit(&colly.LimitRule{
		DomainGlob:  "*",
		RandomDelay: 800 * time.Millisecond,
	})

	c.OnRequest(func(r *colly.Request) {
		r.Headers.Set("Accept", "text/html,application/xhtml+xml")
		r.Headers.Set("Accept-Language", "id-ID,id;q=0.9,en;q=0.8")
		// r.Headers.Set("Referer", s.baseURL)
		r.Headers.Set("Cache-Control", "no-cache")
		if err := ctx.Err(); err != nil {
			r.Abort()
		}
	})

	return c
}
