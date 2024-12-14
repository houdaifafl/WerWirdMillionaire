const bcrypt = require("bcrypt");

async function hash_password(password) {
	return bcrypt.hash(password, "$2b$10$1VhDlO7fPTUO6/r3CTxEBe");
}

module.exports = hash_password;
