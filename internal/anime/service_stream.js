import { scrapeEpisodeStreams } from '../scraper/stream_list.js';
import { resolveStreamURL } from '../scraper/stream_resolve.js';

// Extend Service with stream methods
export function extendServiceWithStream(ServiceClass) {
    ServiceClass.prototype.getEpisodeStreams = async function(ctx, episodeSlug) {
        return await scrapeEpisodeStreams(this.scraper, episodeSlug);
    };

    ServiceClass.prototype.resolveStream = async function(ctx, token) {
        const url = await resolveStreamURL(this.scraper, token);
        return { url };
    };
}
