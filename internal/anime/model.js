/**
 * @typedef {Object} OngoingAnime
 * @property {string} title
 * @property {number} episode
 * @property {string} day
 * @property {string} date
 * @property {string} image
 * @property {string} endpoint
 */

/**
 * @typedef {Object} CompletedAnime
 * @property {string} title
 * @property {number} episodes
 * @property {number} score
 * @property {string} date
 * @property {string} image
 * @property {string} endpoint
 */

/**
 * @typedef {Object} Genre
 * @property {string} name
 * @property {string} slug
 * @property {string} endpoint
 */

/**
 * @typedef {Object} GenrePageAnime
 * @property {string} title
 * @property {string} endpoint
 * @property {string} studio
 * @property {string} episodes
 * @property {string} rating
 * @property {string[]} genres
 * @property {string} image
 * @property {string} synopsis
 * @property {string} season
 */

/**
 * @typedef {Object} BatchLink
 * @property {string} server
 * @property {string} url
 */

/**
 * @typedef {Object} BatchQuality
 * @property {string} quality
 * @property {string} size
 * @property {BatchLink[]} links
 */

/**
 * @typedef {Object} AnimeBatch
 * @property {string} title
 * @property {BatchQuality[]} qualities
 */

/**
 * @typedef {Object} AnimeDetail
 * @property {string} title
 * @property {string} japanese_title
 * @property {string} score
 * @property {string} type
 * @property {string} status
 * @property {string} total_episode
 * @property {string} duration
 * @property {string} release_date
 * @property {string} studio
 * @property {string[]} producers
 * @property {string[]} genres
 * @property {string} image
 * @property {string} synopsis
 */

/**
 * @typedef {Object} AnimeEpisode
 * @property {number} episode
 * @property {string} slug
 */

/**
 * @typedef {Object} AnimeEpisodeList
 * @property {string} anime_slug
 * @property {AnimeEpisode[]} episodes
 */

/**
 * @typedef {Object} AnimeSearchResult
 * @property {string} title
 * @property {string} status
 * @property {string} rating
 * @property {string[]} genres
 * @property {string} image
 * @property {string} endpoint
 */

/**
 * @typedef {Object} AnimeSearchResponse
 * @property {string} query
 * @property {AnimeSearchResult[]} data
 */
export const Models = {}; // JSDoc only models
