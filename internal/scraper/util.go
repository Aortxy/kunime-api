package scraper

import (
	"net/url"
	"path"
	"strconv"
	"strings"
)

// "Episode 10" -> 10
func extractEpisodeNumber(epText string) int {
	epText = strings.ToLower(epText)
	epText = strings.ReplaceAll(epText, "episode", "")
	epText = strings.TrimSpace(epText)

	if epText == "" {
		return 0
	}

	n, err := strconv.Atoi(epText)
	if err != nil {
		return 0
	}
	return n
}

func absoluteURL(base, p string) string {
	if p == "" {
		return ""
	}
	if strings.HasPrefix(p, "http://") || strings.HasPrefix(p, "https://") {
		return p
	}

	u, err := url.Parse(base)
	if err != nil {
		return p
	}

	u.Path = path.Join(u.Path, p)
	return u.String()
}
