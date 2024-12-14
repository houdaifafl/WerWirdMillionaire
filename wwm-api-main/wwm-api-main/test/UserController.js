const validator = require("validator").default;
const { describe, it, beforeEach } = require("mocha");
const { assert } = require("chai");
const drop = require("../src/database/drop");
const initialize = require("../src/database/initialize");
const UserController = require("../src/controllers/UserController");
const hash_password = require("../src/utils/hash_password");

describe("UserController", () => {
	beforeEach(async () => {
		await drop();
		await initialize();
	});

	describe("#signup()", () => {
		it("should return an authentification token for a valid user", async () => {
			const result = await UserController.signup(
				"Hans",
				"Wurst",
				"hans.wurst@gmail.com",
				"hanswurst",
				"2002-12-24",
				"red",
				"Mom",
				"New York"
			);
			assert.isTrue(validator.isUUID(result.auth_token, 4));
		});

		it("should store a user correctly in the database", async () => {
			const result = await UserController.signup(
				"Hans",
				"Wurst",
				"hans.wurst@gmail.com",
				"hanswurst",
				"2002-12-24",
				"red",
				"Mom",
				"New York"
			);
			const user = await UserController.getUserOfToken(result.auth_token);

			assert.equal(user.username, "hans_wurst");
			assert.equal(user.email, "hans.wurst@gmail.com");
			assert.equal(user.password, await hash_password("hanswurst"));
			assert.equal(user.favorite_color, "red");
			assert.equal(user.name_mother, "Mom");
			assert.equal(user.place_of_birth, "New York");
			assert.equal(user.admin, false);
			assert.equal(user.monthly_wins, 0);
			assert.equal(user.reset_password_token, null);
			assert.equal(user.auth_token, result.auth_token);
			assert.equal(user.highscore_daily, 0);
			assert.equal(user.highscore_weekly, 0);
			assert.equal(user.highscore_monthly, 0);
		});

		it("should choose an alternative username if the username is already taken", async () => {
			await UserController.signup(
				"Hans",
				"Wurst",
				"hans.wurst@gmail.com",
				"hanswurst",
				"2002-12-24",
				"red",
				"Mom",
				"New York"
			);

			const result = await UserController.signup(
				"Hans",
				"Wurst",
				"hans.wurst1@gmail.com",
				"hanswurst",
				"2002-12-24",
				"red",
				"Mom",
				"New York"
			);

			const user = await UserController.getUserOfToken(result.auth_token);

			assert.equal(user.username, "hans_wurst1");
		});

		it("should throw an error if the email is already taken", async () => {
			await UserController.signup(
				"Hans",
				"Wurst",
				"hans.wurst@gmail.com",
				"hanswurst",
				"2002-12-24",
				"red",
				"Mom",
				"New York"
			);

			await UserController.signup(
				"Hans",
				"Wurst",
				"hans.wurst@gmail.com",
				"hanswurst",
				"2002-12-24",
				"red",
				"Mom",
				"New York"
			).catch((err) => {
				assert.exists(err);
			});
		});

		it("should throw an error if the user's age is less than 15 years", async () => {
			await UserController.signup(
				"Hans",
				"Wurst",
				"hans.wurst@gmail.com",
				"hanswurst",
				"08.12.2022",
				"red",
				"Mom",
				"New York"
			).catch((err) => {
				assert.exists(err);
			});
		});
	});
});
