import qs from 'qs';
import * as cheerio from 'cheerio';
import { getNonce, ActionGetEmbed } from './stream_nonce.js';

export function decodeMirrorToken(token) {
    try {
        const raw = Buffer.from(token, 'base64').toString('utf8');
        return JSON.parse(raw);
    } catch (err) {
        throw new Error("invalid token format");
    }
}

export async function resolveStreamURL(scraper, token) {
    const nonce = await getNonce(scraper);
    const payload = decodeMirrorToken(token);

    const form = {
        action: ActionGetEmbed,
        nonce: nonce,
        id: payload.id,
        i: payload.i,
        q: payload.q
    };

    const response = await scraper.client.post('wp-admin/admin-ajax.php', {
        form: form,
        responseType: 'json'
    });

    if (!response.body || !response.body.data) {
        throw new Error("embed data empty");
    }

    const decoded = Buffer.from(response.body.data, 'base64').toString('utf8');
    const $ = cheerio.load(decoded);

    const src = $('iframe').attr('src');
    if (!src) {
        throw new Error("iframe src not found");
    }

    return src;
}
