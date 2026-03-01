export class StreamHandler {
    constructor(svc) {
        this.svc = svc;
    }

    getEpisodeStreams = async (req, res) => {
        const slug = req.params.episodeSlug;
        try {
            const data = await this.svc.getEpisodeStreams(null, slug);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    resolveStream = async (req, res) => {
        const token = req.body.token;
        if (!token) {
            return res.status(400).json({ error: "token required" });
        }

        try {
            const resolved = await this.svc.resolveStream(null, token);
            res.json(resolved);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}
