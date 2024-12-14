const mariadb = require("mariadb");

const pool = mariadb.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	port: process.env.DB_PORT,
	password: process.env.DB_PASS,
	connectionLimit: 5,
	database: "wwm",
});

module.exports = pool.getConnection.bind(pool);
