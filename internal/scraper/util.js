import path from 'path';
import { URL } from 'url';

const reEpisodeRange = /\(\s*episode\s*\d+\s*[-–]\s*\d+\s*\)/gi;
const reSubtitle = /\b(subtitle\s*indonesia|sub\s*indo)\b/gi;

export function cleanAnimeTitle(raw) {
    if (!raw) return "";
    let title = raw.trim();

    // Remove episode range e.g. (Episode 1 - 12)
    title = title.replace(reEpisodeRange, "");

    // Remove subtitle markers
    title = title.replace(reSubtitle, "");

    // Cleanup double spaces
    title = title.split(/\s+/).join(" ").trim();

    return title;
}

// "Episode 10" -> 10
export function extractEpisodeNumber(epText) {
    if (!epText) return 0;
    let text = epText.toLowerCase();
    text = text.replace("episode", "");
    text = text.trim();

    if (text === "") {
        return 0;
    }

    const n = parseInt(text, 10);
    if (isNaN(n)) {
        return 0;
    }
    return n;
}

export function absoluteURL(base, p) {
    if (!p) {
        return "";
    }
    if (p.startsWith("http://") || p.startsWith("https://")) {
        return p;
    }

    try {
        const u = new URL(base);
        // Go's path.Join handles / differently, but here we can just use new URL(p, base) if p is relative or absolute path
        // but the Go code does u.Path = path.Join(u.Path, p)
        // Let's mimic Go's behavior:
        u.pathname = path.posix.join(u.pathname, p);
        return u.toString();
    } catch (err) {
        return p;
    }
}

export function extractScore(text) {
    if (!text) return 0;
    text = text.trim();
    if (text === "") {
        return 0;
    }

    const parts = text.split(/\s+/);
    const last = parts[parts.length - 1];

    const f = parseFloat(last);
    if (isNaN(f)) {
        return 0;
    }
    return f;
}

export function extractGenreSlug(href) {
    if (!href) return "";
    let link = href.trim();

    if (link.startsWith("http://") || link.startsWith("https://")) {
        try {
            const u = new URL(link);
            link = u.pathname;
        } catch (err) {
            return "";
        }
    }

    // "/genres/action/" -> "genres/action"
    link = link.split('/').filter(Boolean).join('/');
    if (link === "") {
        return "";
    }

    const parts = link.split('/');
    return parts[parts.length - 1];
}

export function extractValue(text) {
    if (!text) return "";
    const parts = text.split(':');
    if (parts.length < 2) {
        return "";
    }
    return parts.slice(1).join(':').trim();
}

export function extractEpisodeFromTitle(title) {
    if (!title) return 0;
    const lowerTitle = title.toLowerCase();

    const parts = lowerTitle.split("episode");
    if (parts.length < 2) {
        return 0;
    }

    const part = parts[1].trim();
    const fields = part.split(/\s+/);
    if (fields.length === 0) {
        return 0;
    }

    const n = parseInt(fields[0], 10);
    if (isNaN(n)) {
        return 0;
    }

    return n;
}

export function extractSearchGenres(text) {
    if (!text) return null;
    const lowerText = text.toLowerCase();
    const idx = lowerText.indexOf("genres");
    if (idx === -1) {
        return null;
    }

    let part = text.substring(idx);
    const splitPart = part.split(':');
    if (splitPart.length < 2) return null;
    part = splitPart[1];

    const raw = part.split(',');
    const genres = [];

    for (let g of raw) {
        g = g.trim();
        if (g !== "") {
            genres.push(g);
        }
    }

    return genres;
}

export function extractSearchStatus(text) {
    if (!text) return "Unknown";
    const lowerText = text.toLowerCase();
    const idx = lowerText.indexOf("status");
    if (idx === -1) {
        return "Unknown";
    }

    const part = text.substring(idx);
    return extractValue(part);
}

export function extractSearchRating(text) {
    if (!text) return "N/A";
    const lowerText = text.toLowerCase();
    const idx = lowerText.indexOf("rating");
    if (idx === -1) {
        return "N/A";
    }

    const part = text.substring(idx);
    const val = extractValue(part);
    if (val === "") {
        return "N/A";
    }

    return val;
}

export function extractEpisodeSlug(href) {
    if (!href) return "";
    try {
        const u = new URL(href, "http://dummy.com"); // base doesn't matter for path extraction
        const pathname = u.pathname.split('/').filter(Boolean);
        if (pathname.length < 2) {
            return "";
        }

        if (pathname[0] !== "episode") {
            return "";
        }

        return pathname[1];
    } catch (err) {
        return "";
    }
}
