const getConnection = require("../database/connection");

class ControllerBase {
	/**
	 * Gets a connection to the database 'wwm' from the connection pool.
	 *
	 * @example
	 * ```js
	 * const connection = await this.getConnection();
	 * await connection.query("SELECT * FROM questions");
	 * connection.release();
	 * ```
	 * @returns {Promise<Connection>} a connection to the database
	 */
	async getConnection() {
		return await getConnection();
	}

	/**
	 * Initializes the controller. This involves creating the table if not existing and inserting the default data.
	 */
	async initialize() {
		throw new Exception("Not implemented");
	}
}

module.exports = ControllerBase;
