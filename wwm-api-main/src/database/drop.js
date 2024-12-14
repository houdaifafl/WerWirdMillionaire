const mariadb = require("mariadb");
const log = require("npmlog");
require("dotenv").config();

/**
 * Drops the whole 'wwm' database.
 */
async function drop() {
	try {
		const connection = await mariadb.createConnection({
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			host: process.env.DB_HOST,
		});
		await connection.query("DROP DATABASE IF EXISTS wwm");
		await connection.end();
		log.info("database/drop", "Dropped database!");
	} catch (err) {
		log.error("database/drop", "Failed to drop database!");
		log.error("database/drop", err);
	}
}

module.exports = drop;
