import dotenv from 'dotenv';
import * as config from '../../internal/config/config.js';
import { AnimeScraper } from '../../internal/scraper/scraper.js';
import { Service } from '../../internal/anime/service.js';
import { extendServiceWithStream } from '../../internal/anime/service_stream.js';
import { NewServer } from '../../internal/http/router.js';

// Load environment variables
dotenv.config();

const cfg = config.load();

// Validation
if (!cfg.apiKey) throw new Error("missing env: API_KEY");
if (!cfg.scrapeBaseURL) throw new Error("missing env: SCRAPE_BASE_URL");
if (!cfg.userAgent) throw new Error("missing env: USER_AGENT");

const scr = new AnimeScraper(cfg.scrapeBaseURL, cfg.userAgent);
const animeService = new Service(scr);
extendServiceWithStream(Service); // Apply stream methods to Service prototype

const app = NewServer(cfg, animeService);

const port = cfg.port || 8080;

// Export for Vercel
export default app;

// Start server if not running as a module (Vercel uses default export)
if (import.meta.url === `file://${process.argv[1]}`) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
