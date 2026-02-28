export function getPageParam(req) {
    const pageStr = req.params.page || "1";
    let page = parseInt(pageStr, 10);
    if (isNaN(page) || page < 1) {
        return 1;
    }
    return page;
}
