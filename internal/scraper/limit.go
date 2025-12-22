package scraper

var scrapeLimiter = make(chan struct{}, 5)

func acquire() {
	scrapeLimiter <- struct{}{}
}

func release() {
	<-scrapeLimiter
}
