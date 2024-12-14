const ControllerBase = require("./ControllerBase");
const UserController = require("./UserController");
const Question = require("../models/Question");
const fs = require("fs/promises");
const validator = require("validator");
const log = require("npmlog");
const API_Error = require("../errorhandling/API_Error");

class QuestionController extends ControllerBase {
    async initialize() {
        const connection = await this.getConnection();

        const tableExisting =
            (await connection.query("SHOW TABLES LIKE 'questions'")).length > 0;
        await connection.query(
            `CREATE TABLE IF NOT EXISTS questions (
				id INT PRIMARY KEY AUTO_INCREMENT,
				question_de VARCHAR(400) NOT NULL,
				right_answer_de VARCHAR(400) NOT NULL,
				answer1_de VARCHAR(400) NOT NULL,
				answer2_de VARCHAR(400) NOT NULL,
				answer3_de VARCHAR(400) NOT NULL,
				question_en VARCHAR(400) NOT NULL,
				right_answer_en VARCHAR(400) NOT NULL,
				answer1_en VARCHAR(400) NOT NULL,
				answer2_en VARCHAR(400) NOT NULL,
				answer3_en VARCHAR(400) NOT NULL,
				difficulty int NOT NULL,
				category VARCHAR(100) NOT NULL,
				creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				gameOfTheDay_question BOOLEAN DEFAULT FALSE 
			);`
        );
        connection.release();
        if (!tableExisting)
            log.info("QuestionController", "Created table 'questions'!");
        else
            log.warn(
                "QuestionController",
                "Table 'questions' already exists - keeping it! this is fine as long as the table's schema did not change."
            );

        if (process.env["INSERT_BASIC_QUESTIONS"] === "true") {
            const jsonFileName = __dirname + "/../models/all_questions.json";

            const data = await fs.readFile(jsonFileName, "utf8");

            const questionsData = JSON.parse(data);

            for (const questionData of questionsData) {
                await this.insertQuestionWithoutAdminRights(questionData);
            }
            log.info("QuestionController", "Filled database with questions!");
        }

        await this.selectGameOfTheDay();
    }

    /**
     * Returns all questions from the database. Throws an exception if the auth_token is invalid or the user is not an admin.
     * @param {string} auth_token the auth_token of the logged in admin
     * @returns {Question[]} questions
     */
    async getAllQuestions(auth_token) {
        await UserController.validateAuthToken(auth_token, 1);

        const connection = await this.getConnection();

        const result = await connection.query("SELECT * FROM questions");

        let questions = result.map(
            (item) =>
                new Question(
                    item.id,
                    item.question_de,
                    item.right_answer_de,
                    item.answer1_de,
                    item.answer2_de,
                    item.answer3_de,
                    item.question_en,
                    item.right_answer_en,
                    item.answer1_en,
                    item.answer2_en,
                    item.answer3_en,
                    item.difficulty,
                    item.category,
                    item.creation_date,
                    item.gameofTheDay_question
                )
        );

        connection.release();
        return questions;
    }
    /**
     * Returns the set of questions for the game of the day. They are ordered by difficulty. Throws an exception if the auth_token is invalid.
     * Throws an exception if the user already played the game of the day.
     * @param {string} auth_token the auth_token of the logged in user
     * @returns {Question[]} questions
     */
    async getGameOfTheDayQuestions(auth_token) {
        await UserController.validateAuthToken(auth_token, 0);

        const connection = await this.getConnection();

        const playedGameOfTheDay = await connection.query(
            "UPDATE user SET played_game_of_the_day = TRUE WHERE auth_token = ? AND played_game_of_the_day = FALSE",
            [auth_token]
        );

        if (playedGameOfTheDay.affectedRows === 0) {
            connection.release();
            throw new API_Error(
                "Already played the game of the day!",
                400,
                "already_played_game_of_the_day_error"
            );
        }

        const result = await connection.query(
            "SELECT * FROM questions WHERE gameOfTheDay_question = TRUE ORDER BY difficulty"
        );

        let questions = result.map(
            (item) =>
                new Question(
                    item.id,
                    item.question_de,
                    item.right_answer_de,
                    item.answer1_de,
                    item.answer2_de,
                    item.answer3_de,
                    item.question_en,
                    item.right_answer_en,
                    item.answer1_en,
                    item.answer2_en,
                    item.answer3_en,
                    item.difficulty,
                    item.category,
                    item.creation_date,
                    item.gameofTheDay_question
                )
        );

        connection.release();
        return questions;
    }
    /**
     * Returns a set of questions for a quick game. They are ordered by difficulty. Throws an exception if the auth_token is invalid.
     * @param {string} auth_token the auth_token of the logged in user
     * @returns {Question[]} questions
     */
    async getQuickGameQuestions(auth_token) {
        await UserController.validateAuthToken(auth_token, 0);

        const connection = await this.getConnection();

        const result = await connection.query(
            "SELECT * FROM (SELECT * FROM questions ORDER BY RAND()) randomQuestions GROUP BY difficulty"
        );

        let questions = result.map(
            (item) =>
                new Question(
                    item.id,
                    item.question_de,
                    item.right_answer_de,
                    item.answer1_de,
                    item.answer2_de,
                    item.answer3_de,
                    item.question_en,
                    item.right_answer_en,
                    item.answer1_en,
                    item.answer2_en,
                    item.answer3_en,
                    item.difficulty,
                    item.category,
                    item.creation_date,
                    item.gameofTheDay_question
                )
        );

        connection.release();

        log.info(
            "QuestionController",
            "Queried 15 random questions for a quick game!"
        );
        return questions;
    }

    /**
     * Returns the set of questions of the latest show. These are the most recently added questions (per difficulty). They are ordered by difficulty. Throws an exception if the auth_token is invalid.
     * @param {string} auth_token the auth_token of the logged in user
     * @returns {Question[]} questions
     */
    async getLatestShowQuestions(auth_token) {
        await UserController.validateAuthToken(auth_token, 0);

        const connection = await this.getConnection();

        const result = await connection.query(
            "SELECT * FROM (SELECT * FROM questions ORDER BY creation_date) latestQuestions GROUP BY difficulty"
        );

        let questions = result.map(
            (item) =>
                new Question(
                    item.id,
                    item.question_de,
                    item.right_answer_de,
                    item.answer1_de,
                    item.answer2_de,
                    item.answer3_de,
                    item.question_en,
                    item.right_answer_en,
                    item.answer1_en,
                    item.answer2_en,
                    item.answer3_en,
                    item.difficulty,
                    item.category,
                    item.creation_date,
                    item.gameofTheDay_question
                )
        );

        connection.release();

        log.info("QuestionController", "Queried questions of the latest show!");
        return questions;
    }

    /**
     * Returns a set of questions for training. Only questions of the passed categories are returned. Throws an exception if the auth_token is invalid.
     * @param {string} auth_token the auth_token of the logged in user
     * @param {string[]} categories
     * @returns {Question[]} questions
     */
    async getTrainQuestions(auth_token, categories) {
        await UserController.validateAuthToken(auth_token, 0);

        const connection = await this.getConnection();
        let query = "SELECT * FROM questions";

        if (categories && categories.length > 0) {
            query += " WHERE category IN (?)";
        }

        query += " ORDER BY RAND() LIMIT 15";

        const result = await connection.query(query, [categories]);

        let questions = result.map(
            (item) =>
                new Question(
                    item.id,
                    item.question_de,
                    item.right_answer_de,
                    item.answer1_de,
                    item.answer2_de,
                    item.answer3_de,
                    item.question_en,
                    item.right_answer_en,
                    item.answer1_en,
                    item.answer2_en,
                    item.answer3_en,
                    item.difficulty,
                    item.category,
                    item.creation_date,
                    item.gameofTheDay_question
                )
        );

        connection.release();

        log.info(
            "QuestionController",
            "Queried 15 random questions for training!"
        );
        return questions;
    }

    /**
     * Inserts a new question into the database. The passed auth_token requires admin privileges. Throws an exception if the auth_token is invalid or the user is not an admin.
     * @param {string} auth_token the auth_token of the logged in admin
     * @param {Question} question the question to insert
     */
    async insertQuestion(auth_token, question) {
        await UserController.validateAuthToken(auth_token, 1);

        await this.insertQuestionWithoutAdminRights(question);

        log.info("QuestionController", "Inserted new question into database!");
    }

    /**
     * Inserts a new question into the database. Throws an error if the question is invalid.
     * @param {Question} question question to insert
     */
    async insertQuestionWithoutAdminRights(question) {
        if (!question.question_de || validator.isEmpty(question.question_de)) {
            throw new API_Error(
                "Attribute question.de is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (!question.question_en || validator.isEmpty(question.question_en)) {
            throw new API_Error(
                "Attribute question.en is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (
            !question.right_answer_de ||
            validator.isEmpty(question.right_answer_de)
        ) {
            throw new API_Error(
                "Attribute answers[0].de is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (!question.answer1_de || validator.isEmpty(question.answer1_de)) {
            throw new API_Error(
                "Attribute answers[1].de is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (!question.answer2_de || validator.isEmpty(question.answer2_de)) {
            throw new API_Error(
                "Attribute answers[2].de is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (!question.answer3_de || validator.isEmpty(question.answer3_de)) {
            throw new API_Error(
                "Attribute answers[3].de is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (!question.question_de || validator.isEmpty(question.question_de)) {
            throw new API_Error(
                "Attribute question.de is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (
            !question.right_answer_en ||
            validator.isEmpty(question.right_answer_en)
        ) {
            throw new API_Error(
                "Attribute answers[0].en is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (!question.answer1_en || validator.isEmpty(question.answer1_en)) {
            throw new API_Error(
                "Attribute answers[1].en is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (!question.answer2_en || validator.isEmpty(question.answer2_en)) {
            throw new API_Error(
                "Attribute answers[2].en is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (!question.answer3_en || validator.isEmpty(question.answer3_en)) {
            throw new API_Error(
                "Attribute answers[3].en is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (!question.category || validator.isEmpty(question.category)) {
            throw new API_Error(
                "Attribute category is missing or empty!",
                400,
                "question_format_error"
            );
        }

        if (
            !question.difficulty ||
            ![
                50, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000,
                64000, 125000, 500000, 1000000,
            ].includes(question.difficulty)
        ) {
            throw new API_Error(
                `Attribute difficulty of '${question.difficulty}' is missing or invalid!`,
                400,
                "question_format_error"
            );
        }

        const connection = await this.getConnection();

        const result = await connection.query(
            "INSERT INTO questions (question_de, right_answer_de, answer1_de, answer2_de, answer3_de, question_en, right_answer_en, answer1_en, answer2_en, answer3_en, difficulty, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                question.question_de,
                question.right_answer_de,
                question.answer1_de,
                question.answer2_de,
                question.answer3_de,
                question.question_en,
                question.right_answer_en,
                question.answer1_en,
                question.answer2_en,
                question.answer3_en,
                question.difficulty,
                question.category,
            ]
        );

        connection.release();

        if (result.affectedRows === 0) {
            throw new API_Error(
                "Failed to insert new question!",
                500,
                "fatal_error"
            );
        }
    }

    /**
     * Deletes a question from the database. The passed auth_token requires admin privileges. Throws an exception if the auth_token is invalid, the user is not an admin or the question id is invalid.
     * @param {string} auth_token the auth_token of the logged in admin
     * @param {number} questionId the id of the question to delete
     */
    async deleteQuestion(auth_token, questionId) {
        await UserController.validateAuthToken(auth_token, 1);

        const connection = await this.getConnection();

        const result = await connection.query(
            "DELETE FROM questions WHERE id = ?",
            [questionId]
        );
        if (result.affectedRows === 0) {
            connection.release();
            throw new API_Error(
                "Invalid question id!",
                404,
                "invalid_id_error"
            );
        }

        connection.release();

        log.info("QuestionController", "Deleted question from database!");
    }

    /**
     * Updates a question from the database. The passed auth_token requires admin privileges. Throws an exception if the auth_token is invalid, the user is not an admin or the question id is invalid.
     * @param {string} auth_token the auth_token of the logged in admin
     * @param {id} id the id of the question to update
     * @param {Question} question the updated question
     */
    async editQuestion(auth_token, id, question) {
        await UserController.validateAuthToken(auth_token, 1);

        const connection = await this.getConnection();

        // Create sql SET string (e.g. SET question_de = ?, answer1_de = ?, ...) based on given question
        let set_string = "SET ";
        const values = [];
        const modifieable_attributes = [
            "question_de",
            "right_answer_de",
            "answer1_de",
            "answer2_de",
            "answer3_de",
            "question_en",
            "right_answer_en",
            "answer1_en",
            "answer2_en",
            "answer3_en",
            "difficulty",
            "category",
        ];
        for (const attribute of modifieable_attributes) {
            if (!question[attribute]) {
                connection.release();
                throw new API_Error("At least one attribute is missing or empty!", 400, "question_format_error");
            }
            set_string += `${attribute} = ?, `;
            values.push(question[attribute]);
        }
        set_string = set_string.substring(0, set_string.length - 2);

        if (values.length === 0) {
            connection.release();
            return;
        }

        const result = await connection.query(
            `
            UPDATE questions
            ${set_string}
            WHERE id = ?
            `,
            [...values, id]
        );

        connection.release();

        if (result.affectedRows === 0) {
            throw new API_Error("Invalid question id!", 401, "auth_error");
        }

        log.info("QuestionController", "Updated question in database!");
    }

    /**
     * Select 15 questions for the game of the day from the database and set their gameOfTheDay_question attribute to true. Reset the current game of the day questions to false.
     */
    async selectGameOfTheDay() {
        const connection = await this.getConnection();

        await connection.query(
            "UPDATE user SET played_game_of_the_day = FALSE WHERE played_game_of_the_day = TRUE"
        );

        await connection.query(
            "UPDATE questions SET gameOfTheDay_question = false WHERE gameOfTheDay_question = true"
        );

        const gameOfTheDayQuestions = await connection.query(
            "SELECT * FROM (SELECT * FROM questions ORDER BY RAND()) randomQuestions GROUP BY difficulty"
        );

        const questionIDs = gameOfTheDayQuestions.map(
            (question) => question.id
        );

        if (questionIDs.length > 0) {
            await connection.query(
                "UPDATE questions SET gameOfTheDay_question = true WHERE id IN (?)",
                [questionIDs]
            );
        }

        connection.release();
        log.info(
            "QuestionController",
            "Selected 15 new questions for the game of the day!"
        );
    }
}

module.exports = new QuestionController();
