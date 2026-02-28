export function APIKeyMiddleware(validKey) {
    return (req, res, next) => {
        const key = req.get("X-API-Key");
        if (!key || key !== validKey) {
            return res.status(401).json({
                error: "invalid api key"
            });
        }
        next();
    };
}
