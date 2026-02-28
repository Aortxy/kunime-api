import qs from 'qs';

export const ActionGetNonce = "aa1208d27f29ca340c92c66d1926f13f";
export const ActionGetEmbed = "2a3505c93b0035d3f455df82bf976b84";

export async function getNonce(scraper) {
    const response = await scraper.client.post('/wp-admin/admin-ajax.php', qs.stringify({
        action: ActionGetNonce
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("nonce empty");
    }

    return response.data.data;
}
