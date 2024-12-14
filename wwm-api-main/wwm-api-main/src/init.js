const log = require("npmlog");

async function init() {
	// Load environment variables from .env file.
	require("dotenv").config();

	// Load the RESTful express app.
	const app = require("./app.js");

	// Initialize the database.
	await require("./database/initialize.js")();

	// Start the RESTful api on port 8000.
	const port = 8000;
	app.listen(port, () => {
		log.info("index", `RESTful API running on port ${port}`);
	});
	require("./services/initialize.js");
}

module.exports = init;
