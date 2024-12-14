/**
 * 
 * @param {(req: Express.Request, res: Express.Response, next) => Promise<void>} fn 
 * @returns {(req: Express.Request, res: Express.Response, next) => Promise<void>}
 */
module.exports = function (fn) {
    return (
        (req, res, next) =>
            Promise
                .resolve(fn(req, res, next))
                .catch((err) => {
                    next(err);
                })
    );
}