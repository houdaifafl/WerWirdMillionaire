const log = require("npmlog");

/**
 *
 * @param {any} err
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {(params: any[]) => void} next
 */
module.exports = function (err, req, res, next) {
	const message = err.message || "Unknown internal server error!";
	const status = err.status || 500;
	const id = err.id || "fatal_error";
	log.error("ErrorHandler", err.stack);
	res.status(status).send({
		success: false,
		message,
		error_id: id,
	});
};
