package scraper

import (
	"strings"
	"time"

	"github.com/gocolly/colly/v2"
)

func visitWithRetry(c *colly.Collector, url string) error {
	var lastErr error

	for i := range 3 {
		lastErr = c.Visit(url)
		if lastErr == nil {
			c.Wait()
			return nil
		}

		// only retry network-ish errors
		if strings.Contains(lastErr.Error(), "already visited") {
			return nil
		}

		time.Sleep(time.Duration(i+1) * time.Second)
	}

	return lastErr
}
