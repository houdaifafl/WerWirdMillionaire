const User = require("../models/User");
const ControllerBase = require("./ControllerBase");
const bcrypt = require("bcrypt");
const uuid = require("uuid").v4;
const validator = require("validator").default;
const hash_password = require("../utils/hash_password");
const get_age = require("../utils/get_age");
const log = require("npmlog");
const API_Error = require("../errorhandling/API_Error");
const { generateUsername } = require("unique-username-generator");

class UserController extends ControllerBase {
    async initialize() {
        const connection = await this.getConnection();
        const tableExisting =
            (await connection.query("SHOW TABLES LIKE 'user'")).length > 0;
        await connection.query(
            `CREATE TABLE IF NOT EXISTS user (
				username VARCHAR(100) PRIMARY KEY,
				email VARCHAR(100) UNIQUE NOT NULL,
				password VARCHAR(100) NOT NULL,
				admin BOOLEAN DEFAULT FALSE,
				highscore_daily int DEFAULT 0,
				highscore_weekly int DEFAULT 0,
				highscore_monthly int DEFAULT 0,
				monthly_wins int DEFAULT 0,
				favourite_color varchar(100),
				mother_name varchar(100),
				place_of_birth varchar(100),
				auth_token varchar(36) UNIQUE,
				reset_password_token varchar(36) UNIQUE,
				played_game_of_the_day BOOLEAN DEFAULT FALSE
			);`
        );
        if (!tableExisting) log.info("UserController", "Created table 'user'!");
        else
            log.warn(
                "UserController",
                "Table 'user' already exists - keeping it! This is fine as long as the table's schema did not change."
            );

        connection.release();

        if (!(await this.isAdminAccountExisting())) {
            await this.createAdminAccount();
        } else {
            log.info("UserController", "Admin account already exists!");
        }

        if (!(await this.isDefaultUserAccountExisting())) {
            await this.createDefaultUserAccount();
        } else {
            log.info("UserController", "Default user account already exists!");
        }

        if (process.env["INSERT_RANDOM_USERS"] === "true") {
            if (!(await this.areRandomPlayersExisting())) {
                await this.createRandomPlayers(200);
            } else {
                log.info("UserController", "Random players are already existing!");
            }
        }
    }
    /**
     * Validates the passed parameters and creates a new user in the database. If the validation fails an error is thrown. Otherwise an object that contains the auth_token and the user's name is returned.
     * @param {string} surname
     * @param {string} lastname
     * @param {string} email
     * @param {string} password not hashed
     * @param {string} birthday in yyyy-mm-dd format
     * @returns {{
     *  auth_token: string,
     *  username: string
     * }} auth_token and username
     */
    async signup(surname, lastname, email, password, birthday) {
        // Validate parameters.
        if (!surname || validator.isEmpty(surname))
            throw new API_Error(
                "No surname has been specified!",
                400,
                "surname_error"
            );
        if (!lastname || validator.isEmpty(lastname))
            throw new API_Error(
                "No lastname has been specified!",
                400,
                "lastname_error"
            );
        if (
            !birthday ||
            !validator.isDate(birthday, {
                format: "YYYY-MM-DD",
                strictMode: true,
                delimiters: ["-", "-"],
            })
        )
            throw new API_Error(
                `Entered birthday ${birthday} is not a date!`,
                400,
                "date_error"
            );

        if (get_age(new Date(birthday)) < 15) {
            throw new API_Error(
                "The user must be at least 15 years old to play this game!",
                403,
                "birthday_error"
            );
        }
        if (!email || !validator.isEmail(email))
            throw new API_Error("Entered email is not an email!", 400, "email_error");
        if (!password || validator.isEmpty(password))
            throw new API_Error(
                "No password has been specified!",
                400,
                "password_error"
            );

        // Generate username
        let username = `${surname}_${lastname}`.toLowerCase();

        // Generate auth_token
        const auth_token = uuid();

        const connection = await this.getConnection();

        // Check if email is already used.
        const isEmailUsed = await connection.query(
            "SELECT * FROM user WHERE email = ?",
            [email]
        );
        if (isEmailUsed.length > 0)
            connection.release();
        throw new API_Error(
            "Email is already used!",
            409,
            "duplicate_email_error"
        );

        // Check if username is already used.
        let doesUserExist = await connection.query(
            "SELECT * FROM user WHERE username = ?",
            [username]
        );

        // If username is already used, append a number to it.
        for (let i = 1; doesUserExist.length > 0; ++i) {
            username = `${surname}_${lastname}${i}`.toLowerCase();
            doesUserExist = await connection.query(
                "SELECT * FROM user WHERE username = ?",
                [username]
            );
        }

        // Insert user into database.
        await connection.query(
            "INSERT INTO user (username, email, password, auth_token) VALUES (?, ?, ?, ?)",
            [username, email, await hash_password(password), auth_token]
        );

        connection.release();
        log.info("UserController", `Registered new user '${username}'!`);
        return {
            username: username,
            auth_token: auth_token,
        };
    }

    /**
     * Sets the security questions for the user with the passed auth_token. Throws an error if the auth_token is invalid or the passed parameters are invalid.
     * @param {string} auth_token
     * @param {string} favourite_color
     * @param {string} mother_name
     * @param {string} place_of_birth
     */
    async setSecurityQuestions(
        auth_token,
        favourite_color,
        mother_name,
        place_of_birth
    ) {
        if (!favourite_color || validator.isEmpty(favourite_color))
            throw new API_Error(
                "No favorite color has been specified!",
                400,
                "favourite_color_error"
            );
        if (!mother_name || validator.isEmpty(mother_name))
            throw new API_Error(
                "No mother's name has been specified!",
                400,
                "mother_name_error"
            );
        if (!place_of_birth || validator.isEmpty(place_of_birth))
            throw new API_Error(
                "No place of birth has been specified!",
                400,
                "place_of_birth_error"
            );
        await this.validateAuthToken(auth_token, false);

        const connection = await this.getConnection();

        const result = await connection.query(
            "UPDATE user SET favourite_color = ?, mother_name = ?, place_of_birth = ? WHERE auth_token = ?",
            [favourite_color, mother_name, place_of_birth, auth_token]
        );

        connection.release();

        if (result.affectedRows === 0) {
            throw new API_Error(
                "Failed to update security questions!",
                500,
                "fatal_error"
            );
        }

        log.info("UserController", "Updated security questions of user!");
    }

    /**
     * Checks if an user with the passed user identity (email or username) exists and if the password matches. If the validation fails, an error is thrown. Otherwise an object is returned that contains the authentification token
     * and a boolean describing whether the user is an admin.
     * @param {string} user_identity the entered email or username
     * @param {string} password the entered password (not hashed)
     * @returns {{auth_token: string, is_admin: boolean}} df
     */
    async login(user_identity, password) {
        if (!user_identity || validator.isEmpty(user_identity))
            throw new API_Error(
                "No username/email has been specified!",
                401,
                "user_identity_error"
            );
        if (!password || validator.isEmpty(password))
            throw new API_Error(
                "No password has been specified!",
                401,
                "password_error"
            );

        const connection = await this.getConnection();

        // Validate credentials
        const result = await connection.query(
            "SELECT username, admin FROM user WHERE (email = ? OR username = ?) AND password = ?",
            [user_identity, user_identity, await hash_password(password)]
        );
        if (result.length === 0) {
            connection.release();
            throw new API_Error("Invalid credentials!", 401, "credentials_error");
        }

        // Generate auth_token and store it in the database.
        const auth_token = uuid();
        await connection.query(
            "UPDATE user SET auth_token = ? WHERE username = ?",
            [auth_token, result[0].username]
        );

        connection.release();
        log.info("UserController", `Logged in user '${result[0].username}'!`);
        return {
            auth_token,
            username: result[0].username,
            is_admin: result[0].admin,
        };
    }

    /**
     * Logs the user having the passed auth_token out. Throws an error if the auth_token is invalid.
     * @param {string} auth_token
     */
    async logout(auth_token) {
        const connection = await this.getConnection();

        const result = await connection.query(
            "UPDATE user SET auth_token = NULL WHERE auth_token = ?",
            [auth_token]
        );

        connection.release();

        if (result.affectedRows === 0) {
            throw new API_Error("Invalid authentification token!", 401, "auth_error");
        }
        log.info(
            "UserController",
            `Logged out user with auth_token '${auth_token}'!`
        );
    }

    /**
     * Validates the passed security question for a specified user. Returns a `reset_password_token` if the validation succeeds. Otherwise an error is thrown.
     * @param {string} user_identity the entered email or username
     * @param {string} favourite_color
     * @param {string} mother_name
     * @param {string} place_of_birth
     * @returns {string} reset_password_token
     */
    async checkSecurityQuestions(
        user_identity,
        favourite_color,
        mother_name,
        place_of_birth
    ) {
        if (!user_identity || validator.isEmpty(user_identity))
            throw new API_Error(
                "No username/email has been specified!",
                400,
                "user_identity_error"
            );
        if (!favourite_color || validator.isEmpty(favourite_color))
            throw new API_Error(
                "No favourite color has been specified!",
                400,
                "favourite_color_error"
            );
        if (!mother_name || validator.isEmpty(mother_name))
            throw new API_Error(
                "No mother's name has been specified!",
                400,
                "mother_name_error"
            );
        if (!place_of_birth || validator.isEmpty(place_of_birth))
            throw new API_Error(
                "No place of birth has been specified!",
                400,
                "place_of_birth_error"
            );

        const connection = await this.getConnection();

        const result = await connection.query(
            "SELECT username FROM user WHERE (username = ? OR email = ?) AND favourite_color = ? AND mother_name = ? AND place_of_birth = ?",
            [
                user_identity,
                user_identity,
                favourite_color,
                mother_name,
                place_of_birth,
            ]
        );

        if (result.length === 0) {
            connection.release();
            log.info(
                "UserController",
                `'${user_identity}' answered the security questions incorrectly!`
            );
            throw new API_Error(
                "The security questions have been answered incorrectly!",
                405,
                "incorrect_answer_error"
            );
        }

        const reset_password_token = uuid();

        await connection.query(
            "UPDATE user SET reset_password_token = ? WHERE username = ?",
            [reset_password_token, result[0].username]
        );

        connection.release();
        log.info(
            "UserController",
            `'${result[0].username}' answered the security questions correctly!`
        );
        return reset_password_token;
    }

    /**
     * Resets the password of the user with the passed `reset_password_token` to the passed `new_password`. Throws an error if the reset_password_token is invalid.
     * On success the user is logged in!
     * @param {string} reset_password_token
     * @param {string} new_password
     * @returns {{
     * auth_token: string,
     * username: string,
     * is_admin: boolean,
     * }} auth_token, username and is_admin
     */
    async resetPassword(reset_password_token, new_password) {
        const connection = await this.getConnection();

        const auth_token = uuid();

        const result = await connection.query(
            "UPDATE user SET password = ?, auth_token = ?, reset_password_token = NULL WHERE reset_password_token = ?",
            [await hash_password(new_password), auth_token, reset_password_token]
        );

        if (result.affectedRows === 0) {
            connection.release();
            throw new API_Error(
                "Invalid password reset token!",
                401,
                "reset_password_error"
            );
        }

        const user = await connection.query(
            "SELECT username, admin FROM user WHERE auth_token = ?",
            [auth_token]
        );

        connection.release();

        log.info("UserController", `Reset password of '${user[0].username}'!`);
        return {
            auth_token,
            username: user[0].username,
            is_admin: user[0].admin,
        };
    }

    /**
     * Gets the trophy count (amount of monthly wins) of the logged in user. Throws an error if the auth_token is invalid.
     * @param {string} auth_token
     * @returns {number} trophy count
     */
    async getTrophyCount(auth_token) {
        const connection = await this.getConnection();

        const result = await connection.query(
            "SELECT monthly_wins FROM user WHERE auth_token = ?",
            [auth_token]
        );

        connection.release();
        if (result.length === 1) {
            const trophyCount = result[0].monthly_wins;
            log.info("UserController", `Queried trophy count ('${trophyCount}')!`);
            return trophyCount;
        } else {
            throw new API_Error("Invalid authentification token!", 401, "auth_error");
        }
    }

    /**
     * Validates the authentification token. Throws an error if the token is invalid. If `is_admin` is set to true,
     * the user needs admin privileges.
     * @param {string} auth_token the authentification token
     * @param {boolean} is_admin whether the user needs admin privileges
     */
    async validateAuthToken(auth_token, is_admin) {
        const connection = await this.getConnection();

        let result;
        if (is_admin) {
            result = await connection.query(
                "SELECT username FROM user WHERE auth_token = ? AND admin = ?",
                [auth_token, is_admin]
            );
        } else {
            result = await connection.query(
                "SELECT username FROM user WHERE auth_token = ?",
                [auth_token]
            );
        }

        connection.release();

        if (result.length === 0) {
            throw new API_Error(
                `Invalid authentification token '${auth_token}' (${is_admin ? "admin rights required" : "no admin rights required"
                })!`,
                401,
                "auth_error"
            );
        }

        log.info(
            "UserController",
            `Validated auth token of user '${result[0].username}'!`
        );
    }

    /**
     * Resets the daily highscores of all players.
     */
    async resetDailyHighscores() {
        const connection = await this.getConnection();

        await connection.query("UPDATE user SET highscore_daily = 0");

        connection.release();

        log.info("UserController", "Reset daily highscores!");
    }

    /**
     * Resets the weekly highscores of all players.
     */
    async resetWeeklyHighscores() {
        const connection = await this.getConnection();

        await connection.query("UPDATE user SET highscore_weekly = 0");

        connection.release();

        log.info("UserController", "Reset weekly highscores!");
    }

    /**
     * Resets the monthly highscores of all players.
     */
    async resetMonthlyHighscores() {
        const connection = await this.getConnection();

        await connection.query("UPDATE user SET highscore_monthly = 0");

        connection.release();

        log.info("UserController", "Reset monthly highscores!");
    }

    /**
     * Uploads the passed highscore for the logged in user. Throws an error if the auth_token or the passed score is invalid.
     * @param {string} auth_token
     * @param {number} highscore
     */
    async uploadHighscore(auth_token, highscore) {
        if (typeof highscore !== "number") {
            throw new API_Error("Missing or invalid score!", 500, "fatal_error");
        }

        const connection = await this.getConnection();

        const result = await connection.query(
            "UPDATE user SET highscore_daily = highscore_daily + ?, highscore_weekly = highscore_weekly + ?, highscore_monthly = highscore_monthly + ? WHERE auth_token = ?",
            [highscore, highscore, highscore, auth_token]
        );

        connection.release();

        if (result.affectedRows === 0) {
            throw new API_Error("Invalid authentification token!", 401, "auth_error");
        }

        log.info("UserController", "Updated players highscore!");
    }

    /**
     * Gets the daily highscores of the top 100 players and the logged in player. Throws an error if the auth_token is invalid.
     * @param {string} auth_token
     * @returns {{
     *  highscores: ({
     *  score: number,
     *  username: string,
     * })[],
     *  playerRank: number,
     *  playerHighscore: number,
     * }} daily highscores
     */
    async getDailyHighscores(auth_token) {
        await this.validateAuthToken(auth_token, false);

        const connection = await this.getConnection();

        const top100Highscores = await connection.query(
            "SELECT username, highscore_daily as score FROM user WHERE admin = false ORDER BY score DESC LIMIT 100"
        );

        const playerHighscore = await connection.query(
            "SELECT rank, score FROM (SELECT ROW_NUMBER() OVER (ORDER BY highscore_daily DESC, username) as rank, highscore_daily as score, auth_token FROM user WHERE admin = false) tbl WHERE auth_token = ?",
            [auth_token]
        );

        connection.release();

        log.info("UserController", "Queried daily highscores!");
        return {
            highscores: top100Highscores,
            playerRank: Number(playerHighscore[0].rank),
            playerHighscore: playerHighscore[0].score,
        };
    }

    /**
     * Gets the weekly highscores of the top 100 players and the logged in player. Throws an error if the auth_token is invalid.
     * @param {string} auth_token
     * @returns {{
     *  highscores: ({
     *  score: number,
     *  username: string,
     * })[],
     *  playerRank: number,
     *  playerHighscore: number,
     * }} weekly highscores
     */
    async getWeeklyHighscores(auth_token) {
        await this.validateAuthToken(auth_token, false);

        const connection = await this.getConnection();

        const top100Highscores = await connection.query(
            "SELECT username, highscore_weekly as score FROM user WHERE admin = false ORDER BY score DESC LIMIT 100"
        );

        const playerHighscore = await connection.query(
            "SELECT rank, score FROM (SELECT ROW_NUMBER() OVER (ORDER BY highscore_weekly DESC, username) as rank, highscore_weekly as score, auth_token FROM user WHERE admin = false) tbl WHERE auth_token = ?",
            [auth_token]
        );

        connection.release();

        log.info("UserController", "Queried weekly highscores!");
        return {
            highscores: top100Highscores,
            playerRank: Number(playerHighscore[0].rank),
            playerHighscore: playerHighscore[0].score,
        };
    }

    /**
     * Gets the monthly highscores of the top 100 players and the logged in player. Throws an error if the auth_token is invalid.
     * @param {string} auth_token
     * @returns {{
     *  highscores: ({
     *  score: number,
     *  username: string,
     * })[],
     *  playerRank: number,
     *  playerHighscore: number,
     * }} monthly highscores
     */
    async getMonthlyHighscores(auth_token) {
        await this.validateAuthToken(auth_token, false);

        const connection = await this.getConnection();

        const top100Highscores = await connection.query(
            "SELECT username, highscore_monthly as score FROM user WHERE admin = false ORDER BY score DESC LIMIT 100"
        );

        const playerHighscore = await connection.query(
            "SELECT rank, score FROM (SELECT ROW_NUMBER() OVER (ORDER BY highscore_monthly DESC, username) as rank, highscore_monthly as score, auth_token FROM user WHERE admin = false) tbl WHERE auth_token = ?",
            [auth_token]
        );

        connection.release();

        log.info("UserController", "Queried monthly highscores!");
        return {
            highscores: top100Highscores,
            playerRank: Number(playerHighscore[0].rank),
            playerHighscore: playerHighscore[0].score,
        };
    }

    /**
     * Gets the user who has the highest score at the monthly highscores. Increments the monthly wins of the user.
     *
     * @returns {{
     * 		username: string,
     * 		email: string,
     * 		score: number
     * }} some information about the winner
     */
    async winnerOfTheMonth() {
        const connection = await this.getConnection();

        const result = await connection.query(
            "SELECT email, username, highscore_monthly as score FROM user WHERE admin = false ORDER BY highscore_monthly DESC LIMIT 1"
        );

        if (result.length === 0) {
            connection.release();
            throw new API_Error(
                "No winner of the month found!",
                500,
                "no_winner_error"
            );
        }

        log.info(
            "UserController",
            `The winner of the month is ${result[0].username} (${result[0].email})!`
        );

        await connection.query(
            "UPDATE user SET monthly_wins = monthly_wins + 1 WHERE email = ?",
            [result[0].email]
        );

        connection.release();

        return {
            username: result[0].username,
            email: result[0].email,
            score: result[0].score,
        };
    }

    /**
     * Gets the user that belongs to the given token. Throws an error if the token is invalid.
     * @param {string} auth_token
     * @returns {User} the user
     */
    async getUserOfToken(auth_token) {
        const connection = await this.getConnection();

        const result = await connection.query(
            "SELECT * FROM user WHERE auth_token = ?",
            [auth_token]
        );

        connection.release();

        if (result.length === 0) {
            throw new Error("Invalid authentification token!");
        }

        log.info("UserController", `Queried user data of '${result[0].username}'!`);
        return new User(
            result[0].username,
            result[0].email,
            result[0].password,
            result[0].admin,
            result[0].highscore_daily,
            result[0].highscore_weekly,
            result[0].highscore_monthly,
            result[0].monthly_wins,
            result[0].favourite_color,
            result[0].mother_name,
            result[0].place_of_birth,
            result[0].auth_token,
            result[0].reset_password_token
        );
    }

    async isAdminAccountExisting() {
        const connection = await this.getConnection();
        const result = await connection.query(
            "SELECT * FROM user WHERE admin = true"
        );
        connection.release();

        return result.length > 0;
    }

    async createAdminAccount() {
        const connection = await this.getConnection();
        await connection.query(
            "INSERT INTO user (username, email, password, admin) VALUES (?, ?, ?, ?)",
            ["admin_admin", "admin@admin.com ", await hash_password("admin123"), true]
        );
        connection.release();
        log.info("UserController", "Inserted admin account into database!");
    }

    async isDefaultUserAccountExisting() {
        const connection = await this.getConnection();
        const result = await connection.query(
            "SELECT * FROM user WHERE username = 'user_user'"
        );
        connection.release();

        return result.length > 0;
    }

    async createDefaultUserAccount() {
        const connection = await this.getConnection();
        await connection.query(
            "INSERT INTO user (username, email, password, admin) VALUES (?, ?, ?, ?)",
            ["user_user", "user@user.com ", await hash_password("user123"), false]
        );
        connection.release();
        log.info("UserController", "Inserted default user account into database!");
    }

    randomEmail(i) {
        const emailServers = [
            "t-online.de",
            "gmail.com",
            "yahoo.com",
            "outlook.com",
            "web.de",
            "gmx.de",
            "hotmail.com",
        ];
        const emailServer =
            emailServers[Math.floor(Math.random() * emailServers.length)];
        return `user.${i}@${emailServer}`;
    }

    async areRandomPlayersExisting() {
        const connection = await this.getConnection();
        const result = await connection.query(
            "SELECT COUNT(*) as count FROM user WHERE email LIKE 'user.%'"
        );
        connection.release();

        return result[0].count > 0;
    }

    async createRandomPlayers(count) {
        const connection = await this.getConnection();
        for (let i = 0; i < count; i++) {
            const email = this.randomEmail(i);
            const username = generateUsername("_", 0, 15);
            const password = username + "123";
            const highscore_daily = Math.floor((Math.random() * 1_000_000) / 50) * 50;
            const highscore_weekly =
                Math.floor((Math.random() * 25_000_000) / 50) * 50;
            const highscore_monthly =
                Math.floor((Math.random() * 100_000_000) / 50) * 50;
            const monthly_wins = Math.floor(Math.random() * 10);
            const favourite_color = "blue";
            const mother_name = "Maria";
            const place_of_birth = "Berlin";

            await connection.query(
                "INSERT INTO user (username, email, password, highscore_daily, highscore_weekly, highscore_monthly, monthly_wins, favourite_color, mother_name, place_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    username,
                    email,
                    await hash_password(password),
                    highscore_daily,
                    highscore_weekly,
                    highscore_monthly,
                    monthly_wins,
                    favourite_color,
                    mother_name,
                    place_of_birth,
                ]
            );
        }
        connection.release();
        log.info("UserController", `Inserted ${count} random players!`);
    }
    /**
     * Deletes the account with the associated auth token.
     * @param {string} authToken
     */
    async deleteAccount(auth_token) {
        const connection = await this.getConnection();
        const result = await connection.query(
            "DELETE FROM user WHERE auth_token = ?",
            [auth_token]
        );
        connection.release();
        if (result.affectedRows === 0) {
            throw new API_Error("Invalid authentification token!", 401, "auth_error");
        }
        log.info("UserController", "Deleted user account!");
    }
}

module.exports = new UserController();
