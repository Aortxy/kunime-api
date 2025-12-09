package anime

import "context"

type Scraper interface {
	ScrapeOngoingAnime(ctx context.Context, page int) ([]OngoingAnime, error)
}

type Service struct {
	scraper Scraper
}

func NewService(scraper Scraper) *Service {
    return &Service{scraper: scraper}
}

func (s *Service) GetOngoingAnime(ctx context.Context, page int) ([]OngoingAnime, error) {
	if page < 1 {
		page = 1
	}
	return s.scraper.ScrapeOngoingAnime(ctx, page)
}
