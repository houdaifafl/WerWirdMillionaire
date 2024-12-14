const getConnection = require("./connection");
const QuestionController = require("../controllers/QuestionController");
const UserController = require("../controllers/UserController");
const mariadb = require("mariadb");
const dropDatabase = require("./drop");
const log = require("npmlog");

/**
 * Initializes the 'wwm' database. This involves creating the database if not existing, creating the tables if not existing and inserting the default data.
 */
module.exports = async () => {
	const connection = await mariadb.createConnection({
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		host: process.env.DB_HOST,
	});
	log.info("database/initialize", "Successfully connected to mariadb!");

	if (process.env["DROP_DATABASE_AT_START"] === "true") {
		await dropDatabase();
	}

	let result = await connection.query(
		"CREATE DATABASE IF NOT EXISTS wwm CHARACTER SET UTF8mb4 COLLATE utf8mb4_unicode_ci;"
	);

	await connection.end();

	if (result.affectedRows === 1) {
		log.info("database/initialize", "Successfully created 'wwm' database!");
	} else {
		log.warn(
			"database/initialize",
			"'wwm' database already exists - keeping it! this is fine as long as the tables schema did not change."
		);
	}

	await UserController.initialize();
	await QuestionController.initialize();
};
